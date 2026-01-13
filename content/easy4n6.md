# Very Easy Forensics — easy4n6.png

Tantangan forensik ini diklaim sebagai *very easy* dan bahkan disebut lebih mirip **sanity check**. Deskripsi tersebut mengisyaratkan bahwa solusi tidak memerlukan teknik kompleks seperti brute-force, kriptografi berat, ataupun analisis mendalam.


## The Scenario

Kami diberikan sebuah file gambar PNG bernama `easy4n6.png`.  
Tidak ada instruksi teknis tambahan selain deskripsi singkat yang terkesan “mengejek” karena tingkat kesulitannya yang sangat rendah.

Petunjuk utama justru terdapat pada **deskripsi challenge itu sendiri**, yang menyiratkan bahwa jawabannya tersembunyi dengan cara yang sangat sederhana dan langsung.
![4n6](./easy4n6.png)

## Reconnaissance

Langkah awal adalah melakukan inspeksi dasar terhadap file.

```bash
file easy4n6.png
exiftool easy4n6.png
````

Hasil analisis menunjukkan bahwa file merupakan **PNG valid** dan **tidak mengandung metadata mencurigakan**.
Artinya, flag tidak disimpan di EXIF atau komentar file.

Selanjutnya dilakukan pengecekan terhadap kemungkinan data tersembunyi.

```bash
strings easy4n6.png
binwalk easy4n6.png
```

Dari `binwalk`, terdeteksi adanya **data terkompresi (zlib)** di dalam file PNG, yang mengindikasikan kemungkinan **steganografi**.

## Steganography Analysis

Untuk menganalisis steganografi pada PNG, digunakan tool `zsteg`.

```bash
zsteg easy4n6.png
zsteg -a easy4n6.png
```

Output penting yang ditemukan:

```text
b8,rgb,lsb,xy  .. text: "Cngrts.ng"
b8,rgba,lsb,xy .. text: "Congrats.png"
```

Temuan ini menunjukkan bahwa di dalam gambar terdapat **file tersembunyi bernama `Congrats.png`** yang disisipkan menggunakan teknik **LSB (Least Significant Bit)**.

## Extraction

Payload diekstrak menggunakan mode LSB RGBA:

```bash
zsteg -E b8,rgba,lsb,xy easy4n6.png > raw.bin
```

Pemeriksaan awal terhadap file hasil ekstraksi:

```bash
xxd raw.bin | head
```

Terlihat adanya **header PNG**, yang menandakan bahwa file gambar kedua benar-benar tertanam di dalam file asli.

File PNG kemudian dipotong (carving) mulai dari magic bytes:

```
89 50 4E 47 0D 0A 1A 0A
```

```bash
dd if=raw.bin of=Congrats.png bs=1 skip=288
```

## Result

Setelah membuka `Congrats.png`, terlihat sebuah gambar ucapan selamat.
Di bagian bawah gambar tersebut terdapat **flag dalam bentuk plaintext**, tanpa enkripsi tambahan.
![4n6](./congrats.png)

## The Verdict

Challenge ini memang benar-benar *very easy* sesuai klaimnya.
Tidak ada teknik forensik lanjutan, anti-debug, ataupun jebakan tambahan. Tantangan ini hanya menguji apakah peserta:

* Memeriksa file dengan teliti
* Mengenali steganografi dasar pada PNG
* Tidak terkecoh oleh deskripsi

Flag berhasil diamankan.

> TBF1{7h15_15_7HE_e@s1e57_ForEn51C_CH4LL_1vE_evER_M4D3}
