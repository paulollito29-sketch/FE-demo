import { useEffect, useState } from 'react'
import { customerApi } from '../services/api'
import type { Customer, CustomerFormState } from '../types/models'

const initialForm: CustomerFormState = { name: '', dni: '' }

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [form, setForm] = useState<CustomerFormState>(initialForm)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
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

  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = { name: form.name.trim(), dni: form.dni.trim() }

      if (editingId === null) {
        await customerApi.create(payload)
      } else {
        await customerApi.update(editingId, payload)
      }

      resetForm()
      await fetchCustomers()
    } catch (err) {
      console.error('Error saving customer:', err)
      setError(editingId === null ? 'No se pudo guardar el cliente.' : 'No se pudo actualizar el cliente.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.customerId)
    setForm({ name: customer.name, dni: customer.dni })
    setError(null)
  }

  const handleDelete = async (customerId: number) => {
    setDeletingId(customerId)
    setError(null)

    try {
      await customerApi.delete(customerId)

      if (editingId === customerId) {
        resetForm()
      }

      await fetchCustomers()
    } catch (err) {
      console.error('Error deleting customer:', err)
      setError('No se pudo eliminar el cliente.')
    } finally {
      setDeletingId(null)
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
          <h2>{editingId === null ? 'Agregar cliente' : 'Editar cliente'}</h2>
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

          <div className="action-row">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Guardando...' : editingId === null ? 'Guardar cliente' : 'Actualizar cliente'}
            </button>

            {editingId !== null ? (
              <button type="button" className="secondary-btn" onClick={resetForm} disabled={loading}>
                Cancelar edición
              </button>
            ) : null}
          </div>
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
              <div className="card-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => handleEdit(customer)}
                  disabled={loading || deletingId === customer.customerId}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => void handleDelete(customer.customerId)}
                  disabled={deletingId === customer.customerId}
                >
                  {deletingId === customer.customerId ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
