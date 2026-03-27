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

export interface SaleDetail {
  saleDetailId: number
  saleId: number
  productId: number
  productName?: string
  quantity: number
  price: number
  lineTotal?: number
}

export interface CreateSaleDetailDto {
  saleId: number
  productId: number
  quantity: number
  price?: number
}

export interface UpdateSaleDetailDto {
  productId: number
  quantity: number
  price?: number
}
