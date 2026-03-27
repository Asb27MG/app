# Monorepo: Frontend & Backend

This workspace now contains two separate apps under `frontend` and `backend`.

- `frontend` is a React + TypeScript + Vite project that powers the UI.
- `backend` is an Express/Node server providing API endpoints (for example, contact form handling with Resend).

To run the frontend during development:

```bash
cd frontend
npm install      # install dependencies (only once)
npm run dev      # start Vite dev server (http://localhost:5173)
```

To connect the frontend to a backend deployed on Render:

1. Create a `frontend/.env` file from `frontend/.env.example`.
2. Set your backend URL:

```bash
VITE_API_BASE_URL=https://your-backend-name.onrender.com
```

If `VITE_API_BASE_URL` is empty, the frontend will use relative `/api` routes (useful with local Vite proxy in development).

To build the frontend for production:

```bash
cd frontend
npm run build     # output goes to frontend/dist
```

To run the backend server:

```bash
cd backend
npm install       # install dependencies if not already done
# create a .env file with RESEND_API_KEY and any DB settings
npm start          # listens on port 3001 by default
```

The backend currently serves static files from `../frontend/dist` once the frontend is built, and exposes API routes under `/api` (see `routers/contacto.routes.js`).

## WhatsApp messaging API

A separate router (`whatsapp.routes.js`) handles sending WhatsApp messages via Twilio.  It is independent of the email logic used elsewhere.  To use it you must:

1. Install the Twilio package in the backend:
   ```bash
   cd backend && npm install twilio
   ```
2. Add the following variables to your `.env` file (alongside the Resend/DB keys):
   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   WHATSAPP_FROM=whatsapp:+14155238886   # Twilio sandbox or purchased number
   WHATSAPP_TO=whatsapp:+541120498272    # número que recibirá automáticamente cotizaciones
   ```
3. Call the endpoint from any client:
   ```bash
   POST /api/whatsapp
   Content-Type: application/json
   {
     "to": "whatsapp:+549112345678",        # destination number
     "message": "Texto a enviar"            # plain text body
     // alternatively use a template:
     // "contentSid":"HX...",
     // "contentVariables": { "1":"valor" }
   }
   ```

`to` must be prefixed with `whatsapp:` and include the full international number.  Any phone can receive the message as long as your Twilio sender is authorised (sandbox participants or verified business number).

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

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

export default defineConfig([
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
