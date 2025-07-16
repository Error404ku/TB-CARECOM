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
