import type { AppSection } from '../App'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentSection: AppSection
  onNavigate: (section: AppSection) => void
}

const links: Array<{ id: AppSection; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'sales', label: 'Ventas' },
  { id: 'sale-details', label: 'Detalle de Venta' },
  { id: 'products', label: 'Productos' },
  { id: 'categories', label: 'Categorías' },
]

export function Sidebar({ isOpen, onClose, currentSection, onNavigate }: SidebarProps) {
  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar__brand">
          <h2>Sales Admin</h2>
          <p>Gestión comercial</p>
        </div>

        <nav className="sidebar__nav" aria-label="Navegación principal">
          {links.map(link => (
            <button
              key={link.id}
              type="button"
              className={`sidebar__link ${currentSection === link.id ? 'active' : ''}`}
              onClick={() => {
                onNavigate(link.id)
                onClose()
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      {isOpen ? (
        <button
          type="button"
          className="sidebar__backdrop"
          aria-label="Cerrar menú"
          onClick={onClose}
        />
      ) : null}
    </>
  )
}
