# Dungeon Angka

Game roguelike matematika berbasis web (HTML + CSS + JavaScript, tanpa framework).

## Cara menjalankan
1. Buka folder ini di VS Code.
2. Pasang ekstensi **Live Server** (akan disarankan otomatis).
3. Klik kanan `index.html` -> **Open with Live Server**.

## Isi file
- `index.html` : kerangka halaman (menu, pilih pintu, soal, hadiah, hasil).
- `style.css`  : seluruh tampilan (tema dungeon gelap, tombol pixel).
- `game.js`    : seluruh logika, dibagi per bagian:
  - Pembuat soal (antara `//#GEN-START` dan `//#GEN-END`): `genAdd`, `genSub`, `genMul`, `genDiv`, `genFrac`, `genAlg`
  - Suara (`SFX`), gambar pixel art (`DRAW`), relik (`RELICS`)
  - Alur game: `startRun`, `showMap`, `enterRoom`, `nextQuestion`, `resolve`, `endRun`

## Ide latihan
- Tambah monster baru: buat fungsi gambar di `DRAW`, daftarkan di `MONS`, `NAMES`, `HEIGHT`.
- Tambah relik baru di `RELICS` + ikon di `drawRelic` + efeknya di `resolve`.
- Tambah jenis soal baru (misalnya geometri) di bagian pembuat soal.
- Ubah angka keseimbangan: HP monster, waktu per soal, kecepatan naik tingkat (`G.skill`).
