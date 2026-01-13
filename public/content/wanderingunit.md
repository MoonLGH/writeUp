# Write-Up: The Wandering Unit

**Category:** OSINT / Geolocation  
**Points:** 484  
**Author:** tntoluena & minouse3  

## 1. Scenario Brief

Peserta diberikan sebuah foto unit militer yang sedang berjalan di area tandus dengan struktur bangunan beton yang khas. Tidak ada metadata, namun lingkungan tersebut menyimpan jejak digital yang dapat ditelusuri.

> "The road curves through fortified concrete and barren hills. A watchtower rises in the distance..."

Tugas utama adalah mencari lokasi pengambilan foto tersebut dengan presisi.

![Task Image](./wanderunit.png)

**Format Flag:** `TBF1{latitude,longitude}` (3 digit desimal).

## 2. Reconnaissance & Scanning

Langkah pertama adalah melakukan analisis visual (*Visual Intelligence*) dan pencarian balik gambar (*Reverse Image Search*) untuk menemukan konteks asli dari foto tersebut.

1.  **Image Analysis:**
    * Terlihat tentara dengan seragam *camo* hijau/loreng.
    * Infrastruktur beton besar (seperti hanggar) dan menara pantau.
    * Kontur tanah gurun/berbukit.

2.  **Reverse Search Results:**
    * Melakukan pencarian gambar mengarah ke sebuah komunitas militer di media sosial (Facebook).
    * Ditemukan *caption* krusial: **"SAT 81 Berada di jordan"**.
    * Komentar pengguna lain menyebutkan: **"Mantap di kasotc, niat banget"**.

Data ini mempersempit pencarian ke fasilitas pelatihan spesifik: **KASOTC (King Abdullah II Special Operations Training Center)** di Amman, Yordania.

## 3. Extraction & Analysis

Setelah target lokasi teridentifikasi (KASOTC), langkah selanjutnya adalah melakukan pencocokan medan (*Terrain Association*) menggunakan citra satelit (Google Maps/Earth).

* **Target:** KASOTC, Amman, Jordan.
* **Landmark:** Mencari jalan melengkung yang diapit oleh bukit tandus dan bangunan hanggar beratap lengkung.

Dengan menyisir area utara kompleks KASOTC, ditemukan kecocokan pola jalan dan bangunan yang identik 100% dengan foto tantangan.

![Satelite match](./satelitewander.png)

**Analisis Peta:**
* Lokasi: **Al Kom Al Sharqi**
* Titik Koordinat: `32.039144, 35.976236`

## 4. Final Verdict

Berdasarkan pencocokan visual antara foto soal dengan citra satelit di fasilitas KASOTC, kita dapat memastikan lokasi pengambilan foto.

Sesuai format flag (3 digit di belakang koma):
* Latitude: `32.039`
* Longitude: `35.976`

**Captured Flag:**

> TBF1{32.039,35.976}