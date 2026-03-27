import { useEffect, useState } from 'react'
import { getErrorMessage, saleApi } from '../services/api'
import type { Sale } from '../types/models'

interface SalesPageProps {
  selectedSaleId: number | null
  onSelectSale: (sale: Sale) => void
  onGoToDetails: () => void
  onSalesCountChange: (count: number) => void
}

export function SalesPage({
  selectedSaleId,
  onSelectSale,
  onGoToDetails,
  onSalesCountChange,
}: SalesPageProps) {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSales = async () => {
      try {
        setLoading(true)
        const data = await saleApi.getAll()
        setSales(data)
        onSalesCountChange(data.length)
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudo cargar la lista de ventas.'))
      } finally {
        setLoading(false)
      }
    }

    void loadSales()
  }, [onSalesCountChange])

  return (
    <section className="page-card">
      <h2>Ventas</h2>
      <p>Selecciona una venta para continuar hacia Detalle de Venta.</p>

      {loading ? <p>Cargando ventas...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      <div className="sales-list">
        {sales.map(sale => {
          const isSelected = selectedSaleId === sale.saleId

          return (
            <article key={sale.saleId} className={`sale-row ${isSelected ? 'selected' : ''}`}>
              <div>
                <strong>Venta #{sale.saleId}</strong>
                <p>{sale.customerName ?? 'Cliente no especificado'}</p>
              </div>
              <div className="sale-row__actions">
                <span>${sale.total.toFixed(2)}</span>
                <button type="button" onClick={() => onSelectSale(sale)}>
                  {isSelected ? 'Seleccionada' : 'Seleccionar'}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      <button
        type="button"
        className="primary-btn"
        disabled={selectedSaleId === null}
        onClick={onGoToDetails}
      >
        Ir a Detalle de Venta
      </button>
    </section>
  )
}
