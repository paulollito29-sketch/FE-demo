import { useState, useEffect } from 'react'
import { saleApi, customerApi } from '../services/api'

export function Sales() {
  const [sales, setSales] = useState([])
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ customerId: '', description: '', subTotal: '', tax: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSales()
    fetchCustomers()
  }, [])

  const fetchSales = async () => {
    try {
      const data = await saleApi.getAll()
      setSales(data)
    } catch (err) {
      console.error('Error fetching sales:', err)
    }
  }

  const fetchCustomers = async () => {
    try {
      const data = await customerApi.getAll()
      setCustomers(data)
    } catch (err) {
      console.error('Error fetching customers:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const subTotal = parseFloat(form.subTotal)
      const tax = parseFloat(form.tax)
      await saleApi.create({
        customerId: parseInt(form.customerId),
        description: form.description,
        subTotal,
        tax,
        total: subTotal + tax,
      })
      setForm({ customerId: '', description: '', subTotal: '', tax: '' })
      fetchSales()
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.customerId === customerId)
    return customer ? customer.name : 'Sin cliente'
  }

  return (
    <div className="entity-container">
      <section className="form-section">
        <h2>Registrar Venta</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="customerId">Cliente:</label>
            <select
              id="customerId"
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un cliente</option>
              {customers.map(customer => (
                <option key={customer.customerId} value={customer.customerId}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="subTotal">Subtotal:</label>
            <input
              type="number"
              id="subTotal"
              name="subTotal"
              value={form.subTotal}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tax">Impuesto:</label>
            <input
              type="number"
              id="tax"
              name="tax"
              value={form.tax}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Registrando...' : 'Registrar Venta'}
          </button>
        </form>
      </section>

      <section className="products-section">
        <h2>Lista de Ventas ({sales.length})</h2>
        <div className="products-grid">
          {sales.map(sale => (
            <div key={sale.saleId} className="product-card">
              <h3>{sale.customerName}</h3>
              <p><strong>Total:</strong> ${sale.total}</p>
              <p>Subtotal: ${sale.subTotal} | Impuesto: ${sale.tax}</p>
              <p className="description">{sale.description}</p>
              <p className="id">ID: {sale.saleId}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
