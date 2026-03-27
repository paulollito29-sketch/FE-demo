import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { SaleDetailForm, type SaleDetailFormState } from '../components/sale-details/SaleDetailForm'
import { SaleDetailList } from '../components/sale-details/SaleDetailList'
import { getErrorMessage, productApi, saleDetailApi } from '../services/api'
import type { Product, SaleDetail } from '../types/models'

interface SaleDetailsPageProps {
  saleId: number | null
  onBackToSales: () => void
  onDetailsCountChange: (count: number) => void
}

const initialForm: SaleDetailFormState = {
  productId: '',
  quantity: '1',
  price: '',
}

export function SaleDetailsPage({ saleId, onBackToSales, onDetailsCountChange }: SaleDetailsPageProps) {
  const [details, setDetails] = useState<SaleDetail[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<SaleDetailFormState>(initialForm)
  const [error, setError] = useState<string | null>(null)

  const productMap = useMemo(
    () => new Map(products.map(product => [product.productId, product])),
    [products],
  )

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productApi.getAll()
        setProducts(data)
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudieron cargar los productos.'))
      }
    }

    void loadProducts()
  }, [])

  const loadDetails = async () => {
    if (!saleId) {
      setDetails([])
      onDetailsCountChange(0)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await saleDetailApi.getBySaleId(saleId)
      setDetails(data)
      onDetailsCountChange(data.length)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo cargar el detalle de venta.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saleId])

  const resetForm = () => {
    setEditingId(null)
    setForm(initialForm)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!saleId) {
      setError('Debes seleccionar una venta primero.')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const productId = Number(form.productId)
      const quantity = Number(form.quantity)
      const selectedProductPrice = productMap.get(productId)?.price

      const payload = {
        saleId,
        productId,
        quantity,
        price: form.price ? Number(form.price) : selectedProductPrice,
      }

      if (editingId) {
        await saleDetailApi.update(editingId, {
          productId: payload.productId,
          quantity: payload.quantity,
          price: payload.price,
        })
      } else {
        await saleDetailApi.create(payload)
      }

      resetForm()
      await loadDetails()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar el detalle.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id)
      setError(null)
      await saleDetailApi.delete(id)
      if (editingId === id) resetForm()
      await loadDetails()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar el detalle.'))
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (detail: SaleDetail) => {
    setEditingId(detail.saleDetailId)
    setForm({
      productId: String(detail.productId),
      quantity: String(detail.quantity),
      price: String(detail.price ?? ''),
    })
  }

  return (
    <section className="page-card">
      <div className="sale-details__header">
        <div>
          <h2>Detalle de Venta</h2>
          <p>
            Endpoint principal: <code>GET /api/sale-details?saleId={`{id}`}</code>
          </p>
        </div>
        <button type="button" onClick={onBackToSales}>
          Volver a Ventas
        </button>
      </div>

      {!saleId ? (
        <p>Primero selecciona una venta desde la sección Ventas.</p>
      ) : (
        <>
          <p className="current-sale-chip">Trabajando sobre venta #{saleId}</p>
          {error ? <p className="error-text">{error}</p> : null}

          <div className="sale-details-layout">
            <SaleDetailForm
              form={form}
              products={products}
              submitting={submitting}
              editingId={editingId}
              onChange={setForm}
              onSubmit={handleSubmit}
              onCancelEdit={resetForm}
            />

            <SaleDetailList
              details={details}
              loading={loading}
              deletingId={deletingId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </>
      )}
    </section>
  )
}
