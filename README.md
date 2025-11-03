# Invoices UI (Vue 3 + Vite + TS)


A tiny invoicing UI with CRUD over a simple REST API, live editor & preview, and client-side search.


## ✅ Features (Acceptance Checklist)
- List page: fetch with loading, error banner, empty state
- Client-side search by customerName (debounced 350ms)
- Delete with confirm + toast, removes row
- Editor: required fields, per-field + form-level validation (≥1 item)
- Live totals: item.total, subtotal, vat=20%, total – all formatted to EUR
- Add/remove items; recalculation on change
- Save (create/update) → success toast → back to list; Cancel returns without saving
- Buttons disabled during requests; minimal consistent spacing


## 🛠 Tech
- Vue 3 + Vite + TypeScript + Composition API
- Vue Router (2 routes)
- Axios for HTTP
- Minimal CSS (no heavy UI libs)


## 🔧 Setup
```bash
pnpm i # or npm i / yarn
cp .env.example .env
# edit VITE_API_BASE_URL if needed
pnpm dev # or npm run dev / yarn dev
```


Default API: `https://68da7d4b23ebc87faa304fad.mockapi.io` with endpoints:
- `GET /invoices`
- `GET /invoices/:id`
- `POST /invoices`
- `PUT /invoices/:id`
- `DELETE /invoices/:id`


> If you prefer your own backend (Supabase/Firebase/JSON Server), keep the same schema and CRUD routes (see `src/types.ts`).


## 🧪 Notes
- All computed fields are sent in POST/PUT.
- Env var: `VITE_API_BASE_URL`.
- Amounts are fixed to 2 decimals; currency EUR.


## 🚀 Deploy
Deploy to Netlify/Vercel as a standard Vite SPA. Remember to set `VITE_API_BASE_URL` in the dashboard.