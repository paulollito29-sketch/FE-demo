import { useEffect, useState } from 'react'
import { customerApi } from '../services/api'
import type { Customer, CustomerFormState } from '../types/models'

const initialForm: CustomerFormState = { name: '', dni: '' }

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [form, setForm] = useState<CustomerFormState>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setError(null)
      const data = await customerApi.getAll()
      setCustomers(data)
    } catch (err) {
      console.error('Error fetching customers:', err)
      setError('No se pudieron cargar los clientes.')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await customerApi.create({ name: form.name.trim(), dni: form.dni.trim() })
      setForm(initialForm)
      await fetchCustomers()
    } catch (err) {
      console.error('Error creating customer:', err)
      setError('No se pudo guardar el cliente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(current => ({ ...current, [name]: value }))
  }

  return (
    <div className="entity-container">
      <section className="form-section panel-card">
        <div className="section-heading">
          <span className="section-chip">Clientes</span>
          <h2>Agregar cliente</h2>
          <p>Registra compradores para asociarlos a futuras ventas.</p>
        </div>

        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Ana Pérez"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dni">DNI / Cédula</label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={form.dni}
              onChange={handleChange}
              placeholder="Ej. 10203040"
              required
            />
          </div>

          {error ? <p className="feedback error">{error}</p> : null}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Guardando...' : 'Guardar cliente'}
          </button>
        </form>
      </section>

      <section className="products-section panel-card">
        <div className="section-heading section-heading-inline">
          <div>
            <span className="section-chip">Listado</span>
            <h2>Clientes registrados</h2>
          </div>
          <strong className="stat-badge">{customers.length}</strong>
        </div>

        <div className="products-grid">
          {customers.map(customer => (
            <article key={customer.customerId} className="product-card">
              <div className="product-card__header">
                <h3>{customer.name}</h3>
                <span className="pill">#{customer.customerId}</span>
              </div>
              <p>
                <strong>DNI / Cédula:</strong> {customer.dni}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
