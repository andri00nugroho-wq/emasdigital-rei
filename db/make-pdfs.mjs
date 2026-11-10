import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { Client } from "pg";

const OUT = path.join(process.cwd(), "public", "downloads");
fs.mkdirSync(OUT, { recursive: true });

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 52;
const CW = PAGE_W - M * 2;

const C = {
  purple: "#371F76",
  purple600: "#5436AA",
  purple900: "#17083B",
  gold: "#D4AF37",
  goldSoft: "#F3E7BD",
  cream: "#F7F5EE",
  ink: "#241E38",
  muted: "#6E6880",
  line: "#E4E0D6",
  white: "#FFFFFF",
};

function newDoc(title) {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: M, bottom: M, left: M, right: M },
    bufferPages: true,
    info: {
      Title: title,
      Author: "Raja Emas Indonesia",
      Subject: "Panduan investasi emas digital",
      Creator: "Raja Emas Indonesia",
    },
  });
  const chunks = [];
  doc.on("data", (c) => chunks.push(c));
  doc.pipe(fs.createWriteStream(path.join(OUT, title.file)));
  doc.__chunks = chunks;
  return doc;
}

function finalize(doc) {
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    if (i === 0) continue;
    const y = PAGE_H - 34;
    doc.save();
    const oldBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.moveTo(M, y - 10).lineTo(PAGE_W - M, y - 10).lineWidth(0.6).strokeColor(C.line).stroke();
    doc.font("Helvetica").fontSize(7.5).fillColor(C.muted)
      .text("Raja Emas Indonesia   |   rajaemasindonesia.co.id", M, y, { width: CW / 2, align: "left", lineBreak: false });
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(C.purple)
      .text(`${i + 1}`, PAGE_W - M - 60, y, { width: 60, align: "right", lineBreak: false });
    doc.page.margins.bottom = oldBottom;
    doc.restore();
  }
  doc.end();
}

function cover(doc, { kicker, title, subtitle, meta }) {
  doc.rect(0, 0, PAGE_W, PAGE_H).fill(C.purple);
  doc.rect(0, 0, PAGE_W, 6).fill(C.gold);
  // decorative arcs
  doc.save();
  doc.circle(PAGE_W + 40, 120, 150).lineWidth(1).strokeColor("#4B2F91").stroke();
  doc.circle(PAGE_W + 40, 120, 210).lineWidth(0.8).strokeColor("#432A85").stroke();
  doc.circle(-60, PAGE_H - 120, 170).lineWidth(0.8).strokeColor("#432A85").stroke();
  doc.restore();

  doc.image(path.join(process.cwd(), "public", "logo-rei.png"), M, 64, { height: 46 });

  doc.font("Helvetica-Bold").fontSize(9).fillColor(C.gold).text(kicker.toUpperCase(), M, 250, { characterSpacing: 2.4 });
  doc.moveTo(M, 272).lineTo(M + 46, 272).lineWidth(2).strokeColor(C.gold).stroke();

  doc.font("Helvetica-Bold").fontSize(40).fillColor(C.white).text(title, M, 294, { width: CW - 44, lineGap: -2 });
  doc.font("Helvetica").fontSize(14).fillColor("#CFC6EA").text(subtitle, M, doc.y + 18, { width: CW - 70, lineGap: 5 });

  doc.rect(M, PAGE_H - 150, CW, 76).fill("#2A155F");
  doc.rect(M, PAGE_H - 150, 4, 76).fill(C.gold);
  doc.font("Helvetica").fontSize(8).fillColor("#9F93C9").text(meta.label, M + 20, PAGE_H - 132, { characterSpacing: 1.6 });
  doc.font("Helvetica-Bold").fontSize(11).fillColor(C.white).text(meta.value, M + 20, PAGE_H - 116, { width: CW - 40 });
  doc.font("Helvetica").fontSize(7.5).fillColor("#8C80B8").text("Dokumen ini bersifat edukasi, bukan rekomendasi investasi personal.", M + 20, PAGE_H - 96, { width: CW - 40 });
}

function content(doc, kicker, title, lead) {
  doc.addPage();
  let y = M + 6;
  doc.font("Helvetica-Bold").fontSize(8).fillColor(C.gold).text(kicker.toUpperCase(), M, y, { characterSpacing: 1.8 });
  y += 18;
  doc.font("Helvetica-Bold").fontSize(25).fillColor(C.purple).text(title, M, y, { width: CW });
  y = doc.y + 8;
  doc.moveTo(M, y).lineTo(M + 48, y).lineWidth(2.4).strokeColor(C.gold).stroke();
  y += 18;
  if (lead) {
    doc.font("Helvetica").fontSize(11.5).fillColor(C.muted).text(lead, M, y, { width: CW - 24, lineGap: 4 });
    y = doc.y + 20;
  }
  return y;
}

function ensure(doc, y, need) {
  if (y + need > PAGE_H - M - 44) {
    doc.addPage();
    return M + 4;
  }
  return y;
}

function para(doc, y, text, opts = {}) {
  const size = opts.size || 10.5;
  const width = opts.width || CW;
  doc.font(opts.bold ? "Helvetica-Bold" : "Helvetica").fontSize(size).fillColor(opts.color || C.ink);
  const h = doc.heightOfString(text, { width, lineGap: opts.lineGap ?? 4 });
  y = ensure(doc, y, h);
  doc.text(text, opts.x || M, y, { width, lineGap: opts.lineGap ?? 4, align: opts.align || "left" });
  return doc.y + (opts.after ?? 10);
}

function h2(doc, y, text) {
  y = ensure(doc, y, 40);
  doc.font("Helvetica-Bold").fontSize(14).fillColor(C.purple).text(text, M, y, { width: CW });
  return doc.y + 8;
}

function bullet(doc, y, text, opts = {}) {
  const width = CW - 22;
  doc.font("Helvetica").fontSize(10.5);
  const h = doc.heightOfString(text, { width, lineGap: 3.5 });
  y = ensure(doc, y, h + 6);
  doc.circle(M + 4, y + 5.5, 2.1).fill(C.gold);
  doc.font("Helvetica").fontSize(10.5).fillColor(C.ink).text(text, M + 18, y, { width, lineGap: 3.5 });
  return doc.y + (opts.after ?? 6);
}

function numbered(doc, y, n, text) {
  const width = CW - 34;
  doc.font("Helvetica").fontSize(10.5);
  const h = doc.heightOfString(text, { width, lineGap: 3.5 });
  y = ensure(doc, y, h + 10);
  doc.circle(M + 9, y + 6, 9).fill(C.purple);
  doc.font("Helvetica-Bold").fontSize(8.5).fillColor(C.white).text(String(n), M + 1, y + 2.6, { width: 16, align: "center" });
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(C.ink).text(text, M + 27, y, { width, lineGap: 3.5 });
  return doc.y + 8;
}

function callout(doc, y, title, text, opts = {}) {
  const width = CW - 36;
  doc.font("Helvetica-Bold").fontSize(9.5);
  const th = doc.heightOfString(title, { width });
  doc.font("Helvetica").fontSize(9.5);
  const bh = doc.heightOfString(text, { width, lineGap: 3.5 });
  const boxH = th + bh + 34;
  y = ensure(doc, y, boxH + 8);
  doc.roundedRect(M, y, CW, boxH, 8).fill(opts.fill || C.cream);
  doc.roundedRect(M, y, 4, boxH, 2).fill(opts.accent || C.gold);
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(C.purple).text(title, M + 18, y + 14, { width });
  doc.font("Helvetica").fontSize(9.5).fillColor(C.ink).text(text, M + 18, y + 14 + th + 6, { width, lineGap: 3.5 });
  return y + boxH + 12;
}

function table(doc, y, columns, rows, opts = {}) {
  const rowH = 22;
  const width = CW;
  // header
  y = ensure(doc, y, rowH + 10);
  doc.rect(M, y, width, rowH).fill(C.purple);
  let x = M;
  columns.forEach((col) => {
    doc.font("Helvetica-Bold").fontSize(8).fillColor(C.white).text(col.label, x + 8, y + 7, { width: col.w - 12, align: col.align || "left", lineBreak: false });
    x += col.w;
  });
  y += rowH;
  rows.forEach((row, ri) => {
    y = ensure(doc, y, rowH);
    if (ri % 2 === 0) doc.rect(M, y, width, rowH).fill(C.cream);
    let cx = M;
    row.forEach((cellText, ci) => {
      const col = columns[ci];
      doc.font(ci === 0 ? "Helvetica-Bold" : "Helvetica").fontSize(8.6).fillColor(ci === 0 ? C.purple900 : C.ink)
        .text(String(cellText), cx + 8, y + 7, { width: col.w - 12, align: col.align || "left", lineBreak: false });
      cx += col.w;
    });
    doc.moveTo(M, y + rowH).lineTo(M + width, y + rowH).lineWidth(0.5).strokeColor(C.line).stroke();
    y += rowH;
  });
  return y + (opts.after ?? 12);
}

/* ============================================================
   1. Panduan Lengkap Investasi Emas Digital
   ============================================================ */
function buildGuide() {
  const doc = newDoc({
    file: "panduan-investasi-emas-digital.pdf",
    title: "Panduan Lengkap Investasi Emas Digital",
  });

  cover(doc, {
    kicker: "Edisi 2026  |  E-book gratis",
    title: "Panduan Lengkap Investasi Emas Digital",
    subtitle: "Dari rekening pertama hingga strategi jangka panjang - langkah demi langkah untuk investor pemula.",
    meta: { label: "DISUSUN OLEH", value: "Tim Riset Raja Emas Indonesia" },
  });

  // -- page 2: daftar isi + intro
  let y = content(doc, "Selamat datang", "Emas, cara lama yang tetap relevan", "Selama ribuan tahun emas bertahan sebagai penyimpan nilai. Yang berubah adalah cara memilikinya - kini bisa dimulai dari nominal kecil, lewat ponsel Anda.");
  y = para(doc, y, "Banyak orang menunda investasi karena menganggap emas hanya untuk yang punya dana besar. Padahal dengan emas digital, Anda bisa membeli mulai 0,1 gram, tanpa memikirkan tempat penyimpanan atau risiko kehilangan fisik. E-book ini merangkum hal-hal yang perlu Anda pahami sebelum membeli emas pertama, sekaligus strategi yang bisa dijalankan konsisten.");
  y = para(doc, y, "Kami menulis panduan ini netral dan praktis. Tidak ada janji keuntungan instan. Yang kami bagikan adalah kerangka berpikir, contoh perhitungan, dan daftar periksa agar keputusan Anda lebih terukur.", { after: 18 });

  y = h2(doc, y, "Isi panduan");
  const toc = [
    ["01", "Mengapa emas masih relevan", "Inflasi, nilai tukar, dan fungsi lindung nilai"],
    ["02", "Emas digital vs fisik vs reksa dana", "Kelebihan, keterbatasan, dan kecocokan profil"],
    ["03", "Membaca harga emas", "Spread, buyback, dan harga per gram"],
    ["04", "Mulai dari nominal kecil", "Lima langkah membuka dan membeli"],
    ["05", "Strategi beli rutin", "DCA, disiplin, dan alokasi portofolio"],
    ["06", "Risiko dan keamanan", "Daftar periksa melindungi akun"],
    ["07", "Pajak dan administrasi", "Apa yang perlu dicatat dan dikonsultasikan"],
    ["08", "Rencana aksi 30 hari", "Lembar kerja untuk mulai pekan ini"],
  ];
  toc.forEach(([n, t, d]) => {
    y = ensure(doc, y, 34);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(C.gold).text(n, M, y, { width: 26 });
    doc.font("Helvetica-Bold").fontSize(10.5).fillColor(C.ink).text(t, M + 30, y, { width: CW - 30 });
    doc.font("Helvetica").fontSize(8.8).fillColor(C.muted).text(d, M + 30, y + 14, { width: CW - 30 });
    doc.moveTo(M, y + 28).lineTo(M + CW, y + 28).lineWidth(0.5).strokeColor(C.line).stroke();
    y += 34;
  });

  y = ensure(doc, y, 70);
  y = callout(doc, y + 4, "Cara membaca e-book ini", "Anda tidak perlu membaca berurutan. Jika baru mulai, lompat ke Bab 4. Jika sudah punya akun tetapi belum punya strategi, mulai dari Bab 5. Gunakan lembar kerja di Bab 8 untuk mencatat keputusan Anda.");

  // -- Bab 1
  y = content(doc, "Bab 01", "Mengapa emas masih relevan", "Emas bukan investasi yang menghasilkan bunga atau dividen. Nilainya berasal dari kelangkaan, permintaan global, dan kepercayaan pasar.");
  y = para(doc, y, "Ketika daya beli uang menurun karena inflasi, harga barang dalam rupiah cenderung naik. Emas historically bergerak berlawanan dengan pelemahan mata uang dalam jangka panjang, meskipun dalam jangka pendek harganya bisa fluktuatif. Karena itu emas sering dipakai sebagai lapisan pertahanan dalam portofolio, bukan mesin pertumbuhan utama.");
  y = h2(doc, y, "Tiga fungsi utama emas");
  y = bullet(doc, y, "Lindung nilai terhadap inflasi dan pelemahan nilai tukar.");
  y = bullet(doc, y, "Diversifikasi, karena pergerakannya tidak selalu searah saham atau obligasi.");
  y = bullet(doc, y, "Likuiditas, karena emas mudah dijual kembali, terutama dalam bentuk digital.", { after: 10 });

  y = callout(doc, y, "Ingat prinsipnya", "Emas melindungi daya beli, bukan menjanjikan keuntungan cepat. Imbal hasil terbaik datang dari horizon panjang dan pembelian yang konsisten.");

  y = h2(doc, y, "Apa yang membuat harga emas bergerak?");
  y = para(doc, y, "Harga emas dipengaruhi permintaan global, suku bunga, nilai tukar dolar, kondisi geopolitik, dan permintaan bank sentral. Untuk investor ritel, faktor yang paling terasa adalah kurs: ketika rupiah melemah terhadap dolar, harga emas dalam rupiah biasanya ikut naik. Karena itu memantau harga harian penting, tetapi tidak perlu setiap jam.");
  y = para(doc, y, "Kesimpulannya: pahami peran emas dalam rencana keuangan Anda sebelum membeli. Tentukan porsi, horizon, dan tujuan sejak awal agar tidak panik saat harga turun.");

  // -- Bab 2
  y = content(doc, "Bab 02", "Emas digital, fisik, dan reksa dana", "Tidak ada bentuk yang paling baik untuk semua orang. Yang ada adalah bentuk yang paling cocok dengan tujuan dan kebiasaan Anda.");
  y = table(doc, y, [
    { label: "Aspek", w: 130 },
    { label: "Emas digital", w: 140 },
    { label: "Emas fisik", w: 130 },
    { label: "Reksa dana emas", w: 143.28 },
  ], [
    ["Modal awal", "Mulai 0,1 gram", "Pecahan terkecil", "Sesuai minimum produk"],
    ["Penyimpanan", "Tercatat di akun", "Perlu tempat aman", "Dikelola manajer investasi"],
    ["Likuiditas", "Tinggi, bisa dijual harian", "Bergantung pembeli", "Sesuai jadwal pencairan"],
    ["Biaya", "Spread transaksi", "Cetak, kirim, asuransi", "Biaya pengelolaan"],
    ["Rasa aman", "Bergantung reputasi penyedia", "Pegang benda fisik", "Bergantung manajer investasi"],
  ]);

  y = h2(doc, y, "Kapan memilih emas digital?");
  y = bullet(doc, y, "Anda ingin mulai dengan nominal kecil dan menambah secara rutin.");
  y = bullet(doc, y, "Anda ingin bisa menjual sebagian tanpa menjual seluruh kepemilikan.");
  y = bullet(doc, y, "Anda tidak ingin memikirkan penyimpanan fisik.");
  y = bullet(doc, y, "Anda berencana mencetak emas fisik ketika saldo sudah mencukupi.", { after: 10 });

  y = callout(doc, y, "Kombinasi yang wajar", "Banyak investor memakai emas digital untuk akumulasi dan emas fisik untuk kepemilikan jangka sangat panjang. Proporsinya disesuaikan kebutuhan, bukan mengikuti tren.");

  // -- Bab 3
  y = content(doc, "Bab 03", "Membaca harga emas tanpa bingung", "Harga yang Anda lihat adalah harga per gram. Namun ada dua angka penting: harga beli dan harga buyback.");
  y = h2(doc, y, "Harga beli dan buyback");
  y = para(doc, y, "Harga beli adalah harga saat Anda membeli emas. Harga buyback adalah harga saat Anda menjual kembali. Selisih keduanya disebut spread. Spread adalah biaya transaksi alami, bukan tanda penipuan. Semakin kecil spread, semakin efisien transaksi Anda.");
  y = callout(doc, y, "Contoh perhitungan", "Anda membeli 1 gram di harga Rp2.572.000. Beberapa waktu kemudian harga buyback Rp2.490.000. Selisih Rp82.000 (sekitar 3,2%) adalah spread. Agar impas, harga buyback perlu naik melewati selisih tersebut.");
  y = h2(doc, y, "Harga per gram pada pecahan kecil");
  y = para(doc, y, "Pecahan kecil seperti 0,1 gram sering memiliki harga per gram yang lebih tinggi karena biaya produksi dan kemasan. Bandingkan harga per gram, bukan hanya harga total, saat memilih pecahan.");
  y = para(doc, y, "Tips praktis: catat harga beli dan tanggal transaksi Anda. Dengan begitu Anda bisa menghitung hasil riil, bukan hanya melihat pergerakan harga harian.");

  // -- Bab 4
  y = content(doc, "Bab 04", "Mulai dari nominal kecil", "Lima langkah ini bisa diselesaikan dalam satu sesi, tanpa perlu menunggu waktu “yang tepat”.");
  y = numbered(doc, y, 1, "Tentukan tujuan dan horizon. Apakah untuk dana darurat, pendidikan anak, atau sekadar menyimpan nilai? Tujuan menentukan porsi dan frekuensi beli.");
  y = numbered(doc, y, 2, "Siapkan dana yang tidak akan dipakai dalam 12 bulan. Jangan memakai uang kebutuhan pokok atau dana utang.");
  y = numbered(doc, y, 3, "Pilih penyedia yang jelas izin dan prosedurnya. Periksa informasi perusahaan, kontak resmi, dan ketentuan biaya.");
  y = numbered(doc, y, 4, "Lakukan verifikasi akun. Siapkan identitas dan pastikan data yang Anda masukkan sesuai.");
  y = numbered(doc, y, 5, "Beli nominal kecil terlebih dahulu. Setelah memahami alur transaksi, baru tingkatkan secara bertahap.", { after: 12 });

  y = callout(doc, y, "Aturan 10%", "Untuk pemula, porsi emas yang wajar dalam portofolio sering berada di kisaran 5-15%. Angka ini bukan patokan mutlak; sesuaikan dengan profil risiko Anda.");
  y = para(doc, y, "Hindari membeli karena takut ketinggalan. Harga emas bisa turun setelah Anda membeli, dan itu normal. Yang penting adalah rencana Anda tetap berjalan.");

  // -- Bab 5
  y = content(doc, "Bab 05", "Strategi beli rutin yang realistis", "Dollar-cost averaging (DCA) berarti membeli dengan nominal tetap secara berkala, apa pun kondisi harga.");
  y = para(doc, y, "DCA mengurangi risiko membeli di puncak harga. Ketika harga turun, nominal yang sama mendapat gram lebih banyak. Ketika harga naik, Anda tetap disiplin. Kuncinya bukan menebak pasar, tetapi konsistensi.");
  y = table(doc, y, [
    { label: "Bulan", w: 110 },
    { label: "Nominal", w: 120 },
    { label: "Harga/gram", w: 130 },
    { label: "Gram", w: 130, align: "right" },
  ], [
    ["Januari", "Rp500.000", "Rp2.400.000", "0,208"],
    ["Februari", "Rp500.000", "Rp2.450.000", "0,204"],
    ["Maret", "Rp500.000", "Rp2.380.000", "0,210"],
    ["April", "Rp500.000", "Rp2.520.000", "0,198"],
    ["Total", "Rp2.000.000", "Rata-rata Rp2.437.500", "0,820"],
  ]);
  y = para(doc, y, "Pada contoh di atas, total gram yang terkumpul lebih besar dibandingkan jika seluruh dana dibelanjakan di bulan April. Ini menggambarkan manfaat DCA, meskipun hasil aktual selalu bergantung pada pergerakan harga.");
  y = h2(doc, y, "Menjual dengan terencana");
  y = para(doc, y, "Tentukan sebelumnya kapan Anda akan menjual: misalnya saat dana dibutuhkan, saat porsi emas melebihi target portofolio, atau saat ada kebutuhan lain yang lebih prioritas. Menjual karena panik sering kali merugikan.");

  // -- Bab 6
  y = content(doc, "Bab 06", "Risiko dan cara mengelolanya", "Mengenali risiko bukan berarti takut. Justru dengan mengenalnya, Anda bisa mengambil keputusan yang lebih tenang.");
  y = h2(doc, y, "Risiko yang perlu dipahami");
  y = bullet(doc, y, "Fluktuasi harga: harga bisa turun dalam jangka pendek, bahkan setelah tren naik panjang.");
  y = bullet(doc, y, "Risiko penyedia: reputasi, izin, dan praktik operasional penyedia memengaruhi keamanan aset.");
  y = bullet(doc, y, "Risiko akun: kata sandi lemah, OTP yang dibagikan, atau perangkat yang tidak aman.");
  y = bullet(doc, y, "Risiko likuiditas: dalam kondisi tertentu, proses penjualan bisa memerlukan waktu.", { after: 10 });

  y = h2(doc, y, "Daftar periksa keamanan akun");
  y = bullet(doc, y, "Aktifkan verifikasi dua langkah dan jangan bagikan kode OTP kepada siapa pun.");
  y = bullet(doc, y, "Gunakan kata sandi unik yang tidak dipakai di layanan lain.");
  y = bullet(doc, y, "Periksa alamat situs dan aplikasi resmi sebelum login.");
  y = bullet(doc, y, "Jangan mengakses akun melalui Wi-Fi publik tanpa perlindungan.");
  y = bullet(doc, y, "Catat transaksi penting dan simpan bukti kepemilikan.", { after: 10 });

  y = callout(doc, y, "Jika ada aktivitas mencurigakan", "Segera ganti kata sandi, hubungi layanan resmi, dan periksa riwayat transaksi. Jangan menunda karena laporan cepat membantu proses penanganan.");

  // -- Bab 7
  y = content(doc, "Bab 07", "Pajak dan administrasi", "Aturan perpajakan dapat berubah dan berbeda menurut profil wajib pajak. Bagian ini adalah gambaran umum, bukan nasihat pajak.");
  y = para(doc, y, "Transaksi emas dapat memiliki konsekuensi pajak, tergantung bentuk, tujuan, dan ketentuan yang berlaku. Untuk kepastian, konsultasikan dengan konsultan pajak atau otoritas pajak. Yang bisa Anda lakukan sekarang adalah merapikan catatan.");
  y = h2(doc, y, "Catatan yang sebaiknya disimpan");
  y = bullet(doc, y, "Tanggal, nominal, dan jumlah gram setiap pembelian.");
  y = bullet(doc, y, "Bukti transaksi dan riwayat penjualan.");
  y = bullet(doc, y, "Biaya tambahan seperti cetak fisik atau pengiriman.", { after: 10 });
  y = para(doc, y, "Catatan yang rapi memudahkan Anda menghitung hasil investasi dan memenuhi kewajiban administrasi tanpa repot di kemudian hari.");

  // -- Bab 8
  y = content(doc, "Bab 08", "Rencana aksi 30 hari", "Gunakan lembar ini untuk mengubah bacaan menjadi kebiasaan. Centang setiap langkah yang selesai.");
  y = numbered(doc, y, 1, "Minggu 1 - Tentukan tujuan, horizon, dan porsi emas dalam portofolio.");
  y = numbered(doc, y, 2, "Minggu 1 - Periksa penyedia, biaya, dan prosedur verifikasi.");
  y = numbered(doc, y, 3, "Minggu 2 - Siapkan dana khusus dan batas nominal per bulan.");
  y = numbered(doc, y, 4, "Minggu 2 - Buat akun dan selesaikan verifikasi.");
  y = numbered(doc, y, 5, "Minggu 3 - Lakukan pembelian pertama dengan nominal kecil.");
  y = numbered(doc, y, 6, "Minggu 3 - Catat transaksi dan atur pengingat beli rutin.");
  y = numbered(doc, y, 7, "Minggu 4 - Evaluasi: apakah rencana terasa realistis? Sesuaikan bila perlu.", { after: 12 });

  y = callout(doc, y, "Langkah berikutnya", "Unduh katalog produk dan checklist investasi emas di rajaemasindonesia.co.id/download. Jika ada pertanyaan, tim kami siap membantu melalui WhatsApp resmi yang tertera di situs.");

  // penutup
  y = ensure(doc, y, 110);
  doc.rect(M, y, CW, 86).fill(C.purple);
  doc.font("Helvetica-Bold").fontSize(8).fillColor(C.gold).text("RAJA EMAS INDONESIA", M + 22, y + 18, { characterSpacing: 1.6 });
  doc.font("Helvetica-Bold").fontSize(15).fillColor(C.white).text("Mulai kecil. Konsisten. Terukur.", M + 22, y + 34, { width: CW - 44 });
  doc.font("Helvetica").fontSize(8.6).fillColor("#CFC6EA").text("Kunjungi rajaemasindonesia.co.id untuk harga harian, produk, dan panduan lainnya.", M + 22, y + 58, { width: CW - 44 });

  finalize(doc);
  return doc;
}

/* ============================================================
   2. Checklist Mulai Investasi Emas
   ============================================================ */
function buildChecklist() {
  const doc = newDoc({ file: "checklist-mulai-investasi-emas.pdf", title: "Checklist 10 Langkah Mulai Investasi Emas" });

  cover(doc, {
    kicker: "Lembar kerja  |  Gratis",
    title: "Checklist 10 Langkah Mulai Investasi Emas",
    subtitle: "Lembar kerja praktis untuk menyiapkan dana, target, dan jadwal beli emas Anda.",
    meta: { label: "CARA PAKAI", value: "Cetak halaman 2-3 atau isi langsung secara digital" },
  });

  let y = content(doc, "Lembar kerja", "Sepuluh langkah, satu halaman", "Centang setiap langkah yang sudah selesai. Tidak perlu sempurna - yang penting mulai.");
  const steps = [
    ["Tentukan tujuan", "Dana darurat, pendidikan, pensiun, atau tujuan lain. Tulis satu tujuan utama."],
    ["Tetapkan horizon", "Kapan dana kemungkinan dipakai? Kurang dari 1 tahun, 1-3 tahun, atau lebih?"],
    ["Hitung porsi", "Berapa persen dari portofolio yang nyaman Anda tempatkan di emas?"],
    ["Siapkan dana khusus", "Pastikan dana bukan kebutuhan pokok dan tidak berasal dari utang."],
    ["Pilih penyedia", "Periksa izin, reputasi, kontak resmi, dan struktur biaya."],
    ["Baca ketentuan", "Pahami spread, biaya cetak, waktu pencairan, dan prosedur sengketa."],
    ["Verifikasi akun", "Siapkan identitas dan pastikan data sesuai dokumen resmi."],
    ["Beli nominal kecil", "Mulai dari nominal yang nyaman untuk memahami alur transaksi."],
    ["Catat transaksi", "Simpan tanggal, nominal, gram, dan bukti transaksi."],
    ["Atur jadwal rutin", "Pilih tanggal beli bulanan dan pasang pengingat."],
  ];
  steps.forEach(([t, d], i) => {
    y = ensure(doc, y, 52);
    doc.roundedRect(M, y, 13, 13, 2).lineWidth(1).strokeColor(C.purple).stroke();
    doc.font("Helvetica-Bold").fontSize(10.5).fillColor(C.purple).text(`${String(i + 1).padStart(2, "0")}  ${t}`, M + 24, y + 1, { width: CW - 24 });
    doc.font("Helvetica").fontSize(9).fillColor(C.muted).text(d, M + 24, y + 16, { width: CW - 24, lineGap: 2.5 });
    y += 38;
  });

  y = callout(doc, y + 4, "Target pribadi", "Nominal per bulan: Rp ________________     Target gram 12 bulan: ________________ gram\nTanggal beli rutin: ________________     Horizon: ________________");

  // page 3
  y = content(doc, "Perencanaan", "Isi rencana Anda", "Tulis dengan angka yang realistis. Rencana yang terlalu ambisius lebih sulit dijalankan.");
  y = h2(doc, y, "Alokasi bulanan");
  y = para(doc, y, "Pemasukan bulanan: Rp ____________________");
  y = para(doc, y, "Dana yang dialokasikan untuk emas: Rp ____________________ (target 5-15% dari dana investasi)");
  y = para(doc, y, "Dana darurat sudah terpenuhi:   [  ] Ya     [  ] Belum", { after: 18 });

  y = h2(doc, y, "Rencana 12 bulan");
  y = table(doc, y, [
    { label: "Bulan", w: 120 },
    { label: "Target nominal", w: 150 },
    { label: "Realisasi", w: 150 },
    { label: "Catatan", w: 73.28 },
  ], Array.from({ length: 12 }, (_, i) => {
    const names = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return [names[i], "", "", ""];
  }));

  // page 4
  y = content(doc, "Evaluasi", "Periksa ulang setiap kuartal", "Investasi yang baik bukan hanya tentang membeli, tetapi juga tentang meninjau rencana.");
  y = h2(doc, y, "Pertanyaan evaluasi");
  y = bullet(doc, y, "Apakah porsi emas masih sesuai target portofolio?");
  y = bullet(doc, y, "Apakah dana darurat tetap aman dan tidak terganggu?");
  y = bullet(doc, y, "Apakah biaya transaksi masih wajar dibandingkan manfaatnya?");
  y = bullet(doc, y, "Apakah tujuan dan horizon masih relevan dengan kondisi Anda?", { after: 12 });
  y = callout(doc, y, "Jangan lupa", "Sesuaikan rencana ketika kehidupan berubah - menikah, pindah kerja, atau memiliki tanggungan baru. Rencana investasi mengikuti hidup Anda, bukan sebaliknya.");
  y = para(doc, y, "Unduh panduan lengkap dan katalog produk di rajaemasindonesia.co.id/download. Untuk pertanyaan, hubungi tim kami melalui WhatsApp resmi di situs.");

  finalize(doc);
  return doc;
}

/* ============================================================
   3. Katalog Produk (uses live DB prices)
   ============================================================ */
async function buildCatalog() {
  const conn = new Client({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "web_emdig",
    options: "-c timezone=Asia/Jakarta",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });
  await conn.connect();
  const { rows: products } = await conn.query(
    "SELECT name, category, weight_gram, price, buyback_price, short_desc FROM products WHERE is_active = TRUE ORDER BY category, weight_gram"
  );
  const { rows: priceRows } = await conn.query("SELECT buy_price, sell_price, price_date FROM gold_prices ORDER BY price_date DESC LIMIT 1");
  await conn.end();

  const latest = priceRows[0];
  const fmt = (n) => "Rp" + Number(n).toLocaleString("id-ID");
  const cat = { digital: "Emas Digital", fisik: "Emas Fisik", gift: "Emas Gift" };

  const doc = newDoc({ file: "katalog-produk-emas-digital.pdf", title: "Katalog Produk Emas Digital 2026" });

  cover(doc, {
    kicker: "Katalog 2026",
    title: "Katalog Produk Emas Digital",
    subtitle: "Pecahan, estimasi harga, dan panduan memilih produk sesuai tujuan Anda.",
    meta: {
      label: "HARGA ACUAN",
      value: latest ? `Beli ${fmt(latest.buy_price)} / gram  |  Buyback ${fmt(latest.sell_price)} / gram` : "Lihat harga terbaru di situs",
    },
  });

  let y = content(doc, "Panduan singkat", "Memilih produk yang tepat", "Harga pada katalog ini adalah acuan saat dokumen dibuat. Selalu periksa harga terbaru di situs sebelum bertransaksi.");
  y = h2(doc, y, "Tiga kategori produk");
  y = bullet(doc, y, "Emas digital - saldo gram yang tercatat di akun, cocok untuk akumulasi rutin dan jual sebagian.");
  y = bullet(doc, y, "Emas fisik - batangan dengan sertifikat, cocok untuk kepemilikan jangka panjang.");
  y = bullet(doc, y, "Emas gift - pecahan kecil dalam kemasan hadiah, cocok untuk apresiasi dan hadiah.", { after: 12 });

  y = h2(doc, y, "Cara memilih pecahan");
  y = para(doc, y, "Untuk pemula, mulai dari pecahan kecil agar nominalnya nyaman. Ketika sudah rutin, pecahan lebih besar biasanya lebih efisien karena harga per gram relatif lebih rendah. Untuk hadiah, pilih pecahan yang mudah diterima dan memiliki kemasan menarik.");
  y = callout(doc, y, "Perhatikan harga per gram", "Harga total terlihat kecil pada pecahan 0,1 gram, tetapi harga per gramnya bisa lebih tinggi. Bandingkan harga per gram antar pecahan sebelum memutuskan.");

  // product table
  y = content(doc, "Daftar produk", "Pecahan dan estimasi harga", "Harga dapat berubah mengikuti pasar. Buyback adalah harga jual kembali yang berlaku pada saat transaksi.");
  const rows = products.map((p) => {
    const perGram = Math.round(Number(p.price) / Number(p.weight_gram || 1));
    return [p.name, cat[p.category] || p.category, `${Number(p.weight_gram).toLocaleString("id-ID")} g`, fmt(p.price), fmt(perGram)];
  });
  y = table(doc, y, [
    { label: "Produk", w: 175 },
    { label: "Kategori", w: 100 },
    { label: "Berat", w: 55, align: "right" },
    { label: "Harga", w: 85, align: "right" },
    { label: "Per gram", w: 78.28, align: "right" },
  ], rows);

  y = para(doc, y, "Catatan: harga di atas adalah estimasi dan dapat berbeda dengan harga transaksi aktual. Pecahan tertentu dapat memiliki ketersediaan terbatas.", { size: 8.6, color: C.muted });

  y = h2(doc, y, "Cara membeli");
  y = numbered(doc, y, 1, "Buka situs atau aplikasi resmi Raja Emas Indonesia.");
  y = numbered(doc, y, 2, "Pilih produk dan tentukan jumlah gram atau nominal.");
  y = numbered(doc, y, 3, "Periksa ringkasan transaksi, termasuk harga dan biaya.");
  y = numbered(doc, y, 4, "Selesaikan pembayaran melalui kanal yang tersedia.");
  y = numbered(doc, y, 5, "Simpan bukti transaksi dan pantau saldo emas di akun Anda.", { after: 12 });

  y = callout(doc, y, "Butuh bantuan?", "Tim kami dapat membantu memilih produk sesuai tujuan Anda. Hubungi WhatsApp resmi yang tertera di rajaemasindonesia.co.id/kontak.");

  finalize(doc);
  return doc;
}

buildGuide();
buildChecklist();
await buildCatalog();
console.log("PDFs generated in public/downloads");
