import { useEffect, useState } from 'react'
import { categoryApi } from '../services/api'
import type { Category, CategoryFormState } from '../types/models'

const initialForm: CategoryFormState = { name: '' }

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<CategoryFormState>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setError(null)
      const data = await categoryApi.getAll()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('No se pudieron cargar las categorías.')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await categoryApi.create({ name: form.name.trim() })
      setForm(initialForm)
      await fetchCategories()
    } catch (err) {
      console.error('Error creating category:', err)
      setError('No se pudo guardar la categoría.')
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
          <span className="section-chip">Catálogo</span>
          <h2>Agregar categoría</h2>
          <p>Crea agrupadores para organizar mejor los productos.</p>
        </div>

        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-group">
            <label htmlFor="name">Nombre de la categoría</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Accesorios"
              required
            />
          </div>

          {error ? <p className="feedback error">{error}</p> : null}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Guardando...' : 'Guardar categoría'}
          </button>
        </form>
      </section>

      <section className="products-section panel-card">
        <div className="section-heading section-heading-inline">
          <div>
            <span className="section-chip">Listado</span>
            <h2>Categorías disponibles</h2>
          </div>
          <strong className="stat-badge">{categories.length}</strong>
        </div>

        <div className="products-grid">
          {categories.map(category => (
            <article key={category.categoryId} className="product-card">
              <div className="product-card__header">
                <h3>{category.name}</h3>
                <span className="pill">#{category.categoryId}</span>
              </div>
              <p>
                <strong>Productos asociados:</strong> {category.products?.length ?? 0}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
