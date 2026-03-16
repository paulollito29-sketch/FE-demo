import { useState, useEffect } from 'react'
import { productApi, categoryApi } from '../services/api'

export function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', price: '', categoryId: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await productApi.getAll()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

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
      await productApi.create({
        name: form.name,
        price: parseFloat(form.price),
        categoryId: parseInt(form.categoryId),
      })
      setForm({ name: '', price: '', categoryId: '' })
      fetchProducts()
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.categoryId === categoryId)
    return category ? category.name : 'Sin categoría'
  }

  return (
    <div className="entity-container">
      <section className="form-section">
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Precio:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoryId">Categoría:</label>
            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Agregando...' : 'Agregar Producto'}
          </button>
        </form>
      </section>

      <section className="products-section">
        <h2>Lista de Productos ({products.length})</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.productId} className="product-card">
              <h3>{product.name}</h3>
              <p className="price">${product.price}</p>
              <p><strong>Categoría:</strong> {product.categoryName || getCategoryName(product.categoryId)}</p>
              <p className="id">ID: {product.productId}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
