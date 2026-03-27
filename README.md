# Sales Admin (React + Vite)

Refactor completo de la UI para un flujo administrativo con **navbar superior + sidebar hamburguesa colapsable + contenido dinámico**.

## Flujo principal implementado

1. Entrar a **Ventas**.
2. Ver listado de ventas.
3. Seleccionar una venta.
4. Ir a **Detalle de Venta**.
5. Ver, crear, editar y eliminar productos vendidos en esa venta.

## Estructura de carpetas

```text
src/
  components/
    sale-details/
      SaleDetailForm.tsx
      SaleDetailList.tsx
  layout/
    Navbar.tsx
    Sidebar.tsx
  pages/
    CategoriesPage.tsx
    DashboardPage.tsx
    ProductsPage.tsx
    SaleDetailsPage.tsx
    SalesPage.tsx
  services/
    api.ts
  types/
    models.ts
  App.tsx
  App.css
  index.css
  main.tsx
```

## Endpoints backend usados

- `GET /api/sales`
- `GET /api/products`
- `GET /api/categories`
- `GET /api/sale-details?saleId={id}`
- `GET /api/sale-details/{id}`
- `POST /api/sale-details`
- `PUT /api/sale-details/{id}`
- `DELETE /api/sale-details/{id}`

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Ejemplo de consumo con Axios (referencia)

> En este entorno no fue posible instalar paquetes externos por política del registry, por eso el proyecto usa `fetch` tipado en `src/services/api.ts`.
> Si en tu entorno puedes instalar Axios, este sería el equivalente:

```ts
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export async function getSaleDetails(saleId: number) {
  const { data } = await api.get('/sale-details', { params: { saleId } })
  return data
}
```
