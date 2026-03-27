import { useEffect, useState } from 'react'
import { getErrorMessage, productApi } from '../services/api'
import type { Product } from '../types/models'

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await productApi.getAll()
        setProducts(data)
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudieron cargar los productos.'))
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  return (
    <section className="page-card">
      <h2>Productos</h2>
      {loading ? <p>Cargando productos...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      {!loading && !products.length ? <p>No hay productos disponibles.</p> : null}
      <ul className="simple-list">
        {products.map(product => (
          <li key={product.productId}>
            <strong>{product.name}</strong> - ${product.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </section>
  )
}
