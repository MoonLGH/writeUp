


# Writeup: The Stone Guardian

**Misi:** Menemukan nama wahana (attraction) yang dijaga oleh patung wajah batu raksasa.
**Format Flag:** `TBF1{AttractionName}`

### Langkah 1: Identifikasi Lokasi Umum (OSINT)

Langkah pertama adalah mencari tahu di mana foto tersebut diambil.

* Perhatikan gambar `The_Stone_Guardian.jpeg`.
![Gambar](./stone-guardian.jpeg)
* Fokuskan perhatian pada truk makanan (food truck) berwarna hijau di sebelah kanan.
* Jika di-*zoom* pada bagian belakang/samping truk, terdapat tulisan/logo yang cukup jelas terbaca: **"SALOKA"**.
* Pencarian Google sederhana dengan kata kunci "Saloka" akan mengarahkan kita ke **Saloka Theme Park** di Semarang, Jawa Tengah.

### Langkah 2: Menentukan Titik Tepat Lokasi (Video Analysis)

Setelah mengetahui lokasi umumnya adalah Saloka Theme Park, kita perlu mencari tahu posisi spesifik dari bangunan batu berwajah tersebut.

* Gunakan referensi video YouTube tentang tur di Saloka Theme Park, seperti video berjudul *"SALOKA THEME PARK SEMARANG | TAMAN REKREASI TERBESAR DI JAWA TENGAH"* (URL: `https://www.youtube.com/watch?v=xLen0d9Mj_M`).
* Dengan menonton video tersebut, kita bisa mencocokkan *landmark* yang ada. Di dalam area taman, kita bisa melihat menara tinggi yang dikenal sebagai wahana **Paku Bumi**.
![Pakubumi](./pakubumi.png)
* Dari observasi video, terlihat bahwa struktur gerbang batu dengan wajah raksasa (seperti di soal) berada di area yang sama atau berhadapan dengan area Paku Bumi.

### Langkah 3: Identifikasi Nama Wahana (Map Analysis)

Langkah terakhir adalah mendapatkan nama spesifik wahana tersebut menggunakan peta taman.

* Buka gambar peta Saloka.
![Peta Saloka](./peta-saloka.png)
* Cari lokasi di dekat wahana Paku Bumi (di peta ditandai dengan nomor 22).
* Di dekat area tersebut, terdapat ikon bangunan gerbang batu yang bentuknya persis dengan gambar di soal. Bangunan ini ditandai dengan nomor **24**.
* Lihat keterangan (legenda) peta di bagian bawah untuk nomor 24.
* Nomor 24 tertulis sebagai: **SENGGAL-SENGGOL**.

### Kesimpulan

Bangunan dengan wajah batu tersebut adalah gerbang masuk untuk wahana Senggal-Senggol.

**Flag:**


> TBF1{Senggal-Senggol}
