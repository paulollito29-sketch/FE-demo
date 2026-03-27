import { useEffect, useState } from 'react'
import { categoryApi, getErrorMessage } from '../services/api'
import type { Category } from '../types/models'

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await categoryApi.getAll()
        setCategories(data)
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudieron cargar las categorías.'))
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  return (
    <section className="page-card">
      <h2>Categorías</h2>
      {loading ? <p>Cargando categorías...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      {!loading && !categories.length ? <p>No hay categorías disponibles.</p> : null}
      <ul className="simple-list">
        {categories.map(category => (
          <li key={category.categoryId}>{category.name}</li>
        ))}
      </ul>
    </section>
  )
}
