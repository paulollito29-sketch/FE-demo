import { useEffect, useMemo, useState } from 'react'
import { categoryApi, productApi } from '../services/api'
import type { Category, Product, ProductFormState } from '../types/models'

const initialForm: ProductFormState = { name: '', price: '', categoryId: '' }

export function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<ProductFormState>(initialForm)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void Promise.all([fetchProducts(), fetchCategories()])
  }, [])

  const fetchProducts = async () => {
    try {
      setError(null)
      const data = await productApi.getAll()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('No se pudieron cargar los productos.')
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('No se pudieron cargar las categorías para el formulario.')
    }
  }

  const categoryLookup = useMemo(
    () => new Map(categories.map(category => [category.categoryId, category.name])),
    [categories],
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
      const payload = {
        name: form.name.trim(),
        price: Number.parseFloat(form.price),
        categoryId: Number.parseInt(form.categoryId, 10),
      }

      if (editingId === null) {
        await productApi.create(payload)
      } else {
        await productApi.update(editingId, payload)
      }

      resetForm()
      await fetchProducts()
    } catch (err) {
      console.error('Error saving product:', err)
      setError(editingId === null ? 'No se pudo guardar el producto.' : 'No se pudo actualizar el producto.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      price: product.price.toString(),
      categoryId: product.categoryId.toString(),
    })
    setError(null)
  }

  const handleDelete = async (productId: number) => {
    setDeletingId(productId)
    setError(null)

    try {
      await productApi.delete(productId)

      if (editingId === productId) {
        resetForm()
      }

      await fetchProducts()
    } catch (err) {
      console.error('Error deleting product:', err)
      setError('No se pudo eliminar el producto.')
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

  const getCategoryName = (categoryId: number) => categoryLookup.get(categoryId) ?? 'Sin categoría'

  return (
    <div className="entity-container">
      <section className="form-section panel-card">
        <div className="section-heading">
          <span className="section-chip">Inventario</span>
          <h2>{editingId === null ? 'Agregar producto' : 'Editar producto'}</h2>
          <p>Registra artículos y asígnalos a una categoría existente.</p>
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
              placeholder="Ej. Mouse inalámbrico"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Categoría</label>
            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {error ? <p className="feedback error">{error}</p> : null}

          <div className="action-row">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Guardando...' : editingId === null ? 'Guardar producto' : 'Actualizar producto'}
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
            <h2>Productos registrados</h2>
          </div>
          <strong className="stat-badge">{products.length}</strong>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <article key={product.id} className="product-card product-card--accent">
              <div className="product-card__header">
                <h3>{product.name}</h3>
                <span className="pill">#{product.id}</span>
              </div>
              <p className="price">${product.price.toFixed(2)}</p>
              <p>
                <strong>Categoría:</strong> {product.categoryName ?? getCategoryName(product.categoryId)}
              </p>
              <div className="card-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => handleEdit(product)}
                  disabled={loading || deletingId === product.id}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => void handleDelete(product.id)}
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
