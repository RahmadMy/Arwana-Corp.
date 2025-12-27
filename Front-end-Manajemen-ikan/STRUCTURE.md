# Struktur Project Front-end Manajemen Ikan

## 📁 Struktur Folder

```
Front-end-Manajemen-ikan/
├── src/
│   ├── components/          # Komponen reusable
│   │   └── ProtectedRoute.jsx
│   ├── contexts/           # React Context untuk state management
│   │   └── AuthContext.jsx
│   ├── layouts/            # Layout components
│   │   ├── PublicLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── WorkerLayout.jsx
│   ├── pages/              # Halaman-halaman aplikasi
│   │   ├── public/        # Halaman publik (tidak perlu login)
│   │   │   ├── Home.jsx
│   │   │   ├── News.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Product.jsx
│   │   │   └── Archive.jsx
│   │   ├── auth/          # Halaman authentication
│   │   │   └── Login.jsx
│   │   ├── admin/         # Halaman admin (perlu login sebagai admin)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── Aquariums.jsx
│   │   │   ├── FishSpecies.jsx
│   │   │   ├── FishGrowth.jsx
│   │   │   ├── FishHealth.jsx
│   │   │   ├── Harvest.jsx
│   │   │   ├── FeedingSchedule.jsx
│   │   │   ├── Feed.jsx
│   │   │   └── News.jsx
│   │   └── worker/        # Halaman worker (perlu login)
│   │       ├── Dashboard.jsx
│   │       ├── Aquariums.jsx
│   │       ├── FishGrowth.jsx
│   │       ├── FishHealth.jsx
│   │       └── FeedingSchedule.jsx
│   ├── services/          # API service files
│   │   ├── userService.js
│   │   ├── aquariumService.js
│   │   ├── fishSpeciesService.js
│   │   ├── fishGrowthService.js
│   │   ├── fishHealthService.js
│   │   ├── newsService.js
│   │   ├── harvestService.js
│   │   ├── feedingScheduleService.js
│   │   └── feedService.js
│   ├── utils/             # Utility functions
│   │   └── api.js
│   ├── App.jsx            # Main App component dengan routing
│   ├── main.jsx           # Entry point
│   └── index.css         # Global styles (Tailwind)
├── public/
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🔐 Sistem Authentication

### Roles
- **Public**: Tidak perlu login (Home, News, About, Product, Archive)
- **Admin**: Perlu login dengan role 'admin'
- **Worker**: Perlu login dengan role 'worker' atau 'admin'

### Protected Routes
- Routes dengan prefix `/admin/*` hanya bisa diakses oleh admin
- Routes dengan prefix `/worker/*` bisa diakses oleh worker atau admin
- Semua protected routes akan redirect ke `/login` jika belum login

## 📡 API Integration

Semua service files menggunakan base URL dari environment variable:
- `VITE_API_BASE_URL` (default: `http://localhost:3000/api`)

### Service Files
Setiap service file memiliki method:
- `getAll()` - GET all data
- `getById(id)` - GET by ID
- `create(data)` - POST new data
- `update(id, data)` - PUT update data
- `delete(id)` - DELETE data

## 🎨 Styling

Project menggunakan **Tailwind CSS** untuk styling.

## 🚀 Cara Menjalankan

1. Install dependencies:
```bash
npm install
```

2. Setup environment variable (opsional):
Buat file `.env` di root project:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Jalankan development server:
```bash
npm run dev
```

## 📝 Catatan

- Login saat ini menggunakan mock data untuk development
- Ganti fungsi login di `AuthContext.jsx` dengan API call yang sebenarnya
- Semua halaman admin dan worker sudah memiliki struktur dasar
- Beberapa halaman masih placeholder dan perlu dikembangkan lebih lanjut

