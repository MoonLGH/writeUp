
# Write-Up: Pixel Peeping

## Deskripsi Challenge

*"High resolution or high focus? The name is hidden in plain sight. Trace it to their official Instagram and find the origin of their feed. Your prize is in the first post ever uploaded."*

Challenger diminta untuk menemukan sebuah lokasi berdasarkan foto jalan aspal menanjak dengan papan penunjuk arah "KELUAR" dan bangunan unik berwarna kuning, lalu mencari *flag* pada postingan pertama di akun Instagram resmi lokasi tersebut.

![Gambar](./pixel.png)
### Langkah Penyelesaian

## 1. Fase Stagnasi (Scenario Analysis)

Awalnya, proses analisis berjalan sangat lambat. Seharian penuh waktu dihabiskan hanya untuk memandangi tekstur aspal, bebatuan di sisi kiri, dan tong sampah hijau dalam gambar.

Upaya melakukan *Reverse Image Search* (Google Lens, Yandex) tidak membuahkan hasil yang spesifik, hanya menampilkan jalanan umum atau taman acak. Petunjuk visual hanya mengarah pada fakta bahwa lokasi ini berada di Indonesia (berdasarkan rambu "KELUAR") dan memiliki arsitektur pintu gerbang berbentuk lingkaran (*Moon Gate*).

## 2. Profiling Author (Reconnaissance)

Karena analisis visual mengalami kebuntuan (*stuck*), strategi diubah dengan melakukan *profiling* terhadap pembuat soal (*author*).

* **Author:** `tntoluena`
* **Intel:** Berdasarkan informasi komunitas atau *osint* profil, diketahui bahwa author berasal dari daerah **Bangka Belitung**.

Informasi ini menjadi *pivot point* yang krusial. Pencarian yang tadinya mencakup seluruh Indonesia kini dipersempit khusus ke wilayah Bangka Belitung.

## 3. Geolocation & Extraction

Dengan asumsi lokasi berada di Bangka Belitung, pencarian dilakukan dengan kata kunci spesifik:
*"Vihara Bangka Belitung bangunan kuning pintu bulat"* atau *"Tempat wisata Sungailiat Bangka" dikarenakan tempat yang memiliki toilet umum sudah pasti wisata 🧠*.

Hasil pencarian menunjuk pada **Puri Tri Agung** di Sungailiat, Bangka.
Validasi visual dilakukan dengan membandingkan foto soal dengan foto lokasi di Google Maps:

* Jalan aspal menanjak: **Match**
* Bangunan kuning dengan pintu bulat: **Match**
* Posisi tong sampah dan batu: **Match**

Langkah terakhir adalah melakukan penelusuran aset digital sesuai instruksi soal (*"find the origin of their feed"*).

1. Buka Instagram dan cari akun resmi lokasi tersebut: **@puritriagung**.
2. *Scroll* hingga ke postingan paling pertama (First Post) yang pernah diunggah.
3. Flag ditemukan pada *caption* atau konten postingan perdana tersebut.

![puriIG](./puriig.png)
## Kesimpulan (Verdict)

Tantangan ini mengajarkan bahwa OSINT tidak melulu soal apa yang ada di dalam gambar (*pixel peeping*), tetapi juga memahami konteks siapa yang mengambil gambar tersebut.

**Flag Akhir:**

> TBF1{u53_y0ur_3y3}
