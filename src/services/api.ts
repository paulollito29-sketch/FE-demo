const API_BASE = '/api';

// Products
export const productApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/products`);
    return res.json();
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

// Categories
export const categoryApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

// Customers
export const customerApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/customers`);
    return res.json();
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

// Sales
export const saleApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/sales`);
    return res.json();
  },
  create: async (data: any) => {
    const res = await fetch(`${API_BASE}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
