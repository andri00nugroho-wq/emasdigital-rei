import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const DB = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "web_emdig",
  multipleStatements: true,
};

const root = process.cwd();
const conn = await mysql.createConnection(DB);
console.log("Connected to MySQL", DB.database);

const schema = fs.readFileSync(path.join(root, "db/schema.sql"), "utf8");
await conn.query(schema);
console.log("Schema ready");

await conn.query("SET FOREIGN_KEY_CHECKS = 0");
for (const t of ["leads", "downloads", "articles", "gold_prices", "products", "banners", "faqs", "contact_messages", "settings", "admin_users"]) {
  await conn.query(`TRUNCATE TABLE ${t}`);
}
await conn.query("SET FOREIGN_KEY_CHECKS = 1");

// ---------- admin ----------
const hash = await bcrypt.hash("AdminREI2026!", 10);
await conn.query(
  "INSERT INTO admin_users (name, email, password_hash, role) VALUES (?,?,?,?)",
  ["Super Admin", "admin@rajaemasindonesia.co.id", hash, "superadmin"]
);
await conn.query(
  "INSERT INTO admin_users (name, email, password_hash, role) VALUES (?,?,?,?)",
  ["Content Editor", "editor@rajaemasindonesia.co.id", await bcrypt.hash("EditorREI2026!", 10), "editor"]
);

// ---------- settings ----------
const settings = {
  site_name: "Raja Emas Indonesia",
  site_short: "REI",
  tagline: "Emas digital premium untuk masa depan yang lebih tenang",
  hero_kicker: "Investasi emas digital",
  phone: "0811 1212 8585",
  whatsapp: "6281112128585",
  email: "halo@rajaemasindonesia.co.id",
  address: "Trembesi Tower, CBD BSD, Tangerang Selatan, Banten",
  instagram: "https://instagram.com/rajaemasindonesia",
  tiktok: "https://tiktok.com/@rajaemasindonesia",
  youtube: "https://youtube.com/@rajaemasindonesia",
  operational_hours: "Senin – Jumat, 09.00 – 17.00 WIB",
  about_short:
    "Raja Emas Indonesia menghadirkan cara modern untuk memiliki emas: mudah, transparan, dan terjangkau — mulai dari 0,1 gram.",
  about_long:
    "Raja Emas Indonesia adalah platform emas digital yang dirancang untuk memudahkan masyarakat Indonesia memiliki emas murni secara bertahap. Setiap saldo emas digital didukung oleh cadangan emas fisik yang tersimpan aman, dengan harga yang diperbarui setiap hari dan proses jual-beli yang transparan.",
  footer_note:
    "Investasi emas mengandung risiko fluktuasi harga. Lakukan investasi sesuai profil risiko dan kebutuhan Anda. Raja Emas Indonesia tidak menjanjikan imbal hasil tetap.",
  free_download_badge: "E-book gratis 2026",
  free_download_title: "Panduan Emas Digital untuk Pemula",
  free_download_desc:
    "10 halaman praktis: cara mulai dari 0,1 gram, memilih waktu beli, membaca harga buyback, sampai menyusun target keuangan. Langsung diunduh, tanpa biaya.",
  app_name: "Raja Emas",
  app_tagline: "Emas digital dalam genggam Anda",
  app_badge: "Aplikasi resmi",
  play_store_url: "https://play.google.com/store/apps/details?id=com.rajaemasmurni",
  app_store_url: "https://apps.apple.com/id/app/raja-emas/id6742871347?l=id",
  app_rating: "4,9/5",
  app_reviews: "1.200+ ulasan",
  stat_users: "28.400+",
  stat_customers_label: "Investor aktif",
  stat_volume: "4,2 ton",
  stat_volume_label: "Emas terkelola",
  stat_years: "9 tahun",
  stat_years_label: "Pengalaman industri",
  stat_rating: "4,9/5",
  stat_rating_label: "Rating layanan",
};

for (const [k, v] of Object.entries(settings)) {
  await conn.query("INSERT INTO settings (setting_key, setting_value) VALUES (?,?)", [k, v]);
}

// ---------- banners ----------
await conn.query(
  `INSERT INTO banners (kicker, title, subtitle, image, cta_label, cta_url, is_active, sort_order) VALUES ?`,
  [
    [
      [
        "Aplikasi resmi Raja Emas Indonesia",
        "Emas digital, dalam genggam Anda.",
        "Beli, jual, dan cetak emas fisik lewat aplikasi Raja Emas — mulai 0,1 gram dengan harga transparan, semua dari ponsel.",
        "/images/hero-gold.png",
        "Unduh aplikasi",
        "/aplikasi",
        1,
        1,
      ],
      [
        "Harga emas hari ini",
        "Pantau harga, ambil keputusan dari aplikasi.",
        "Harga beli dan buyback diperbarui setiap hari. Semua transaksi aman, tercatat, dan bisa dipantau dari ponsel.",
        "/images/hero-gold.png",
        "Lihat harga hari ini",
        "/harga",
        1,
        2,
      ],
      [
        "Visi kami",
        "Menuju aplikasi emas digital No. 1 di Indonesia.",
        "Kami membangun pengalaman emas digital yang aman, transparan, dan mudah dipakai siapa saja — dari gram pertama.",
        "/images/hero-gold.png",
        "Kenali aplikasinya",
        "/aplikasi",
        1,
        3,
      ],
    ],
  ]
);

// ---------- products ----------
const basePerGram = 2572000;
const productImages = {
  digital: "/images/product-bar.png",
  fisik: "/images/product-bar.png",
  gift: "/images/product-gift.png",
};
const products = [
  {
    slug: "emas-digital-0-1-gram",
    name: "Emas Digital 0,1 gram",
    category: "digital",
    weight: 0.1,
    price: 257000,
    buyback: 245000,
    badge: "Paling terjangkau",
    short: "Langkah pertama yang ringan. Cocok untuk mulai rutin menabung emas.",
    featured: 1,
    features: ["Mulai dari Rp257.000", "Saldo emas 24 karat", "Bisa dicetak jadi emas fisik", "Transaksi 24/7"],
  },
  {
    slug: "emas-digital-0-5-gram",
    name: "Emas Digital 0,5 gram",
    category: "digital",
    weight: 0.5,
    price: 1281000,
    buyback: 1225000,
    badge: "Favorit pemula",
    short: "Pilihan populer untuk mulai membangun kebiasaan investasi emas setiap bulan.",
    featured: 1,
    features: ["Harga per gram transparan", "Tanpa biaya penyimpanan", "Buyback harian", "Riwayat transaksi lengkap"],
  },
  {
    slug: "emas-digital-1-gram",
    name: "Emas Digital 1 gram",
    category: "digital",
    weight: 1,
    price: 2555000,
    buyback: 2450000,
    badge: "Best seller",
    short: "Standar investasi emas yang mudah dihitung dan likuid.",
    featured: 1,
    features: ["Emas murni 999,9", "Spread kompetitif", "Bisa dicetak 1 gram", "Laporan portofolio"],
  },
  {
    slug: "emas-digital-5-gram",
    name: "Emas Digital 5 gram",
    category: "digital",
    weight: 5,
    price: 12730000,
    buyback: 12225000,
    badge: null,
    short: "Untuk Anda yang ingin memperbesar porsi aset lindung nilai.",
    featured: 0,
    features: ["Harga khusus volume", "Prioritas layanan", "Buyback terjadwal", "Konsultasi alokasi aset"],
  },
  {
    slug: "emas-digital-10-gram",
    name: "Emas Digital 10 gram",
    category: "digital",
    weight: 10,
    price: 25425000,
    buyback: 24425000,
    badge: "Nilai terbaik",
    short: "Alokasi lebih besar dengan biaya per gram yang lebih efisien.",
    featured: 0,
    features: ["Harga kompetitif", "Aman & tercatat", "Bisa dicetak bertahap", "Pendampingan relationship manager"],
  },
  {
    slug: "emas-batangan-antam-1-gram",
    name: "Emas Batangan Antam 1 gram",
    category: "fisik",
    weight: 1,
    price: 2645000,
    buyback: 2485000,
    badge: "Fisik",
    short: "Logam mulia bersertifikat, dikirim aman ke alamat Anda.",
    featured: 0,
    features: ["Bersertifikat resmi", "Kemasan segel", "Asuransi pengiriman", "Pengiriman 3–5 hari kerja"],
  },
  {
    slug: "emas-batangan-antam-5-gram",
    name: "Emas Batangan Antam 5 gram",
    category: "fisik",
    weight: 5,
    price: 13150000,
    buyback: 12425000,
    badge: null,
    short: "Pecahan favorit untuk investasi jangka panjang dan hadiah istimewa.",
    featured: 0,
    features: ["Bersertifikat resmi", "Kemasan eksklusif", "Asuransi pengiriman", "Bisa disimpan di brankas mitra"],
  },
  {
    slug: "emas-gift-0-5-gram",
    name: "Emas Gift 0,5 gram",
    category: "gift",
    weight: 0.5,
    price: 1345000,
    buyback: 1225000,
    badge: "Hadiah istimewa",
    short: "Kado digital yang bermakna: emas untuk orang tersayang, dikirim instan.",
    featured: 1,
    features: ["Kirim instan via aplikasi", "Kartu ucapan digital", "Bisa dicetak fisik", "Tanpa batas waktu klaim"],
  },
  {
    slug: "emas-gift-1-gram",
    name: "Emas Gift 1 gram",
    category: "gift",
    weight: 1,
    price: 2625000,
    buyback: 2450000,
    badge: null,
    short: "Hadiah pernikahan, kelahiran, atau pencapaian — dalam bentuk aset nyata.",
    featured: 0,
    features: ["Desain kartu elegan", "Kirim ke siapa saja", "Notifikasi penerima", "Bisa disimpan atau dijual kembali"],
  },
];

for (let i = 0; i < products.length; i++) {
  const p = products[i];
  await conn.query(
    `INSERT INTO products (slug, name, category, weight_gram, price, buyback_price, badge, short_desc, description, features, image, is_featured, is_active, sort_order)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      p.slug,
      p.name,
      p.category,
      p.weight,
      p.price,
      p.buyback,
      p.badge,
      p.short,
      `<p>${p.short}</p><p>${p.name} diterbitkan dalam satuan emas murni 999,9 dan tercatat atas nama Anda. Saldo dapat dipantau kapan saja, dijual kembali dengan harga buyback harian, atau dicetak menjadi emas batangan fisik melalui layanan cetak emas.</p><h3>Mengapa memilih produk ini?</h3><p>Pecahan ini cocok untuk investor yang ingin membangun portofolio secara bertahap. Dengan pembelian rutin, Anda memanfaatkan rata-rata harga (dollar-cost averaging) sehingga tidak perlu menebak waktu terbaik membeli emas.</p><p><strong>Catatan:</strong> harga produk dapat berubah mengikuti harga emas harian. Harga final dikonfirmasi pada saat transaksi.</p>`,
      JSON.stringify(p.features),
      productImages[p.category],
      p.featured,
      1,
      i,
    ]
  );
}

// ---------- gold price history ----------
const rows = [];
const today = new Date();
today.setHours(0, 0, 0, 0);
const days = 240;
let seed = 42;
function rnd() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
for (let i = days - 1; i >= 0; i--) {
  const d = new Date(today);
  d.setDate(d.getDate() - i);
  if (d.getDay() === 0 || d.getDay() === 6) continue;
  const t = (days - 1 - i) / (days - 1);
  const trend = 2215000 + t * 357000;
  const wave = Math.sin(t * 22) * 18500 + Math.cos(t * 7.5) * 9500;
  const noise = (rnd() - 0.5) * 16000;
  const price = Math.round((trend + wave + noise) / 1000) * 1000;
  const buyback = Math.round((price * (0.9555 + rnd() * 0.008)) / 1000) * 1000;
  rows.push([d.toISOString().slice(0, 10), price, buyback]);
}
await conn.query("INSERT INTO gold_prices (price_date, buy_price, sell_price) VALUES ?", [rows]);
console.log("Gold prices:", rows.length);

// ---------- articles ----------
const articles = [
  {
    slug: "cara-investasi-emas-digital-untuk-pemula",
    title: "Cara Investasi Emas Digital untuk Pemula di 2026",
    category: "Panduan",
    excerpt:
      "Dari menyiapkan dana darurat sampai membeli 0,1 gram pertama: langkah praktis memulai emas digital tanpa overwhelmed.",
    cover: "/images/article-1.png",
    content: `<p>Emas digital memudahkan siapa pun memiliki emas murni tanpa memikirkan tempat penyimpanan. Anda bisa mulai dari nominal kecil, memantau saldo dari ponsel, dan menjualnya kembali ketika dibutuhkan. Namun, kemudahan itu tetap membutuhkan strategi agar hasilnya optimal.</p>
<h2>1. Pastikan fondasi keuangan sudah siap</h2><p>Sebelum membeli emas, pastikan dana darurat 3–6 bulan pengeluaran sudah tersedia dan tidak ada utang konsumtif berbunga tinggi. Emas adalah aset jangka menengah–panjang, bukan sumber dana darurat utama.</p>
<h2>2. Tentukan tujuan dan horizon waktu</h2><p>Tanyakan pada diri sendiri: emas ini untuk apa? Dana pendidikan anak, pelengkap portofolio, atau lindung nilai terhadap inflasi? Tujuan yang jelas menentukan berapa porsi yang wajar — umumnya 5–15% dari total aset investasi.</p>
<h2>3. Mulai dari pecahan kecil</h2><p>Anda tidak perlu membeli satu gram sekaligus. Mulai dari 0,1 gram atau 0,5 gram membuat proses belajar lebih ringan. Yang terpenting adalah konsistensi: sisihkan nominal yang sama setiap bulan.</p>
<h2>4. Pahami spread dan harga buyback</h2><p>Harga beli dan harga buyback berbeda. Selisih inilah yang disebut spread. Semakin kecil spread, semakin efisien transaksi Anda. Selalu cek halaman harga sebelum bertransaksi dan hindari membeli saat selisih melebar tidak wajar.</p>
<h2>5. Catat dan evaluasi</h2><p>Tinjau portofolio setiap kuartal. Jika harga emas naik tajam dan porsinya melebihi target alokasi, pertimbangkan rebalancing. Jika turun, jangan panik — justru itu kesempatan membeli lebih murah sesuai rencana.</p>
<p><strong>Intinya:</strong> emas digital adalah alat, bukan tujuan. Gunakan sebagai pelengkap portofolio yang membuat keuangan Anda lebih tahan guncangan.</p>`,
  },
  {
    slug: "emas-digital-vs-emas-fisik",
    title: "Emas Digital vs Emas Fisik: Mana yang Lebih Cocok untuk Anda?",
    category: "Insight",
    excerpt:
      "Keduanya sama-sama emas, tetapi beda biaya, likuiditas, dan pengalaman. Ini panduan memilih sesuai kebutuhan.",
    cover: "/images/article-2.png",
    content: `<p>Perdebatan antara emas digital dan emas fisik sering kali berputar pada satu pertanyaan: mana yang lebih aman? Jawabannya bergantung pada tujuan Anda, bukan pada salah satu jenis yang dianggap paling unggul.</p>
<h2>Keunggulan emas digital</h2><ul><li>Bisa dibeli mulai pecahan sangat kecil.</li><li>Likuiditas tinggi: jual kapan saja dengan harga buyback harian.</li><li>Tanpa biaya penyimpanan fisik dan risiko kehilangan.</li><li>Riwayat transaksi rapi dan mudah diaudit.</li></ul>
<h2>Keunggulan emas fisik</h2><ul><li>Bentuk nyata yang bisa dipegang dan diwariskan.</li><li>Tidak bergantung pada sistem digital saat transaksi.</li><li>Cocok untuk tujuan simbolis seperti mahar atau hadiah.</li></ul>
<h2>Kombinasi yang masuk akal</h2><p>Banyak investor memilih pendekatan hibrida: mayoritas dalam emas digital untuk fleksibilitas, lalu mencetak sebagian menjadi batangan fisik ketika nilai portofolio sudah signifikan. Dengan cara ini Anda mendapatkan likuiditas sekaligus kepemilikan fisik.</p>
<h2>Yang perlu diperhatikan</h2><p>Apa pun bentuknya, pastikan penyedia memiliki proses pencatatan yang jelas, harga transparan, dan layanan buyback yang konsisten. Jangan hanya tergoda harga murah tanpa memahami biaya tersembunyi.</p>`,
  },
  {
    slug: "strategi-dollar-cost-averaging-emas",
    title: "Strategi Beli Emas Rutin: Cara Kerja Dollar-Cost Averaging",
    category: "Strategi",
    excerpt:
      "Tidak perlu menebak waktu terbaik. Beli rutin setiap bulan bisa menurunkan risiko harga dan membangun disiplin.",
    cover: "/images/article-3.png",
    content: `<p>Harga emas bergerak setiap hari. Bagi investor baru, fluktuasi ini sering memicu dua kesalahan: menunda pembelian karena menunggu harga turun, atau membeli panic saat harga melonjak. Dollar-cost averaging (DCA) menawarkan jalan tengah.</p>
<h2>Apa itu DCA?</h2><p>DCA adalah membeli aset dengan nominal tetap secara berkala, misalnya Rp500.000 setiap tanggal 5. Ketika harga tinggi, Anda mendapat gram lebih sedikit; ketika harga rendah, Anda mendapat gram lebih banyak. Hasil akhirnya adalah harga rata-rata yang lebih halus.</p>
<h2>Contoh sederhana</h2><p>Misalkan dalam tiga bulan Anda membeli Rp1.000.000 per bulan. Harga per gram berturut-turut Rp2,5 juta, Rp2,3 juta, dan Rp2,6 juta. Total gram yang Anda dapat: 0,40 + 0,435 + 0,385 = 1,22 gram. Rata-rata biaya per gram menjadi sekitar Rp2,46 juta — lebih rendah daripada membeli semuanya di bulan pertama atau ketiga.</p>
<h2>Kunci agar berhasil</h2><ul><li>Tetapkan nominal yang tidak mengganggu arus kas.</li><li>Gunakan tanggal yang sama setiap bulan agar mudah diingat.</li><li>Jangan menghentikan pembelian hanya karena harga turun.</li><li>Evaluasi alokasi setiap 6–12 bulan, bukan setiap hari.</li></ul>
<p>DCA bukan jaminan untung, tetapi membantu Anda menghindari keputusan emosional — faktor yang paling sering merusak hasil investasi.</p>`,
  },
  {
    slug: "membaca-harga-emas-harian-dan-buyback",
    title: "Cara Membaca Harga Emas Harian dan Harga Buyback",
    category: "Edukasi",
    excerpt:
      "Kenapa harga beli dan buyback berbeda? Pelajari spread, faktor penggerak harga, dan waktu transaksi yang lebih efisien.",
    cover: "/images/article-4.png",
    content: `<p>Di halaman harga kami, Anda akan melihat dua angka: harga beli dan harga buyback. Memahami perbedaannya adalah bekal penting sebelum bertransaksi.</p>
<h2>Harga beli</h2><p>Harga yang Anda bayar ketika membeli emas. Harga ini dipengaruhi harga spot internasional, kurs rupiah, biaya produksi, dan premi distributor.</p>
<h2>Harga buyback</h2><p>Harga yang diterima ketika Anda menjual emas kembali. Umumnya sedikit lebih rendah dari harga beli karena mencakup biaya pengujian, penyimpanan, dan margin layanan.</p>
<h2>Spread itu wajar</h2><p>Selisih antara harga beli dan buyback disebut spread. Spread yang sehat biasanya berada di kisaran 2–5% untuk emas digital. Jika terlalu lebar, pertimbangkan penyedia lain atau tunda transaksi.</p>
<h2>Faktor yang menggerakkan harga</h2><ul><li>Harga emas global (XAU/USD) dan sentimen pasar.</li><li>Nilai tukar rupiah terhadap dolar AS.</li><li>Permintaan musiman, misalnya menjelang hari raya.</li><li>Kebijakan suku bunga dan inflasi global.</li></ul>
<p>Tips praktis: pantau tren 30 hari, bukan hanya hari ini. Grafik membantu Anda melihat apakah kenaikan bersifat sementara atau bagian dari tren yang lebih panjang.</p>`,
  },
  {
    slug: "keamanan-investasi-emas-digital",
    title: "Keamanan Investasi Emas Digital: 7 Hal yang Wajib Dicek",
    category: "Keamanan",
    excerpt:
      "Dari transparansi cadangan sampai keamanan akun. Checklist sebelum menempatkan dana di platform emas digital.",
    cover: "/images/article-5.png",
    content: `<p>Memilih platform emas digital tidak boleh hanya berdasarkan tampilan aplikasi. Ada beberapa hal mendasar yang perlu Anda verifikasi sebelum menempatkan dana.</p>
<h2>1. Transparansi cadangan emas</h2><p>Pastikan platform menjelaskan bagaimana saldo digital didukung oleh emas fisik, termasuk mekanisme audit dan penyimpanan.</p>
<h2>2. Kejelasan biaya</h2><p>Cari tahu biaya transaksi, spread, biaya cetak fisik, dan biaya penarikan. Semua harus mudah ditemukan, bukan tersembunyi di halaman kecil.</p>
<h2>3. Konsistensi buyback</h2><p>Platform yang baik memiliki harga buyback yang diperbarui rutin dan proses pencairan yang jelas.</p>
<h2>4. Keamanan akun</h2><p>Aktifkan verifikasi dua langkah, gunakan kata sandi unik, dan jangan pernah membagikan kode OTP.</p>
<h2>5. Rekam jejak layanan</h2><p>Baca pengalaman pengguna, cek kanal dukungan resmi, dan pastikan alamat kantor dapat diverifikasi.</p>
<h2>6. Kebijakan privasi</h2><p>Pahami data apa yang dikumpulkan dan bagaimana data tersebut digunakan.</p>
<h2>7. Rencana keluar</h2><p>Sebelum membeli, ketahui bagaimana cara menjual dan berapa lama dana masuk ke rekening. Likuiditas adalah bagian dari keamanan.</p>`,
  },
  {
    slug: "mitos-investasi-emas",
    title: "5 Mitos Investasi Emas yang Masih Sering Dipercaya",
    category: "Insight",
    excerpt:
      "Emas hanya untuk orang kaya? Harga selalu naik? Simak koreksi atas anggapan yang bisa merugikan keputusan Anda.",
    cover: "/images/article-6.png",
    content: `<p>Emas sudah lama menjadi simbol kekayaan, dan itu membuat banyak mitos beredar. Berikut lima di antaranya yang perlu diluruskan.</p>
<h2>Mitos 1: Investasi emas butuh modal besar</h2><p>Faktanya, emas digital bisa dibeli dari pecahan 0,1 gram. Yang menentukan hasil bukan modal awal besar, melainkan konsistensi dan horizon waktu.</p>
<h2>Mitos 2: Harga emas selalu naik</h2><p>Emas cenderung menjaga daya beli dalam jangka panjang, tetapi tetap mengalami koreksi. Pada 2013–2015, harga emas global turun cukup dalam. Karena itu, alokasi tetap penting.</p>
<h2>Mitos 3: Emas fisik selalu lebih aman</h2><p>Emas fisik punya risiko kehilangan dan biaya penyimpanan. Keamanan bergantung pada sistem, bukan hanya bentuk aset.</p>
<h2>Mitos 4: Beli saat harga turun selalu untung</h2><p>Menebak titik terendah hampir mustahil. Strategi beli bertahap lebih realistis daripada mencoba timing pasar.</p>
<h2>Mitos 5: Emas tidak menghasilkan apa pun</h2><p>Emas memang tidak memberi bunga, tetapi berfungsi sebagai asuransi portofolio. Perannya adalah mengurangi volatilitas keseluruhan, bukan mengejar imbal hasil tertinggi.</p>`,
  },
];

for (let i = 0; i < articles.length; i++) {
  const a = articles[i];
  const d = new Date();
  d.setDate(d.getDate() - i * 9 - 2);
  await conn.query(
    `INSERT INTO articles (slug,title,excerpt,content,cover,category,author,status,views,published_at) VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [a.slug, a.title, a.excerpt, a.content, a.cover, a.category, "Tim Raja Emas", "published", 480 + i * 137, d]
  );
}

// ---------- downloads ----------
const downloads = [
  {
    slug: "panduan-investasi-emas-digital",
    title: "Panduan Lengkap Investasi Emas Digital (PDF)",
    description:
      "10 halaman: dasar emas digital, cara membaca harga, strategi beli rutin, hingga checklist keamanan. Gratis.",
    file: "/downloads/panduan-investasi-emas-digital.pdf",
    count: 1284,
  },
  {
    slug: "checklist-mulai-investasi-emas",
    title: "Checklist 10 Langkah Mulai Investasi Emas",
    description: "Lembar kerja satu halaman untuk menyiapkan dana, target, dan jadwal beli emas Anda.",
    file: "/downloads/checklist-mulai-investasi-emas.pdf",
    count: 863,
  },
  {
    slug: "katalog-produk-emas-digital",
    title: "Katalog Produk Emas Digital 2026",
    description: "Daftar pecahan emas, estimasi harga, dan panduan memilih produk sesuai tujuan Anda.",
    file: "/downloads/katalog-produk-emas-digital.pdf",
    count: 642,
  },
];
for (const d of downloads) {
  await conn.query(
    "INSERT INTO downloads (slug,title,description,file_path,download_count,is_active) VALUES (?,?,?,?,?,1)",
    [d.slug, d.title, d.description, d.file, d.count]
  );
}

// ---------- leads ----------
const names = [
  "Andi Pratama", "Siti Rahma", "Budi Santoso", "Dewi Lestari", "Rizky Maulana", "Nadia Putri",
  "Agus Setiawan", "Maya Anggraini", "Fajar Nugroho", "Intan Permata", "Hendra Wijaya", "Rina Marlina",
  "Yoga Saputra", "Ayu Wulandari", "Dimas Prakoso", "Lina Kusuma", "Arif Hidayat", "Fitri Handayani",
  "Bayu Ramadhan", "Sari Dewanti", "Eko Prasetyo", "Putri Amelia", "Rizal Fauzi", "Nisa Ulfa",
  "Taufik Akbar", "Wulan Safitri", "Galih Purnama", "Citra Kirana", "Aditya Nugraha", "Mega Puspita",
];
const sources = ["panduan", "homepage", "artikel", "harga"];
let leadSeed = 7;
function lrnd() { leadSeed = (leadSeed * 1103515245 + 12345) % 2147483648; return leadSeed / 2147483648; }
for (let i = 0; i < 48; i++) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(lrnd() * 45));
  d.setHours(8 + Math.floor(lrnd() * 11), Math.floor(lrnd() * 60), 0, 0);
  const name = names[i % names.length];
  const email = name.toLowerCase().replace(/[^a-z]/g, ".") + "@example.com";
  const phone = "08" + String(1200000000 + Math.floor(lrnd() * 800000000));
  await conn.query(
    "INSERT INTO leads (name, phone, email, download_id, source, created_at) VALUES (?,?,?,?,?,?)",
    [name, phone, email, 1 + (i % 3), sources[i % sources.length], d]
  );
}

// ---------- contact messages ----------
await conn.query(
  "INSERT INTO contact_messages (name,email,phone,subject,message,is_read,created_at) VALUES (?,?,?,?,?,?,?)",
  ["Dian Puspita", "dian@example.com", "081234567890", "Cara cetak emas fisik", "Halo, saya ingin tahu berapa minimal saldo untuk mencetak emas 1 gram dan berapa lama prosesnya. Terima kasih.", 0, new Date()]
);
await conn.query(
  "INSERT INTO contact_messages (name,email,phone,subject,message,is_read,created_at) VALUES (?,?,?,?,?,?,?)",
  ["Rudi Hartono", "rudi@example.com", "081298765432", "Kerja sama korporasi", "Kami tertarik mengadakan program hadiah emas untuk karyawan. Mohon informasi paket korporasi.", 1, new Date()]
);

// ---------- faqs ----------
const faqs = [
  ["Apakah emas digital aman?", "Saldo emas digital tercatat atas nama Anda dan didukung oleh cadangan emas fisik. Kami menerapkan verifikasi akun, pemantauan transaksi, dan prosedur penyimpanan berlapis untuk menjaga aset Anda."],
  ["Berapa minimal pembelian emas digital?", "Anda bisa mulai dari 0,1 gram. Nominalnya menyesuaikan harga emas harian, sehingga terjangkau untuk investor pemula."],
  ["Bagaimana cara menjual emas digital?", "Masuk ke akun Anda, pilih menu jual, tentukan jumlah gram, lalu konfirmasi. Dana akan dikirim ke rekening terdaftar sesuai waktu proses yang tertera."],
  ["Apakah saldo emas bisa dicetak menjadi emas fisik?", "Ya. Saldo emas digital dapat dicetak menjadi emas batangan fisik dengan pecahan tertentu. Biaya cetak dan waktu pengiriman ditampilkan sebelum konfirmasi."],
  ["Apakah harga emas sama setiap hari?", "Harga diperbarui mengikuti pergerakan pasar. Harga beli dan buyback dapat berubah setiap hari, bahkan dalam satu hari."],
  ["Apakah ada biaya penyimpanan?", "Untuk produk emas digital, tidak ada biaya penyimpanan bulanan. Biaya yang berlaku adalah spread transaksi dan biaya tambahan bila Anda mencetak emas fisik."],
];
for (let i = 0; i < faqs.length; i++) {
  await conn.query("INSERT INTO faqs (question,answer,sort_order,is_active) VALUES (?,?,?,1)", [...faqs[i], i]);
}

await conn.end();
console.log("Seed complete.");
