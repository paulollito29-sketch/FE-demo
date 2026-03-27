import { type FormEvent, useMemo } from 'react'
import type { Product } from '../../types/models'

export interface SaleDetailFormState {
  productId: string
  quantity: string
  price: string
}

interface SaleDetailFormProps {
  form: SaleDetailFormState
  products: Product[]
  submitting: boolean
  editingId: number | null
  onChange: (next: SaleDetailFormState) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancelEdit: () => void
}

export function SaleDetailForm({
  form,
  products,
  submitting,
  editingId,
  onChange,
  onSubmit,
  onCancelEdit,
}: SaleDetailFormProps) {
  const selectedProductPrice = useMemo(() => {
    const selected = products.find(product => product.productId === Number(form.productId))
    return selected?.price
  }, [products, form.productId])

  return (
    <form className="detail-form" onSubmit={onSubmit}>
      <h3>{editingId ? 'Editar detalle' : 'Agregar producto'}</h3>

      <label htmlFor="productId">Producto</label>
      <select
        id="productId"
        value={form.productId}
        onChange={event => onChange({ ...form, productId: event.target.value })}
        required
      >
        <option value="">Selecciona un producto</option>
        {products.map(product => (
          <option key={product.productId} value={product.productId}>
            {product.name} (${product.price.toFixed(2)})
          </option>
        ))}
      </select>

      <label htmlFor="quantity">Cantidad</label>
      <input
        id="quantity"
        type="number"
        min={1}
        value={form.quantity}
        onChange={event => onChange({ ...form, quantity: event.target.value })}
        required
      />

      <label htmlFor="price">Precio (opcional)</label>
      <input
        id="price"
        type="number"
        min={0}
        step="0.01"
        value={form.price}
        placeholder={selectedProductPrice ? selectedProductPrice.toFixed(2) : 'Auto'}
        onChange={event => onChange({ ...form, price: event.target.value })}
      />

      <div className="action-row">
        <button type="submit" className="primary-btn" disabled={submitting}>
          {submitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Agregar'}
        </button>
        {editingId ? (
          <button type="button" onClick={onCancelEdit}>
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  )
}
