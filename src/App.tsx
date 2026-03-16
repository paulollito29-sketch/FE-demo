import { useState } from 'react'
import './App.css'
import { Products } from './components/Products'
import { Categories } from './components/Categories'
import { Customers } from './components/Customers'
import { Sales } from './components/Sales'

function App() {
  const [currentPage, setCurrentPage] = useState('products')

  const menuItems = [
    { id: 'products', label: 'Productos', icon: '📦' },
    { id: 'categories', label: 'Categorías', icon: '🏷️' },
    { id: 'customers', label: 'Clientes', icon: '👥' },
    { id: 'sales', label: 'Ventas', icon: '💳' },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <Products />
      case 'categories':
        return <Categories />
      case 'customers':
        return <Customers />
      case 'sales':
        return <Sales />
      default:
        return <Products />
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Sistema de Gestión</h1>
          <p>Administra tus productos, clientes y ventas</p>
        </div>
      </header>

      <nav className="navbar">
        <div className="nav-container">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="main">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
