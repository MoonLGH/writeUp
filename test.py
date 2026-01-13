# Data dari hex dump
hex_data = "f1e7e394dec8cae8fa94ca95cefa94e8fae4faedc4d7e1f2c4d7c0faede5c6cec0d7faebcad2d8"

# Convert ke bytes
encrypted_bytes = bytes.fromhex(hex_data)

# Kunci XOR (ditemukan dari analisis byte terakhir)
key = 0xA5

# Dekripsi
flag = ''.join([chr(b ^ key) for b in encrypted_bytes])

print(f"Flag: {flag}")