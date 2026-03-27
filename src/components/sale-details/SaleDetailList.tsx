import type { SaleDetail } from '../../types/models'

interface SaleDetailListProps {
  details: SaleDetail[]
  loading: boolean
  deletingId: number | null
  onEdit: (detail: SaleDetail) => void
  onDelete: (id: number) => void
}

export function SaleDetailList({
  details,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: SaleDetailListProps) {
  if (loading) return <p>Cargando detalle de venta...</p>
  if (!details.length) return <p>Aún no hay productos en esta venta.</p>

  return (
    <div className="details-grid">
      {details.map(detail => (
        <article key={detail.saleDetailId} className="detail-row">
          <div>
            <strong>{detail.productName ?? `Producto #${detail.productId}`}</strong>
            <p>
              Cantidad: {detail.quantity} | Precio: ${detail.price.toFixed(2)}
            </p>
          </div>
          <div className="sale-row__actions">
            <button type="button" onClick={() => onEdit(detail)}>
              Editar
            </button>
            <button
              type="button"
              className="danger-btn"
              onClick={() => onDelete(detail.saleDetailId)}
              disabled={deletingId === detail.saleDetailId}
            >
              {deletingId === detail.saleDetailId ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
