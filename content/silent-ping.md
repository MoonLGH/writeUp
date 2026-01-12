# Silent Ping

Investigasi forensik jaringan mendalam terhadap covert channel ICMP yang digunakan untuk eksfiltrasi data database.
[DOWNLOAD_ARTIFACT](./silent-ping.tar)

## The Scenario

Kami mendeteksi anomali pada pukul 03:00 pagi. IDS (Intrusion Detection System) tidak memicu alarm berbahaya, namun log bandwidth menunjukkan adanya lalu lintas keluar yang konstan dari server database utama ke IP eksternal yang tidak dikenal.

Analisis awal menunjukkan protokol yang digunakan hanyalah **ICMP (Ping)**. Namun, ukuran paket sedikit lebih besar dari *echo request* standar Windows atau Linux.

## Reconnaissance

Saya membuka file PCAP menggunakan Wireshark. Filter awal yang saya gunakan:

`icmp && ip.src == 192.168.1.5`

Saat memeriksa payload dari paket ICMP (bagian `Data`), terlihat bahwa isinya berubah-ubah pada setiap request. Ini bukan ping biasa yang berisi `abcdef...`, melainkan data biner yang disisipkan.



Pola yang ditemukan:
1.  **Type:** 8 (Echo Request)
2.  **Payload:** 1 byte karakter ASCII yang dapat dibaca disisipkan di byte terakhir data section.

## Extraction Strategy

Daripada melakukan transkrip manual ribuan paket, saya menulis script Python menggunakan library `scapy`. Script ini akan mengiterasi setiap paket, mengambil byte terakhir dari payload, dan menyatukannya kembali menjadi string.

```python
from scapy.all import *

# Load the capture file
pkts = rdpcap("silent_ping.pcap")
flag = []

print("[*] Analyzing traffic...")

for p in pkts:
    # Check for ICMP Echo Request (Type 8) containing Raw data
    if p.haslayer(ICMP) and p[ICMP].type == 8 and p.haslayer(Raw):
        try:
            # Extract the last byte of the load
            payload = p[Raw].load
            char = payload.decode(errors="ignore")[-1]
            
            # Simple heuristic to clean up noise
            if char.isprintable():
                flag.append(char)
        except Exception as e:
            continue

result = "".join(flag)
print(f"[+] Extracted Data: {result}")

```

## The Verdict

Teknik ini dikenal sebagai **ICMP Tunneling**. Penyerang memanfaatkan fakta bahwa banyak firewall mengizinkan trafik ping (ICMP) untuk keperluan troubleshooting jaringan.

Data sensitif telah berhasil diekstrak. Berikut adalah data (Flag) yang berhasil kami susun ulang dari pecahan paket tersebut:

> TBF1{1cmp_tunne1_ing_is_n0t_stea1thy_enough}
