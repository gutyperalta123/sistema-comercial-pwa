# Sistema Comercial PWA

A point-of-sale (POS) system for small shops: kiosks, grocery stores and mini-markets. It runs as a **Progressive Web App**, so it can be installed on a phone, tablet or PC and used like a native app, including barcode scanning with the device camera.

It is multi-business: each shop has its own products, sales, users and settings, and a master panel lets a super admin manage every business.

> The user interface and the code identifiers are in Spanish, since the app targets shops in Argentina.

## Who it's for

- **Small shop owners** who need to track stock, sales and the cash register without an expensive system.
- **Cashiers and employees**, with their own users and permissions (they can't see the amount collected while the register is open).
- **A super admin**, who creates and oversees the businesses.

## Features

- **Sales / cash register**: sales, receipts, opening and closing the register, and requests to reopen it.
- **Blind register for employees**: regular users (cashiers) can't see how much they have collected until they close the register, so the cash count stays honest. Only the owner or admin sees running totals.
- **Products and stock**: create and edit products, stock adjustments and expiry-date tracking.
- **Barcode scanner** using the camera (iPhone included), auto-filling product data from a global catalog and from Open Food Facts.
- **Promotions** per product.
- **Purchase orders** to suppliers, with line items.
- **Internal cash withdrawals** and **monthly payments** (fixed expenses).
- **Dashboard** with business metrics.
- **Users and roles** per business.
- **Master panel** to manage several businesses.
- Export to Excel.

## Tech stack

- **Frontend**: React 19 + Vite
- **PWA**: vite-plugin-pwa (installable, auto-update)
- **Backend / database**: Supabase (PostgreSQL)
- **UI**: Bootstrap 5 + Bootstrap Icons
- **Barcodes**: @zxing/browser
- **Excel**: SheetJS (xlsx)

## Getting started

Requirements: Node.js 20+ and a [Supabase](https://supabase.com) project (the free tier works).

```bash
git clone https://github.com/gutyperalta123/sistema-comercial-pwa.git
cd sistema-comercial-pwa
npm install
cp .env.example .env   # fill in your Supabase project values
npm run dev
```

The app runs at `http://localhost:5173`.

Production build:

```bash
npm run build
npm run preview
```

### Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public (anon / publishable) project key |

### Supabase tables used

`negocios`, `configuracion_negocio`, `usuarios_app`, `super_admins`, `productos`, `catalogo_global_productos`, `ventas`, `detalle_ventas`, `pedidos`, `detalle_pedidos`, `promociones`, `promociones_productos`, `aperturas_caja`, `cierres_caja`, `solicitudes_reapertura_caja`, `retiros_internos` and the `maestro_negocios_resumen` view.

> The SQL script to create the schema is still pending (see the Roadmap).

## Project structure

```
src/
├── pages/      # Screens (Caja, Ventas, Productos, Pedidos, Dashboard, PanelMaestro...)
├── components/ # Sidebar, Topbar, StatCard
├── hooks/      # useProductos, useVentas, useLogin, useUsuarios...
├── services/   # Supabase data access per entity
└── context/    # AuthContext
```

## Roadmap

See [ROADMAP.md](ROADMAP.md).

## License

[MIT](LICENSE) © 2026 Gustavo Peralta
