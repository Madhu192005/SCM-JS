const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001/api'
  : 'https://supply-chain-api.onrender.com/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

const api = {
  // Auth
  login: (email, password) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json()),

  getMe: () =>
    fetch(`${BASE_URL}/auth/me`, { headers: headers() }).then(r => r.json()),

  getUsers: () =>
    fetch(`${BASE_URL}/auth/users`, { headers: headers() }).then(r => r.json()),

  registerUser: (data) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // Inventory
  getProducts: () =>
    fetch(`${BASE_URL}/inventory`, { headers: headers() }).then(r => r.json()),

  addProduct: (data) =>
    fetch(`${BASE_URL}/inventory`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  updateStock: (id, data) =>
    fetch(`${BASE_URL}/inventory/${id}/stock`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  getLowStock: () =>
    fetch(`${BASE_URL}/inventory/low-stock`, { headers: headers() }).then(r => r.json()),

  getStockLog: () =>
    fetch(`${BASE_URL}/inventory/stock-log`, { headers: headers() }).then(r => r.json()),

  // Suppliers
  getSuppliers: () =>
    fetch(`${BASE_URL}/suppliers`, { headers: headers() }).then(r => r.json()),

  addSupplier: (data) =>
    fetch(`${BASE_URL}/suppliers`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // Analytics
  getAnalytics: () =>
    fetch(`${BASE_URL}/analytics`, { headers: headers() }).then(r => r.json()),
};
