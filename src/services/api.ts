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

  return response.json() as Promise<T>
}

export const productApi = {
  getAll: () => request<Product[]>('/products'),
  create: (data: Omit<Product, 'productId' | 'categoryName'>) =>
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data satisfies JsonBody),
    }),
}

export const categoryApi = {
  getAll: () => request<Category[]>('/categories'),
  create: (data: Pick<Category, 'name'>) =>
    request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data satisfies JsonBody),
    }),
    delete: async (categoryId: number) => {
      const response = await fetch(`${API_BASE}/categories/${categoryId}`, {
        method: 'DELETE',
      })
            
      if (response.status == 204) {
        return true;
      }      
      return await response.json();
    }
}

export const customerApi = {
  getAll: () => request<Customer[]>('/customers'),
  create: (data: Omit<Customer, 'customerId'>) =>
    request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data satisfies JsonBody),
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
    
  delete: async (saleId: number) => {
      const response = await fetch(`${API_BASE}/sales/${saleId}`, {
        method: 'DELETE',
      })
            
      if (response.status == 204) {
        return true;
      }      
      return await response.json();
    }
  
}

export const consultApi = {
  getSalesBetweenDates: (startDate: string, endDate: string) => {
    const params = new URLSearchParams({ startDate, endDate })
    return request<SalesFilteredDto>(`/consult/sales-between-dates?${params.toString()}`)
  },
}
