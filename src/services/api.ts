import type {
  Category,
  CreateSaleDetailDto,
  Product,
  Sale,
  SaleDetail,
  UpdateSaleDetailDto,
} from '../types/models'

const API_BASE = '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const payload = (await response.json()) as { message?: string }
      if (payload?.message) {
        message = payload.message
      }
    } catch {
      // Keep fallback status message if no JSON body exists.
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const saleApi = {
  getAll: () => request<Sale[]>('/sales'),
}

export const productApi = {
  getAll: () => request<Product[]>('/products'),
}

export const categoryApi = {
  getAll: () => request<Category[]>('/categories'),
}

export const saleDetailApi = {
  getBySaleId: (saleId: number) => request<SaleDetail[]>(`/sale-details?saleId=${saleId}`),
  getById: (id: number) => request<SaleDetail>(`/sale-details/${id}`),
  create: (payload: CreateSaleDetailDto) =>
    request<SaleDetail>('/sale-details', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: UpdateSaleDetailDto) =>
    request<SaleDetail>(`/sale-details/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  delete: (id: number) =>
    request<void>(`/sale-details/${id}`, {
      method: 'DELETE',
    }),
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
