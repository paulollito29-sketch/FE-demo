import type { Category, Customer, Product, Sale, SalesFilteredDto } from '../types/models'

const API_BASE = '/api'

type JsonBody = Record<string, unknown>

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (!contentType.includes('application/json')) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const productApi = {
  getAll: () => request<Product[]>('/products'),
  create: (data: Omit<Product, 'productId' | 'categoryName'>) =>
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data satisfies JsonBody),
    }),
  update: (productId: number, data: Omit<Product, 'productId' | 'categoryName'>) =>
    request<Product>(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data satisfies JsonBody),
    }),
  delete: (productId: number) =>
    request<void>(`/products/${productId}`, {
      method: 'DELETE',
    }),
}

export const categoryApi = {
  getAll: () => request<Category[]>('/categories'),
  create: (data: Pick<Category, 'name'>) =>
    request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data satisfies JsonBody),
    }),
  update: (categoryId: number, data: Pick<Category, 'name'>) =>
    request<Category>(`/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(data satisfies JsonBody),
    }),
  delete: (categoryId: number) =>
    request<void>(`/categories/${categoryId}`, {
      method: 'DELETE',
    }),
}

export const customerApi = {
  getAll: () => request<Customer[]>('/customers'),
  create: (data: Omit<Customer, 'customerId'>) =>
    request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data satisfies JsonBody),
    }),
  update: (customerId: number, data: Omit<Customer, 'customerId'>) =>
    request<Customer>(`/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(data satisfies JsonBody),
    }),
  delete: (customerId: number) =>
    request<void>(`/customers/${customerId}`, {
      method: 'DELETE',
    }),
}

export const saleApi = {
  getAll: () => request<Sale[]>('/sales'),
  create: (data: Omit<Sale, 'saleId' | 'customerName' | 'saleDate'>) =>
    request<Sale>('/sales', {
      method: 'POST',
      body: JSON.stringify(data satisfies JsonBody),
    }),
  update: (saleId: number, data: Omit<Sale, 'saleId' | 'customerName' | 'saleDate'>) =>
    request<Sale>(`/sales/${saleId}`, {
      method: 'PUT',
      body: JSON.stringify(data satisfies JsonBody),
    }),
  delete: (saleId: number) =>
    request<void>(`/sales/${saleId}`, {
      method: 'DELETE',
    }),
}

export const consultApi = {
  getSalesBetweenDates: (startDate: string, endDate: string) => {
    const params = new URLSearchParams({ startDate, endDate })
    return request<SalesFilteredDto>(`/consult/sales-between-dates?${params.toString()}`)
  },
}
