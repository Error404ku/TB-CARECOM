# TB-CARECOM Frontend

Frontend aplikasi untuk sistem monitoring pengobatan Tuberkulosis berbasis React + TypeScript + Vite.

## Environment Variables

Buat file `.env` di root project dengan konfigurasi berikut:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# QR Code Configuration
# Base URL untuk QR code - UUID dari API akan ditambahkan ke URL ini
VITE_QRCODE_URL=https://your-domain.com/scan/
```

### QR Code Feature

Fitur download QR code tersedia di Dashboard PMO. QR code akan berisi URL yang terdiri dari:
- `VITE_QRCODE_URL` (dari environment variable)
- UUID yang didapat dari API endpoint `/pmo/patient/qr-code`

Contoh: Jika `VITE_QRCODE_URL` adalah `https://example.com/scan/` dan API mengembalikan UUID `96381c89-525d-472f-b22c-62892fdb850a`, maka QR code akan berisi URL: `https://example.com/scan/96381c89-525d-472f-b22c-62892fdb850a`

## Docker Deployment

### 🐳 Production Deployment

1. **Setup Environment Variables**
   ```bash
   # Copy environment template
   cp env.production.example .env
   
   # Edit with your production values
   nano .env
   ```

2. **Build and Run with Docker Compose**
   ```bash
   # Build and start the application
   docker-compose up -d --build
   
   # Check logs
   docker-compose logs -f frontend
   
   # Stop the application
   docker-compose down
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Health Check: http://localhost:3000/health

### 🔧 Development with Docker

1. **Start Development Environment**
   ```bash
   # Start development server with hot reload
   docker-compose -f docker-compose.dev.yml up -d --build
   
   # View logs
   docker-compose -f docker-compose.dev.yml logs -f frontend-dev
   ```

2. **Access Development Server**
   - Development Server: http://localhost:5173
   - Hot reload enabled for `/src` directory

### 📦 Docker Commands

```bash
# Build production image only
docker build -t tb-carecom-frontend .

# Run production container
docker run -d -p 3000:80 --name tb-carecom-frontend tb-carecom-frontend

# Build development image
docker build -f Dockerfile.dev -t tb-carecom-frontend:dev .

# Run development container
docker run -d -p 5173:5173 -v $(pwd)/src:/app/src --name tb-carecom-dev tb-carecom-frontend:dev
```

### 🔧 Configuration Files

- `Dockerfile` - Multi-stage production build
- `Dockerfile.dev` - Development build with hot reload
- `docker-compose.yml` - Production deployment
- `docker-compose.dev.yml` - Development environment
- `nginx.conf` - Nginx configuration for production
- `.dockerignore` - Files excluded from Docker build

### 🚀 Production Features

- ✅ Multi-stage build for optimized image size
- ✅ Nginx serving static files with gzip compression
- ✅ Security headers configured
- ✅ Health check endpoint (`/health`)
- ✅ Proper SPA routing support
- ✅ Static asset caching
- ✅ Container restart policies
- ✅ Docker networking

## Setup

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
