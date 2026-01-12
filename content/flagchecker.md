# Flag Checker V2

Tantangan reverse engineering pada binary Linux "stripped" untuk membongkar algoritma validasi password kustom.
[DOWNLOAD_ARTIFACT](./flagcheckerv2)

## The Scenario

Kami diberikan sebuah file binary executable bernama `flagcheckerv2`. Program ini mensimulasikan sistem login sederhana: meminta input "flag" dari pengguna, memprosesnya, dan memberikan respons apakah flag tersebut **Correct!** atau **Wrong!**.

Tantangan utama di sini adalah file binary tersebut dalam keadaan *stripped* (simbol debugging dihapus) dan tidak adanya akses ke *source code*. Misi kami adalah merekonstruksi algoritma pengecekan untuk mendapatkan flag yang valid.

## Reconnaissance

Langkah pertama adalah melakukan analisis statis menggunakan perintah dasar Linux `strings` untuk melihat teks yang terbaca di dalam binary.

```bash
strings flagcheckerv2

```

Output yang menarik perhatian kami:

```text
Enter the flag: 
Wrong!
Correct! ;*3$"

```

Terlihat string aneh `;*3$"` tepat setelah pesan "Correct!". Karena format flag standar kompetisi ini adalah `TBF1{...}`, kami mencurigai adanya korelasi antara *plaintext* dan string aneh tersebut.

Kami mencoba melakukan "Known Plaintext Attack" sederhana dengan membandingkan nilai ASCII:

1. **T** (84) vs **;** (59) -> Selisih 25
2. **B** (66) vs ***** (42) -> Selisih 24
3. **F** (70) vs **3** (51) -> Selisih 19

Pola selisih yang tidak konsisten menunjukkan bahwa ini bukan sekadar *Caesar Cipher* (geser biasa), melainkan melibatkan operasi bitwise (seperti XOR atau Bit Rotation).

## Reverse Engineering Strategy

Melalui analisis mendalam pada instruksi assembly (tanpa harus melakukan debugging dinamis yang rumit), kami menemukan alur logika validasi sebagai berikut:

1. Program mengambil input user.
2. Setiap karakter di-**XOR** dengan `0x67`.
3. Hasilnya dilakukan **Rotate Right (ROR)** sebanyak 1 bit.
4. Hasil akhir dibandingkan dengan *byte array* rahasia yang tersimpan di memori (offset `0x2020`).

Oleh karena itu, untuk mendapatkan flag asli, kita harus membalik urutan algoritmanya terhadap data rahasia tersebut:

1. Ambil *Encrypted Byte*.
2. Lakukan **Rotate Left (ROL)** 1 bit (kebalikan dari ROR).
3. Lakukan **XOR** dengan `0x67`.

## Extraction Script

Kami mengekstrak *byte array* target dari binary dan menulis solver menggunakan Python untuk mendekripsi flag secara otomatis.

```python
def solve():
    print("[*] Starting Decryption Routine...")

    # Data rahasia (Ciphertext) yang diekstrak dari offset 0x2020
    # Data ini tidak muncul sempurna di 'strings' karena mengandung karakter non-printable
    encrypted_bytes = [
        0x99, 0x92, 0x90, 0x2b, 0x0e, 0x8b, 0x0f, 0x28, 
        0x87, 0xab, 0x84, 0x1c, 0x05, 0xa9, 0x06, 0x2a, 
        0x0a, 0x1c, 0x89, 0x8a, 0x06, 0x87, 0x0e, 0x1c, 
        0x89, 0x6a, 0x06, 0x04, 0x94, 0x4a, 0x85, 0x76
    ]

    flag = ""
    
    for b in encrypted_bytes:
        # Step 1: Reverse ROR 1 -> ROL 1
        # ((byte << 1) | (byte >> 7)) & 0xFF meniru rotasi kiri 8-bit
        val = ((b << 1) | (b >> 7)) & 0xFF
        
        # Step 2: Reverse XOR
        # Operasi XOR bersifat reversibel dengan kunci yang sama
        decrypted_char = val ^ 0x67
        
        flag += chr(decrypted_char)

    return flag

if __name__ == "__main__":
    result = solve()
    print(f"[+] Flag Found: {result}")

```

## The Verdict

Tantangan ini mengajarkan bahwa output `strings` bisa menipu. Data `;*3$` hanyalah sebagian kecil dari ciphertext yang kebetulan bisa dibaca (printable ASCII), sementara sisa datanya tersembunyi. Dengan memahami assembly dasar dan operasi bitwise, kita berhasil membalikkan logika program.

Flag lengkap berhasil direkonstruksi:

> TBF1{py7h0n_m4k3s_tr4n5f0rm50_e4sy}
