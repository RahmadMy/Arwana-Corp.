# Folder Images

Folder ini digunakan untuk menyimpan gambar-gambar yang digunakan di aplikasi.

## Struktur Folder

```
src/assets/images/
├── home-background.jpg     # Background untuk seluruh halaman Home (PENTING!)
├── arowana-bg.jpg          # Background blur untuk hero section
├── arowana-silver.jpg      # Gambar Arowana silver untuk gallery
├── arowana-white.jpg       # Gambar Arowana white/platinum untuk gallery
└── arowana-golden.jpg      # Gambar Arowana golden untuk gallery
```

## Cara Menggunakan

### Background untuk Seluruh Halaman Home

1. **Letakkan gambar background** di folder ini dengan nama `home-background.jpg` (atau `.png`)
2. **Uncomment import** di file `src/pages/public/Home.jsx`:
   ```jsx
   // Dari ini:
   // import homeBackground from '../../assets/images/home-background.jpg'
   
   // Menjadi ini:
   import homeBackground from '../../assets/images/home-background.jpg'
   ```
3. **Update variabel** di dalam komponen:
   ```jsx
   // Dari ini:
   const homeBackground = null
   
   // Menjadi ini:
   const homeBackground = homeBackground // atau langsung gunakan import
   ```

### Gambar Lainnya (Hero Section & Gallery)

1. **Letakkan gambar** di folder ini dengan nama file sesuai kebutuhan
2. **Import gambar** di file `Home.jsx`:
   ```jsx
   import arowanaBg from '../../assets/images/arowana-bg.jpg'
   ```
3. **Gunakan gambar** dalam komponen:
   ```jsx
   <img src={arowanaBg} alt="Arowana Background" />
   ```

## Format Gambar yang Disarankan

- **Home Background** (`home-background.jpg`): 
  - JPG atau PNG
  - Resolusi tinggi (minimal 1920x1080px atau lebih besar)
  - Ukuran file dioptimalkan (max 2-3MB untuk performa)
  - Background akan cover seluruh halaman dengan efek parallax
  
- **Hero Background** (`arowana-bg.jpg`): 
  - JPG atau PNG, resolusi tinggi (minimal 1920x1080)
  - Akan di-blur untuk efek background
  
- **Gallery Images**: 
  - JPG atau PNG, format square (1:1 ratio) untuk tampilan yang konsisten
  - Ukuran 800x800px atau lebih besar
  
- **Optimasi**: Optimalkan semua gambar untuk web (gunakan tools seperti TinyPNG atau ImageOptim)

## Catatan

- Vite akan mengoptimalkan gambar saat build
- Gunakan format WebP untuk performa yang lebih baik (opsional)
- Pastikan nama file tidak mengandung spasi atau karakter khusus

