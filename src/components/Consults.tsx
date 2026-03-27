import { useMemo, useState } from 'react'
import { consultApi } from '../services/api'
import type { Sale, SaleBetweenDatesFormState, SalesFilteredDto } from '../types/models'

const initialForm: SaleBetweenDatesFormState = {
  startDate: '',
  endDate: '',
}

function isPrimitive(value: unknown): value is string | number | boolean {
  return ['string', 'number', 'boolean'].includes(typeof value)
}

function formatLabel(label: string) {
  return label
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^./, char => char.toUpperCase())
}

export function Consults() {
  const [form, setForm] = useState<SaleBetweenDatesFormState>(initialForm)
  const [result, setResult] = useState<SalesFilteredDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(current => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.startDate || !form.endDate) {
      setError('Debes seleccionar ambas fechas.')
      return
    }

    if (form.startDate > form.endDate) {
      setError('La fecha inicial no puede ser mayor que la final.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await consultApi.getSalesBetweenDates(form.startDate, form.endDate)
      setResult(data)
    } catch (err) {
      console.error('Error fetching filtered sales:', err)
      setError('No se pudo obtener la consulta de ventas por fechas.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const summaryEntries = useMemo(() => {
    if (!result) {
      return []
    }

    return Object.entries(result).filter(([, value]) => isPrimitive(value))
  }, [result])

  const sales = useMemo(() => {
    const value = result?.sales
    return Array.isArray(value) ? (value as Sale[]) : []
  }, [result])

  return (
    <div className="entity-container entity-container--single">
      <section className="panel-card form-section form-section--full-width">
        <div className="section-heading">
          <span className="section-chip">Consultas</span>
          <h2>Ventas entre fechas</h2>
          <p>
            Consume el endpoint <code>/api/consult/sales-between-dates</code> enviando
            <strong> startDate </strong>y<strong> endDate</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Fecha inicial</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">Fecha final</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error ? <p className="feedback error">{error}</p> : null}

          <div className="action-row">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Consultando...' : 'Consultar ventas'}
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setForm(initialForm)
                setResult(null)
                setError(null)
              }}
            >
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <section className="panel-card products-section consult-result">
        <div className="section-heading section-heading-inline">
          <div>
            <span className="section-chip">Resultado</span>
            <h2>Resumen de la consulta</h2>
          </div>
          <strong className="stat-badge">{sales.length || summaryEntries.length || 0}</strong>
        </div>

        {result ? (
          <>
            {summaryEntries.length ? (
              <div className="stats-grid">
                {summaryEntries.map(([key, value]) => (
                  <article key={key} className="stat-card">
                    <span>{formatLabel(key)}</span>
                    <strong>{String(value)}</strong>
                  </article>
                ))}
              </div>
            ) : null}

            {sales.length ? (
              <div className="products-grid">
                {sales.map(sale => (
                  <article key={sale.saleId} className="product-card product-card--success">
                    <div className="product-card__header">
                      <h3>{sale.customerName ?? 'Venta'}</h3>
                      <span className="pill">#{sale.saleId}</span>
                    </div>
                    <p className="price">${sale.total}</p>
                    <p>
                      <strong>Subtotal:</strong> ${sale.subTotal}
                    </p>
                    <p>
                      <strong>Impuesto:</strong> ${sale.tax}
                    </p>
                    {sale.saleDate ? <p className="muted-text">Fecha: {sale.saleDate}</p> : null}
                    {sale.description ? <p className="description">{sale.description}</p> : null}
                  </article>
                ))}
              </div>
            ) : null}

            <details className="json-viewer">
              <summary>Ver respuesta completa del backend</summary>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </details>
          </>
        ) : (
          <div className="empty-state">
            <h3>Sin resultados aún</h3>
            <p>Selecciona un rango de fechas y ejecuta la consulta para visualizar el DTO.</p>
          </div>
        )}
      </section>
    </div>
  )
}
