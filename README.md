# Raja Emas Indonesia — Website & CMS

## Fitur

- **Situs publik** — beranda, produk, harga & grafik, artikel, tentang, kontak, kebijakan privasi, syarat & ketentuan, serta halaman unduhan aplikasi.
- **CMS** — dashboard, produk, banner, harga emas, artikel, FAQ, pesan kontak, pengaturan situs, dan arsip lama.
- **App-first** — tombol unduh toko aplikasi, simulasi emas, dan konten edukasi yang mengarah ke aplikasi.
- **SEO** — metadata per halaman, Open Graph, JSON-LD FAQ.
- **Autentikasi CMS** — cookie sesi JWT (`jose`) dengan peran `superadmin` dan `editor`.

## Stack

| Bagian | Teknologi |
| --- | --- |
| Framework | Next.js 16.4.5 (App Router, Turbopack) |
| UI | React 19, TypeScript, Tailwind CSS v4 |
| Database | PostgreSQL 16+ (`pg`) |
| Auth | `jose` (JWT cookie), `bcryptjs` |
| Deployment | AWS (App Runner + ECR + RDS PostgreSQL) |

## Struktur singkat

```
app/
  (site)/          halaman publik
  cms/             login + panel CMS
  layout.tsx       metadata, favicon, layout root
components/
  site/            header, footer, mockup, form, chart
  cms/             shell, form, tabel, modal
lib/               db, auth, settings, actions
db/
  schema.sql       struktur tabel
  seed.mjs         data awal (reset seluruh tabel)
public/            logo, font, gambar, PDF arsip
Dockerfile         image produksi (Next.js standalone)
```

## Menjalankan lokal

Prasyarat: Node.js 22+, PostgreSQL 16+ (Laragon/Docker).

1. Install dependensi.

   ```bash
   npm ci
   ```

2. Buat database dan impor skema.

   ```bash
   createdb -U postgres web_emdig
   psql -U postgres -d web_emdig -f db/schema.sql
   ```

3. Salin environment dan isi nilainya.

   ```bash
   cp .env.example .env.local
   ```

4. Isi data awal (opsional, **mengosongkan seluruh tabel** lalu mengisi ulang).

   ```bash
   node db/seed.mjs
   ```

5. Jalankan.

   ```bash
   npm run dev
   ```

   Situs: <http://localhost:3000> · CMS: <http://localhost:3000/cms>

> Kredensial admin awal dibuat oleh `db/seed.mjs`. Segera ganti kata sandi setelah login pertama.

## Environment variables

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `DB_HOST` | ya | Host PostgreSQL/RDS |
| `DB_PORT` | ya | Default `5432` |
| `DB_USER` | ya | User database |
| `DB_PASSWORD` | ya | Kata sandi database |
| `DB_NAME` | ya | Default `web_emdig` |
| `DB_SSL` | produksi | `true` untuk RDS/SSL, `false` untuk lokal |
| `AUTH_SECRET` | ya | Kunci penanda tangan cookie sesi. Buat acak, misal `openssl rand -base64 48` |
| `SITE_URL` | produksi | URL publik, misal `https://rajaemasindonesia.co.id` (dipakai metadata/Open Graph) |

File `.env.local` tidak pernah ikut ter-commit.

## Build produksi

```bash
npm ci
npm run build
npm run start
```

`next.config.ts` memakai `output: "standalone"` agar hasil build bisa dijalankan sebagai container ringan (`node server.js`).

---

## Deploy ke AWS

Arsitektur yang direkomendasikan:

```
Route 53 / domain
        │ HTTPS
        ▼
AWS App Runner (container dari ECR, port 3000)
        │ VPC Connector (private subnet)
        ▼
Amazon RDS for PostgreSQL (private, tidak public)
```

Region contoh: `ap-southeast-1` (Singapura) untuk latensi Indonesia.

Prasyarat: AWS CLI v2, Docker, dan izin membuat ECR, App Runner, RDS, VPC Connector, serta Route 53/ACM.

### 1. Buat database RDS PostgreSQL

1. Buat **RDS for PostgreSQL 16.x** di region yang sama, dengan **Public access: No**.
2. Catat endpoint, port, user, dan password.
3. Buat database `web_emdig`.
4. Impor skema dari mesin yang berada di VPC yang sama (bastion/EC2), bukan dari internet:

   ```bash
   psql "host=<RDS_ENDPOINT> port=5432 dbname=web_emdig user=<DB_USER> sslmode=require" \
     -f db/schema.sql
   ```

5. Security group RDS: izinkan port `5432` hanya dari security group VPC Connector App Runner.

### 2. Build dan push image ke Amazon ECR

```bash
aws ecr create-repository \
  --repository-name emasdigital-rei \
  --region ap-southeast-1

aws ecr get-login-password --region ap-southeast-1 \
  | docker login --username AWS --password-stdin \
    <ACCOUNT_ID>.dkr.ecr.ap-southeast-1.amazonaws.com

docker build -t emasdigital-rei .

docker tag emasdigital-rei:latest \
  <ACCOUNT_ID>.dkr.ecr.ap-southeast-1.amazonaws.com/emasdigital-rei:latest

docker push \
  <ACCOUNT_ID>.dkr.ecr.ap-southeast-1.amazonaws.com/emasdigital-rei:latest
```

### 3. Buat App Runner service

1. Buat **VPC Connector** di VPC yang sama dengan RDS (private subnet + security group).
2. Buat **App Runner service** dari image ECR di atas.
3. Konfigurasi service:
   - Port: `3000`
   - Health check: HTTP, path `/`
   - VPC Connector: yang dibuat pada langkah 1
4. Tambahkan environment variables:

   ```
   DB_HOST=<RDS_ENDPOINT>
   DB_PORT=5432
   DB_USER=<DB_USER>
   DB_PASSWORD=<DB_PASSWORD>
   DB_NAME=web_emdig
   DB_SSL=true
   AUTH_SECRET=<hasil openssl rand -base64 48>
   SITE_URL=https://<domain-anda>
   ```

5. Deploy. App Runner menyediakan URL HTTPS `*.awsapprunner.com` untuk uji coba.

### 4. Domain dan HTTPS

1. Tambahkan custom domain di App Runner, lalu ikuti record DNS yang diberikan (CNAME/ALIAS).
2. Jika memakai Route 53, buat record sesuai petunjuk App Runner; sertifikat TLS dikelola melalui ACM.
3. Setelah domain aktif, perbarui `SITE_URL` ke `https://<domain-anda>` lalu deploy ulang.

### Alternatif: EC2 + Nginx + PM2

Untuk satu server dengan biaya lebih sederhana:

1. EC2 Ubuntu 24.04, security group hanya `80/443` dari internet (SSH dibatasi IP kantor).
2. Install Node.js 22, Nginx, dan PM2.
3. Clone repo, buat `.env.local` dengan variabel di atas (DB mengarah ke RDS).
4. Jalankan:

   ```bash
   npm ci
   npm run build
   pm2 start npm --name emasdigital-rei -- start
   pm2 save
   ```

5. Reverse proxy Nginx dari `80/443` ke `127.0.0.1:3000`, lalu pasang sertifikat dengan Certbot.
6. Jangan buka port `3000` ke publik.

### Catatan produksi

- **Jangan** menjalankan `db/seed.mjs` di database produksi yang sudah berisi data — skrip ini mengosongkan tabel.
- Ganti seluruh kredensial admin bawaan setelah go-live dan simpan `AUTH_SECRET` di secret manager (AWS Secrets Manager/SSM), bukan di repo.
- Aplikasi memakai cookie `secure` saat `NODE_ENV=production`, jadi produksi **wajib** diakses lewat HTTPS.
- Aset gambar saat ini disajikan dari `public/`. Untuk traffic besar, pertimbangkan Amazon S3 + CloudFront.
- Backup otomatis RDS dan alarm CloudWatch disarankan sebelum menerima traffic publik.

## Script

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Server development |
| `npm run build` | Build produksi (standalone) |
| `npm run start` | Jalankan hasil build |
| `npm run lint` | ESLint |
| `node db/seed.mjs` | Reset + isi data awal (hati-hati) |
| `node db/make-pdfs.mjs` | Regenerasi PDF arsip di `public/downloads` |
