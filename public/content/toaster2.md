
# Smart Toaster v2.0

Challenge *Reverse Engineering* pada firmware *embedded system* (AVR Microcontroller) yang mengharuskan kita membongkar logika validasi password custom.

## The Scenario

Kita diberikan sebuah file firmware bernama `toaster_v2.elf`. Deskripsi tantangan menyebutkan bahwa pemanggang roti pintar ini baru saja melakukan update otomatis dan sekarang terkunci dengan pesan "Security Patch Applied". Tugas kita adalah membobol sistem keamanan baru ini.

Langkah pertama adalah mengidentifikasi jenis file.

```bash
file toaster_v2.elf
# toaster_v2.elf: ELF 32-bit LSB executable, Atmel AVR 8-bit, version 1 (SYSV), statically linked, not stripped

```

Ini adalah binary untuk mikrokontroler **ATMega328p**, chip yang sama yang digunakan pada Arduino Uno.

## Reconnaissance

Karena ini adalah arsitektur AVR, kita bisa menggunakan tools seperti `avr-objdump` atau **Ghidra** (dengan pengaturan arsitektur AVR8).

Kami membedah fungsi validasi utama yang terletak di offset memori `0x96`. Berikut adalah potongan *disassembly*-nya:

```asm
00000096 <check_password>:
  98:	20 81       	ld	r18, Z      ; Load char pertama
  9a:	24 35       	cpi	r18, 0x54	; Bandingkan dengan 'T' (0x54)
  9c:	81 f4       	brne	.+32     	; Jika beda, GAGAL

  ; ... (Looping setup) ...

  a8:	91 91       	ld	r25, Z+     ; Load char input berikutnya
  aa:	35 e5       	ldi	r19, 0x55	; Load kunci 0x55 ('U')
  ac:	93 27       	eor	r25, r19    ; XOR input dengan 0x55
  ae:	92 0f       	add	r25, r18    ; Tambah dengan Index (r18)
  b0:	8d 91       	ld	r24, X+     ; Load "Secret Byte" dari memori
  b2:	98 13       	cpse	r25, r24    ; Bandingkan hasil hitungan dengan Secret Byte
  b4:	07 c0       	rjmp	.+14     	; Jika beda, GAGAL

```

Dari kode assembly di atas, kita dapat menyimpulkan algoritma validasinya:

1. Karakter pertama **wajib** huruf `'T'`.
2. Sisa karakter mengalami operasi matematika: `(Input_Char ^ 0x55) + Index = Secret_Byte`.
3. Hasilnya dibandingkan dengan data rahasia (*Secret Bytes*) yang tersimpan di memori.

## Extraction Script

Tantangan selanjutnya adalah menemukan lokasi **Secret Bytes** tersebut. Berdasarkan analisis alur program (`main` loop), data referensi dimuat dari alamat `0x151` di dalam file ELF.

Kami melakukan *dumping* data hex dari file tersebut:

```text
Offset 0x151:
18 15 67 32 2c 6c 2a 6e 30 30 6f 47 3f 18 48 75
43 76 49 1e 79 3c 21 4e 7e 7f 54 44

```

Untuk mendapatkan flag, kita harus membalikkan (reverse) logika matematika assembly tadi:

* **Logika Enkripsi:** `(Char ^ 0x55) + Index = Secret`
* **Logika Dekripsi:** `Char = (Secret - Index) ^ 0x55`

Berikut adalah *solver* Python untuk mendekripsi flag:

```python
# Secret bytes diambil dari offset 0x151 di toaster_v2.elf
secret_bytes = bytes.fromhex("18 15 67 32 2c 6c 2a 6e 30 30 6f 47 3f 18 48 75 43 76 49 1e 79 3c 21 4e 7e 7f 54 44")

# Karakter pertama sudah divalidasi sebagai 'T' di assembly
flag = "T" 
key_xor = 0x55

print("[*] Decrypting Firmware Logic...")

for index, byte_val in enumerate(secret_bytes):
    # Di assembly, index loop dimulai dari 1 (setelah huruf 'T')
    real_index = index + 1 
    
    # Reverse Logic:
    # 1. Kurangi byte rahasia dengan index posisinya
    # 2. XOR dengan 0x55
    val_minus_index = (byte_val - real_index) & 0xFF  # & 0xFF untuk handle underflow 8-bit
    decoded_char = val_minus_index ^ key_xor
    
    flag += chr(decoded_char)

print(f"[+] Flag Found: {flag}")

```

## The Verdict

Dengan menjalankan script solver di atas, kita berhasil membalikkan logika verifikasi firmware dan mendapatkan password asli untuk membuka kunci *toaster*.

> TBF1{r3v3rs1ng_l0g1c_1s_c00l}
