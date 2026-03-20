import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Categories } from './components/Categories'
import { Consults } from './components/Consults'
import { Customers } from './components/Customers'
import { Products } from './components/Products'
import { Sales } from './components/Sales'

type PageId = 'products' | 'categories' | 'customers' | 'sales' | 'consults'

interface MenuItem {
  id: PageId
  label: string
  icon: string
  helper: string
}

const menuItems: MenuItem[] = [
  { id: 'products', label: 'Productos', icon: '📦', helper: 'Inventario y precios' },
  { id: 'categories', label: 'Categorías', icon: '🏷️', helper: 'Organiza tu catálogo' },
  { id: 'customers', label: 'Clientes', icon: '👥', helper: 'Base de compradores' },
  { id: 'sales', label: 'Ventas', icon: '💳', helper: 'Movimientos y totales' },
  { id: 'consults', label: 'Consultas', icon: '📊', helper: 'Filtros por fecha' },
]

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('products')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const currentSection = useMemo(
    () => menuItems.find(item => item.id === currentPage) ?? menuItems[0],
    [currentPage],
  )

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page)
    setIsMenuOpen(false)
  }

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
      case 'consults':
        return <Consults />
      default:
        return <Products />
    }
  }

  return (
    <div className="app-shell">
      <header className="hero-banner">
        <div className="hero-banner__content">
          <div>
            <span className="eyebrow">Dashboard comercial</span>
            <h1>Sistema de Gestión</h1>
            <p>
              Administra productos, clientes, ventas y ahora también ejecuta consultas
              por rango de fechas desde una sola interfaz.
            </p>
          </div>

          <div className="hero-banner__badge">
            <span>Módulo activo</span>
            <strong>{currentSection.label}</strong>
            <small>{currentSection.helper}</small>
          </div>
        </div>
      </header>

      <div className="navbar-wrapper">
        <button
          type="button"
          className={`hamburger-btn ${isMenuOpen ? 'is-open' : ''}`}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setIsMenuOpen(current => !current)}
        >
          <span className="hamburger-btn__line" />
          <span className="hamburger-btn__line" />
          <span className="hamburger-btn__line" />
          <span>{isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
        </button>

        <nav id="main-navigation" className={`navbar ${isMenuOpen ? 'open' : ''}`}>
          <div className="nav-container">
            {menuItems.map(item => (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => handleNavigate(item.id)}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="nav-copy">
                  <span className="nav-label">{item.label}</span>
                  <small>{item.helper}</small>
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {isMenuOpen ? <button type="button" className="nav-backdrop" onClick={() => setIsMenuOpen(false)} aria-label="Cerrar menú" /> : null}

      <main className="main-content">{renderPage()}</main>
    </div>
  )
}

export default App
