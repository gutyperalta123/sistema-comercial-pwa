# Roadmap

Planned work for Sistema Comercial PWA.

## Database and security
- [ ] Add Supabase SQL migrations (`supabase/migrations`) so the schema can be recreated
- [ ] Row Level Security policies per business on every table
- [ ] Move the custom login (`usuarios_app`) to Supabase Auth
- [ ] Remove the default password when creating users and force a change on first login
- [ ] Remove the hardcoded `NEGOCIO_ID` from services and take it from the session
- [ ] Replace `xlsx` 0.18.5 (known vulnerabilities) with the SheetJS CDN build or `exceljs`

## Architecture
- [ ] Split `App.jsx` (~1,800 lines) into routes with React Router
- [ ] Remove duplicated screens (`Caja` / `CajaPage`, `Ventas` / `VentasPage`, etc.)
- [ ] Migrate to TypeScript
- [ ] Tests with Vitest + React Testing Library for hooks and services
- [ ] CI with GitHub Actions (lint, tests and build)

## Features
- [ ] Offline mode with a sales queue that syncs when the connection is back
- [ ] Receipt printing on thermal printers
- [ ] Reports by period (sales, best-selling products, margins)
- [ ] Low-stock and upcoming-expiry alerts
- [ ] Multiple payment methods per sale
