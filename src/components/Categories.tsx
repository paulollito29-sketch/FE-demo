import { useState, useEffect } from 'react'
import { categoryApi } from '../services/api'

export function Categories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await categoryApi.create({ name: form.name })
      setForm({ name: '' })
      fetchCategories()
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="entity-container">
      <section className="form-section">
        <h2>Agregar Categoría</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Nombre de Categoría:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Agregando...' : 'Agregar Categoría'}
          </button>
        </form>
      </section>

      <section className="products-section">
        <h2>Lista de Categorías ({categories.length})</h2>
        <div className="products-grid">
          {categories.map(category => (
            <div key={category.categoryId} className="product-card">
              <h3>{category.name}</h3>
              <p><strong>Productos:</strong> {category.products?.length || 0}</p>
              <p className="id">ID: {category.categoryId}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
