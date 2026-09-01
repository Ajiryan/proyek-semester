# Panduan Cara Membuat dan Menghubungkan Repositori GitHub

Dokumen ini berisi panduan langkah demi langkah untuk membuat repositori di GitHub dan menghubungkannya dengan folder proyek lokal menggunakan Visual Studio Code.

---

# 1. Buat Repositori di GitHub

1. Buka https://github.com dan masuk ke akun kamu.
2. Klik tombol + di pojok kanan atas, lalu pilih New repository.
3. Isi Repository name sesuai keinginan.
4. Pilih aksesibilitas repositori: Public atau Private.
5. Jangan centang opsi Add a README file, .gitignore, atau license (biarkan repositori kosong).
6. Klik Create repository.
7. Salin URL repositori HTTPS yang tampil (contoh: https://github.com/username/nama-repo.git).

# 2. Hubungkan Proyek di VS Code

Buka folder proyek kamu di Visual Studio Code, lalu buka Terminal (Ctrl + ~ atau Cmd + ~). Jalankan perintah berikut secara berurutan:

```bash
# Inisialisasi Git di folder lokal
git init

# Tambahkan seluruh file ke staging area
git add .

# Buat commit pertama
git commit -m "Initial commit"

# Ubah nama branch utama menjadi main
git branch -M main

# Hubungkan folder lokal ke repositori GitHub
git remote add origin [https://github.com/username/nama-repo.git](https://github.com/username/nama-repo.git)

# Unggah file ke GitHub
git push -u origin main