# zkSNARKS · node-07 — pixel town explainer

Landing page 1-halaman, tema pixel-game 2D, buat ngejelasin project **zkSNARKS**
sekaligus konsep **zk-SNARK** (zero-knowledge proof) dengan cara yang gampang dicerna.

Static site murni — HTML/CSS/JS vanilla, tanpa build step, tanpa framework.
Tinggal buka `index.html` di browser buat preview lokal.

## Struktur folder

```
zksnarks-pixel-site/
├── index.html          # semua konten & section
├── css/style.css        # semua styling (pixel theme, warna, layout)
├── js/main.js            # boot screen, gerakin karakter, dialog NPC, mini-game proof arena
├── assets/img/           # 4 karakter NFT (background sudah dihapus, PNG transparan)
│   ├── char-prover.png
│   ├── char-witness.png
│   ├── char-verifier.png
│   └── char-circuit.png
└── README.md
```

## Section yang ada

1. **Home** — hero, intro singkat
2. **Manifesto** — cerita latar zkSNARKS + kutipan tradisi cypherpunk
3. **Luminaries** — kota kecil yang bisa dijalanin (arrow key / WASD), klik karakter buat
   liat dialog. 4 karakternya dipetakan ke istilah zk-SNARK asli: **Prover, Witness,
   Verifier, Circuit** — jadi lore NFT-nya sekalian ngajarin konsepnya.
4. **Snarklist** — roadmap/quest log (masih **data contoh**, ganti sesuai roadmap asli lo)
5. **Status** — panel status jaringan (juga **data contoh/mock**, angka jalan random)
6. **Proof Arena** — mini-game interaktif simulasi zero-knowledge proof (analogi gua
   Ali Baba yang klasik), biar orang paham cara kerja zk-SNARK sambil main-main

## Yang WAJIB diganti sebelum publish

Semua ini gampang dicari — tinggal `Ctrl+F` di `index.html`:

- **Section Snarklist** (`id="snarklist"`) — ganti list contoh dengan roadmap asli
- **Section Status** (`id="status"`) — data di sini semua contoh/dummy, sambungkan ke
  data asli (contract, indexer, dsb) kalau mau live
- **Kutipan cypherpunk** di section Manifesto — ganti/parafrase sesuai suara brand lo,
  atau hapus kalau gak perlu
- Link footer & social — belum ada, tambahin sendiri
- Ganti nama 4 karakter (`Prover/Witness/Verifier/Circuit`) kalau NFT lo udah punya nama resmi

## Preview lokal

Cukup buka `index.html` langsung di browser, atau kalau mau server lokal (biar path
relatif aman semua):

```bash
npx serve .
# atau
python3 -m http.server 8000
```

## Push ke GitHub

```bash
cd zksnarks-pixel-site
git init
git add .
git commit -m "init: zkSNARKS pixel town explainer"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

## Deploy ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new), import repo GitHub yang barusan di-push
2. Framework preset: pilih **Other** (gak butuh build step)
3. Build command: kosongkan
4. Output directory: `.` (root)
5. Deploy

Selesai — otomatis dapet URL `*.vercel.app`, dan tiap `git push` ke `main` bakal
auto-redeploy.

## Kalau mau kembangin lebih lanjut

- Tambah karakter baru: taruh PNG transparan di `assets/img/`, copy salah satu blok
  `.npc` di `index.html`, ganti `id`, posisi (`left`/`top`), dan `data-*` attribute-nya
- Ganti font: tinggal ganti link Google Fonts di `<head>` + variable `--font-display`
  / `--font-body` di `css/style.css`
- Ganti palet warna: semua ada di `:root{}` paling atas `css/style.css`
