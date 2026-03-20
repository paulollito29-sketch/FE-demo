export interface Product {
  productId: number
  name: string
  price: number
  categoryId: number
  categoryName?: string
}

export interface Category {
  categoryId: number
  name: string
  products?: Product[]
}

export interface Customer {
  customerId: number
  name: string
  dni: string
}

export interface Sale {
  saleId: number
  customerId?: number
  customerName?: string
  description?: string
  subTotal: number
  tax: number
  total: number
  saleDate?: string
}

export interface ProductFormState {
  name: string
  price: string
  categoryId: string
}

export interface CategoryFormState {
  name: string
}

export interface CustomerFormState {
  name: string
  dni: string
}

export interface SaleFormState {
  customerId: string
  description: string
  subTotal: string
  tax: string
}

export interface SaleBetweenDatesFormState {
  startDate: string
  endDate: string
}

export interface SalesFilteredDto {
  sales?: Sale[]
  total?: number
  subTotal?: number
  tax?: number
  count?: number
  [key: string]: unknown
}
