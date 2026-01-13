
# Write-Up: Professional Tower OSINT

## Deskripsi Challenge

Peserta diberikan sebuah foto pos keamanan ("POS KAMPLING") dengan latar belakang sebuah menara telekomunikasi *self-supporting* yang menjulang tinggi, serta sebuah struktur menara air berwarna biru. Peserta diminta untuk mencari tahu siapa pemilik menara tersebut dan berapa tingginya.
![tower](./tower.jpeg)

**Format Flag:** `TBF1{owner_heiht}` (*case insensitive*)


### Langkah Penyelesaian

## 1. Identifikasi Lokasi (Visual Intelligence & IMINT)

Langkah pertama adalah menentukan lokasi pengambilan gambar.

* **Analisis Gambar:** Terlihat sebuah pos kampling dan menara air biru khas di dekat sebuah gerbang/jalan kecil.
* **Geolocation:** Berdasarkan pengetahuan lokal (*local knowledge*) atau pencarian landmark area kampus, lokasi ini dapat diidentifikasi sebagai **"Pintu Doraemon"**, yang merupakan akses jalan tikus menuju **Fakultas Teknik, Universitas Negeri Semarang (UNNES)**, Sekaran, Gunung Pati.

## 2. Mencari Sumber Data (Information Gathering)

Setelah lokasi diketahui berada di wilayah Semarang, langkah selanjutnya adalah mencari database publik mengenai infrastruktur telekomunikasi di kota tersebut.

* **Query Pencarian:** Menggunakan kata kunci seperti *"Peta sebaran menara telekomunikasi Semarang"* atau *"Data tower Semarang"*.
* **Hasil:** Ditemukan situs resmi Pemerintah Kota Semarang, yaitu **Si MenTel (Sistem Informasi Menara Telekomunikasi)** di alamat:
```url 
https://sistel.semarangkota.go.id/peta-menara
```

![Sistel](./sistel.png)


## 3. Melacak Aset pada Peta (Pinpointing)

* Buka peta pada situs *Si MenTel*.
* Arahkan navigasi peta menuju lokasi yang telah diidentifikasi sebelumnya (Area Fakultas Teknik UNNES / Sekaran).
* Cari ikon menara yang posisinya sesuai dengan gambar soal (di dekat jalan akses "Pintu Doraemon").
* Klik pada ikon menara tersebut untuk melihat detailnya.
* **URL Target:** `https://sistel.semarangkota.go.id/detail-menara?id=395`
![exacttower](./exacttower.png)

## 4. Ekstraksi Informasi & Pengambilan Flag

Dari halaman detail menara (seperti yang terlihat pada *screenshot* kedua), didapatkan data spesifik sebagai berikut:

* **Nama Site:** PROTELINDO CEMPAKA SARI I
* **Pemilik Antena (Owner):** PROTELINDO
* **Tinggi Antena (Height):** 65

Sesuai dengan format flag yang diminta `TBF1{owner_heiht}`:

* Owner: `PROTELINDO`
* Height: `65`

**Flag Akhir:**

> TBF1{PROTELINDO_65}
