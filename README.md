# Sistema de Gestión Frontend

Aplicación frontend construida con React, TypeScript y Vite para administrar:

- Productos
- Categorías
- Clientes
- Ventas
- Consultas de ventas por rango de fechas

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Backend esperado

En desarrollo, Vite redirige las rutas `/api/*` al backend disponible en `http://localhost:8081`.

Endpoints consumidos por la app:

- `GET /api/products`
- `POST /api/products`
- `GET /api/categories`
- `POST /api/categories`
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/sales`
- `POST /api/sales`
- `GET /api/consult/sales-between-dates?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
