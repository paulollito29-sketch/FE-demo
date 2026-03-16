import { useState, useEffect } from 'react'
import { customerApi } from '../services/api'

export function Customers() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ name: '', dni: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

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
      await customerApi.create({ name: form.name, dni: form.dni })
      setForm({ name: '', dni: '' })
      fetchCustomers()
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="entity-container">
      <section className="form-section">
        <h2>Agregar Cliente</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dni">DNI/Cédula:</label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={form.dni}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Agregando...' : 'Agregar Cliente'}
          </button>
        </form>
      </section>

      <section className="products-section">
        <h2>Lista de Clientes ({customers.length})</h2>
        <div className="products-grid">
          {customers.map(customer => (
            <div key={customer.customerId} className="product-card">
              <h3>{customer.name}</h3>
              <p><strong>DNI/Cédula:</strong> {customer.dni}</p>
              <p className="id">ID: {customer.customerId}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
