import type { Sale } from '../types/models'

interface NavbarProps {
  onToggleMenu: () => void
  selectedSale?: Sale | null
}

export function Navbar({ onToggleMenu, selectedSale }: NavbarProps) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button type="button" className="hamburger" onClick={onToggleMenu} aria-label="Abrir menú">
          ☰
        </button>
        <div>
          <h1>Sistema de Ventas</h1>
          <p>Flujo sugerido: Ventas → Detalles → Agregar productos</p>
        </div>
      </div>

      <div className="topbar__status">
        <span>Venta seleccionada</span>
        <strong>{selectedSale ? `#${selectedSale.saleId}` : 'Ninguna'}</strong>
      </div>
    </header>
  )
}
