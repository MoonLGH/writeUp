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