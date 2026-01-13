
# Firmware Update

Tantangan *embedded reverse engineering* pada file binary firmware (ELF) mikrokontroler AVR untuk mendapatkan kembali *license key* toaster pintar.
[DOWNLOAD_ARTIFACT](./firmware.elf)

## The Scenario

Kami mendapatkan sebuah file binary bernama `firmware.elf` yang diekstraksi dari sebuah "internet-connected toaster". Perangkat ini menolak untuk berfungsi tanpa *license key* yang valid.

Berdasarkan header file, binary ini ditujukan untuk arsitektur **AVR** (kemungkinan besar chip ATmega328p yang umum digunakan pada Arduino). Misi kami adalah membedah firmware tersebut dan menemukan *key* rahasia yang tersimpan di dalamnya.

## Reconnaissance

Karena kami tidak memiliki akses ke *hardware* fisik atau debugger AVR (`avr-objdump` tidak tersedia di environment), kami melakukan analisis statis menggunakan tool standar Linux `readelf`.

Langkah pertama adalah memeriksa *Symbol Table* untuk mencari variabel global yang mencurigakan.

```bash
# Membaca simbol debug (STABS) dari file ELF
readelf -s firmware.elf | grep "flag"

```

Dari hasil pembacaan simbol (seperti yang terlihat pada *source dump* awal), ditemukan sebuah simbol menarik:

> `encrypted_flag` (Array of `uint8_t`, size 39 bytes)

Variabel ini berada di section `.data`, yang berarti nilai awalnya tersimpan secara *hardcoded* di dalam binary. Kami kemudian mengekstrak nilai *hex* mentah dari section tersebut:

```bash
readelf -x .data firmware.elf

```

Output hex dump:

```text
Hex dump of section '.data':
  0x00800100 f1e7e394 dec8cae8 fa94ca95 cefa94e8 ................
  0x00800110 fae4faed c4d7e1f2 c4d7c0fa ede5c6ce ................
  0x00800120 c0d7faeb cad2d800                   ........

```

## Reverse Engineering Logic

Data tersebut berlabel `encrypted`, jadi ini bukan *plaintext*. Namun, pada *embedded system* sederhana, enkripsi yang digunakan seringkali hanya berupa **XOR** dengan *static key*.

Kami melakukan analisis *Known Plaintext Attack* (KPA) sederhana pada byte terakhir:

1. Byte terakhir dari data terenkripsi (sebelum null terminator `00`) adalah `0xd8`.
2. Format flag standar adalah `TBF1{...}`, yang berarti karakter terakhir pasti adalah kurung kurawal tutup `}` (ASCII `0x7d`).

Dengan asumsi operasi XOR:


Kami menduga *single-byte XOR key* yang digunakan adalah `0xA5`.

## Extraction Script

Kami menulis script Python sederhana untuk memverifikasi hipotesis kunci `0xA5` tersebut dengan mendekripsi seluruh byte array yang diekstrak dari section `.data`.

```python
def solve():
    # Hex stream dari section .data (exclude null bytes di akhir)
    hex_data = (
        "f1e7e394dec8cae8fa94ca95cefa94e8"
        "fae4faedc4d7e1f2c4d7c0faede5c6ce"
        "c0d7faebcad2d8"
    )
    encrypted_bytes = bytes.fromhex(hex_data)
    key = 0xA5
    
    decrypted_flag = ""
    
    print(f"[*] Attempting decryption with Key: {hex(key)}")
    
    for b in encrypted_bytes:
        # Operasi XOR
        decrypted_flag += chr(b ^ key)
        
    return decrypted_flag

if __name__ == "__main__":
    flag = solve()
    print(f"[+] Flag Decrypted: {flag}")

```

## The Verdict

Hipotesis kami terbukti benar. Enkripsi yang digunakan hanyalah operasi XOR sederhana untuk mengaburkan data di memori. Analisis simbol (`readelf`) sangat krusial di sini untuk menemukan lokasi data yang tepat tanpa harus mendekompilasi seluruh instruksi assembly AVR.

Flag berhasil diamankan dan toaster dapat digunakan kembali untuk sarapan.

> TBF1{moM_1o0k_1M_A_HArdWare_H@cker_Now}
