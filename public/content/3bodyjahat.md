# Three Body Problem

Challenge ini merupakan kombinasi **chaotic PRNG** dan **kriptografi modular**. Sekilas terlihat kuat karena menggunakan konsep chaos, namun seluruh sistem runtuh karena **PRNG dan enkripsi saling bergantung secara deterministik**.


## The Scenario

Kita diberikan beberapa file:

- `cipher.txt` → ciphertext
- `params.txt` → parameter
- hint yang mengarah ke:
  - **Feigenbaum constant**
  - **Logistic Map**
  - seed berbasis `sqrt(1009)`
  - output dibagi per **chunk 3 byte**

Tujuan akhir: **mendapatkan flag**.



## High-Level Idea

Skema ini gagal karena dua alasan utama:

1. **PRNG chaos ≠ random**
2. **Enkripsi bergantung langsung pada output PRNG**

Artinya:
`Jika PRNG bisa direkonstruksi, maka enkripsi otomatis runtuh.`

## Chaotic PRNG Analysis

PRNG menggunakan **Logistic Map**:

```js

xₙ₊₁ = r · xₙ · (1 − xₙ)

```

Parameter `r` berasal dari hint:

```js
const r = new Decimal("3.569945672");
```

Nilai ini adalah **Feigenbaum point**, yaitu titik awal perilaku chaos.

Meskipun chaotic, logistic map bersifat **deterministik**:

* Jika `r`, `seed`, dan jumlah iterasi diketahui
* Maka seluruh output **dapat direproduksi ulang 100%**



## Seed Initialization

Seed berasal dari hint:

> *Fractional part of sqrt(1009), truncated to 18 decimals*

Implementasi:

```js
let state = new Decimal(1009).sqrt().minus(31).toFixed(18);
```

Nilai ini ekuivalen dengan:

```
0.764760348537179962
```

(PRNG **sangat sensitif**, beda 1 digit → hasil beda total)



## Kenapa PRNG SANGAT PENTING ke Enkripsi?

Inilah inti challenge.

Skema enkripsi menggunakan:

```js
C = ((M XOR S) · K)³ mod P
```

Dimana:

* `M` = plaintext
* `S` = output PRNG (keystream)
* `K` = konstanta
* `P` = bilangan prima

❗ Artinya:

* PRNG **langsung masuk ke enkripsi**
* Tidak ada hashing / whitening tambahan
* Tidak ada mixing independen

Sehingga:

`Jika `S` diketahui, maka XOR bisa dibalik sepenuhnya.`

Dan karena PRNG deterministik:

`S bisa direkonstruksi sepenuhnya.`



## Reversing the Math

Karena:

* `P` adalah bilangan prima
* `gcd(3, P−1) = 1`

Maka operasi pangkat tiga **memiliki inverse modular**.

Langkah dekripsi:

1. Akar pangkat tiga modulo `P`
2. Inverse perkalian `K`
3. XOR dengan keystream

Rumus akhir:

```
M = (C^(1/3) · K⁻¹ mod P) XOR S
```



## Modular Arithmetic

Digunakan:

* **Extended Euclidean Algorithm**
* **Fast Modular Exponentiation**

```js
function egcd(a, b) {
  if (b === 0n) return [a, 1n, 0n];
  const [g, x, y] = egcd(b, a % b);
  return [g, y, x - (a / b) * y];
}

function modInv(a, m) {
  const [, x] = egcd(a, m);
  return (x % m + m) % m;
}

function modPow(base, exp, mod) {
  let res = 1n;
  while (exp > 0n) {
    if (exp & 1n) res = res * base % mod;
    base = base * base % mod;
    exp >>= 1n;
  }
  return res;
}
```



## Full Decryption Script (Node.js)

```js
const fs = require("fs");
const Decimal = require("decimal.js");

// =====================
// PARAMETERS
// =====================
const P = 66243390341n;
const K = 1000000000n;
const CHUNKS = 18;
const SKIP = 100;

const r = new Decimal("3.569945672");
let state2 = new Decimal("0.764760348537179962");
let state = new Decimal(1009).sqrt().minus(31).toFixed(18);

//  Logistic map PRNG 
function step() {
  state = r.mul(state).mul(Decimal.sub(1, state));
}

function nextByte() {
  step();
  return state.minus(state.floor()).mul(256).floor().toNumber();
}

// Warm-up
for (let i = 0; i < SKIP; i++) step();

// Load ciphertext
const ciphertext = fs
  .readFileSync("cipher.txt", "utf8")
  .trim()
  .split(/\r?\n/)
  .map(BigInt);

// Precompute inverses
const inv3 = modInv(3n, P - 1n);
const invK = modInv(K, P);

// Decrypt
let flag = "";

for (let i = 0; i < CHUNKS; i++) {
  const S =
    (nextByte() << 16) |
    (nextByte() << 8) |
    nextByte();

  const C = ciphertext[i];
  const val = modPow(C, inv3, P);
  const masked = (val * invK) % P;

  const M = Number(masked) ^ S;

  flag += String.fromCharCode(
    (M >> 16) & 0xff,
    (M >> 8) & 0xff,
    M & 0xff
  );
}

console.log(flag);
```



## Plaintext Reconstruction

Setiap `M` menyimpan **3 karakter ASCII dalam 1 integer (24-bit)**:

```
[ byte1 ][ byte2 ][ byte3 ]
```

Operasi:

* `>>` untuk menggeser byte
* `& 0xff` untuk mengambil 1 byte (8-bit)



## The Verdict

Challenge ini runtuh karena:

* Chaos **bukan** random
* PRNG deterministik + diketahui parameternya
* Enkripsi **bergantung langsung pada PRNG**
* Semua operasi matematika **reversible**

Begitu PRNG direkonstruksi, seluruh ciphertext dapat didekripsi.

> TBF1{evEN_newtoN_cOU1Dn7_SolVE_7H3_tHR3e_BODy_Pr0BlEM}

This final code was a reconstructed from my v1 v2 v3 v4 v5 ... v10 iguess (this chall is evil)

bonus vid this is explaination(kind of) https://youtu.be/-IHZVJ59UnA