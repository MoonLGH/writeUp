# Save The Bear

**Kategori:** Reverse Engineering / Crypto

**Penulis:** Azarea

**Deskripsi:** *Find the fastest way to get the flag.*

## Analisis

[DOWNLOAD_ARTIFACT](./savethebear.zip)

Tantangan ini memberikan sebuah file Python (`main.py`) yang merupakan game berbasis Pygame bernama "Drill Baby Drill!". Tujuan permainan adalah mengebor ke dasar tanah untuk menemukan beruang tanpa mengenai batu (*boulder*).

### 1. Mencari Logika *Flag*

Kita mulai dengan memeriksa fungsi `main()`. Di sini terdapat variabel `bear_sum` yang diinisialisasi dengan `1`.

```python
bear_sum = 1
# ...
if player.hitBear():
    player.drill.retract()
    bear_sum *= player.x  # bear_sum dikalikan dengan posisi X pemain
    bear_mode = True

```

Setiap kali pemain berhasil menemukan beruang, `bear_sum` dikalikan dengan koordinat `x` dari pemain. Setelah semua level selesai, `bear_sum` digunakan untuk mendeskripsi *flag*:

```python
if current_level == len(LevelNames) - 1 and not victory_mode:
    victory_mode = True
    flag_text = GenerateFlagText(bear_sum)
    print("Your Flag: " + flag_text)

```

### 2. Menentukan Jalur Aman (*Safe Path*)

Kita tidak perlu memainkan game secara manual. Kita cukup mencari tahu nilai `player.x` yang benar (jalur aman) untuk setiap level.

Lihatlah bagian pembuatan *level* di dalam *loop* permainan:

```python
for i in range(0, tiles_width):
    if (i != len(LevelNames[current_level])):
        boulder_layout.append(random.randint(2, max_drill_level))
    else:
        boulder_layout.append(-1) # -1 menandakan tidak ada batu (aman)

```

Kode di atas menunjukkan bahwa satu-satunya kolom yang aman (di mana `boulder_layout` bernilai `-1`) selalu berada di indeks `i` yang sama dengan **panjang string nama level tersebut** (`len(LevelNames[current_level])`).

Karena pemain harus berada di kolom yang aman untuk mencapai dasar dan menemukan beruang, maka `player.x` yang dikalikan ke `bear_sum` pastilah panjang dari nama level tersebut.

### 3. Kalkulasi *Key*

Daftar level yang ada di kode:

```python
LevelNames = [
    'California',       # Panjang: 10
    'Ohio',             # Panjang: 4
    'Death Valley',     # Panjang: 12
    'Mexico',           # Panjang: 6
    'The Grand Canyon'  # Panjang: 16
]

```

Karena perkalian bersifat komutatif (urutan tidak berpengaruh), kita bisa menghitung `bear_sum` total langsung:


## Penyelesaian (*Solver Script*)

Kita dapat membuat skrip Python sederhana untuk melakukan dekripsi tanpa perlu menginstall Pygame atau memainkan gamenya.

```python
def solve():
    # 1. Daftar nama level dari source code
    LevelNames = [
        'California',
        'Ohio',
        'Death Valley',
        'Mexico',
        'The Grand Canyon'
    ]
    
    # 2. Hitung bear_sum (hasil kali panjang string)
    bear_sum = 1
    for level in LevelNames:
        bear_sum *= len(level)
    
    print(f"[+] Calculated bear_sum: {bear_sum}")

    # 3. Dekripsi Flag menggunakan logika dari game
    # Key diambil dari 8 bit atas bear_sum
    key = bear_sum >> 8 
    
    encoded = "\xe0\xf7\xf0\x86\xc3\xd1\xce\xcf\xcc\xce\x84\x90\xef\xb6\xb5\xb4\xea\xbc\xa9\xb2\xbc\xbc\xa8\xae\xe2\xae\xa1\xa2\xff\xa6\xb3\xa7\xb7\xbd\xe9\xa1\xe5\x9d\xa2\x96\xa8\xa4\xab\x9b\xd8\xa9\x93\xaa\x99"
    plaintext = []
    
    for i in range(0, len(encoded)):
        # XOR karakter terenkripsi dengan (key + index)
        decoded_char = chr(ord(encoded[i]) ^ (key + i))
        plaintext.append(decoded_char)
        
    return ''.join(plaintext)

if __name__ == "__main__":
    flag = solve()
    print(f"[+] Flag: {flag}")

```

### Output

Menjalankan skrip di atas akan menghasilkan:

```text
[+] Calculated bear_sum: 46080
[+] Flag: TBF1{https://www.youtube.com/watch?v=DxMtyuD8HqI}

```


> TBF1{https://www.youtube.com/watch?v=DxMtyuD8HqI}
Video ini merupakan lagu "Tidak Ada Salju di Sini" oleh Hindia, yang sesuai dengan tema tantangan "Save The Bear" (mengingat beruang kutub dan salju).

... [Tidak Ada Salju di Sini, Pt. 7](https://www.youtube.com/watch?v=DxMtyuD8HqI) ...

Bapa kami yang ada di surga dimuliakanlah nama mu 🙏
