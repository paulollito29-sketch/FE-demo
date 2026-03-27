import { useEffect, useMemo, useState } from 'react'
import { customerApi, saleApi } from '../services/api'
import type { Customer, Sale, SaleFormState } from '../types/models'

const initialForm: SaleFormState = {
  customerId: '',
  description: '',
  subTotal: '',
  tax: '',
}

export function Sales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [form, setForm] = useState<SaleFormState>(initialForm)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void Promise.all([fetchSales(), fetchCustomers()])
  }, [])

  const fetchSales = async () => {
    try {
      setError(null)
      const data = await saleApi.getAll()
      setSales(data)
    } catch (err) {
      console.error('Error fetching sales:', err)
      setError('No se pudieron cargar las ventas.')
    }
  }

  const fetchCustomers = async () => {
    try {
      const data = await customerApi.getAll()
      setCustomers(data)
    } catch (err) {
      console.error('Error fetching customers:', err)
      setError('No se pudieron cargar los clientes para registrar ventas.')
    }
  }

  const customerLookup = useMemo(
    () => new Map(customers.map(customer => [customer.customerId, customer.name])),
    [customers],
  )

  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const subTotal = Number.parseFloat(form.subTotal)
      const tax = Number.parseFloat(form.tax)
      const payload = {
        customerId: Number.parseInt(form.customerId, 10),
        description: form.description.trim(),
        subTotal,
        tax,
        total: subTotal + tax,
      }

      if (editingId === null) {
        await saleApi.create(payload)
      } else {
        await saleApi.update(editingId, payload)
      }

      resetForm()
      await fetchSales()
    } catch (err) {
      console.error('Error saving sale:', err)
      setError(editingId === null ? 'No se pudo registrar la venta.' : 'No se pudo actualizar la venta.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (sale: Sale) => {
    setEditingId(sale.saleId)
    setForm({
      customerId: sale.customerId?.toString() ?? '',
      description: sale.description ?? '',
      subTotal: sale.subTotal.toString(),
      tax: sale.tax.toString(),
    })
    setError(null)
  }

  const handleDelete = async (saleId: number) => {
    setDeletingId(saleId)
    setError(null)

    try {
      await saleApi.delete(saleId)

      if (editingId === saleId) {
        resetForm()
      }

      await fetchSales()
    } catch (err) {
      console.error('Error deleting sale:', err)
      setError('No se pudo eliminar la venta.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm(current => ({ ...current, [name]: value }))
  }

  const getCustomerName = (sale: Sale) => {
    if (sale.customerName) {
      return sale.customerName
    }

    if (sale.customerId) {
      return customerLookup.get(sale.customerId) ?? 'Sin cliente'
    }

    return 'Sin cliente'
  }

  return (
    <div className="entity-container">
      <section className="form-section panel-card">
        <div className="section-heading">
          <span className="section-chip">Ventas</span>
          <h2>{editingId === null ? 'Registrar venta' : 'Editar venta'}</h2>
          <p>Asocia una venta a un cliente y calcula el total automáticamente.</p>
        </div>

        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-group">
            <label htmlFor="customerId">Cliente</label>
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
            <label htmlFor="description">Descripción</label>
            <input
              type="text"
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ej. Combo de oficina"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subTotal">Subtotal</label>
              <input
                type="number"
                id="subTotal"
                name="subTotal"
                value={form.subTotal}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="tax">Impuesto</label>
              <input
                type="number"
                id="tax"
                name="tax"
                value={form.tax}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                readOnly
              />
            </div>
          </div>

          <div className="summary-box">
            <span>Total estimado</span>
            <strong>
              ${(
                (Number.parseFloat(form.subTotal) || 0) +
                (Number.parseFloat(form.tax) || 0)
              ).toFixed(2)}
            </strong>
          </div>

          {error ? <p className="feedback error">{error}</p> : null}

          <div className="action-row">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Guardando...' : editingId === null ? 'Registrar venta' : 'Actualizar venta'}
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
            <span className="section-chip">Historial</span>
            <h2>Ventas registradas</h2>
          </div>
          <strong className="stat-badge">{sales.length}</strong>
        </div>

        <div className="products-grid">
          {sales.map(sale => (
            <article key={sale.saleId} className="product-card product-card--success">
              <div className="product-card__header">
                <h3>{getCustomerName(sale)}</h3>
                <span className="pill">#{sale.saleId}</span>
              </div>
              <p className="price">${sale.total.toFixed(2)}</p>
              <p>
                <strong>Subtotal:</strong> ${sale.subTotal.toFixed(2)}
              </p>
              <p>
                <strong>Impuesto:</strong> ${sale.tax.toFixed(2)}
              </p>
              {sale.description ? <p className="description">{sale.description}</p> : null}
              {sale.saleDate ? <p className="muted-text">Fecha: {sale.saleDate}</p> : null}
              <div className="card-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => handleEdit(sale)}
                  disabled={loading || deletingId === sale.saleId}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => void handleDelete(sale.saleId)}
                  disabled={deletingId === sale.saleId}
                >
                  {deletingId === sale.saleId ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
