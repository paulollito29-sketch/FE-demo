import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Navbar } from './layout/Navbar'
import { Sidebar } from './layout/Sidebar'
import { DashboardPage } from './pages/DashboardPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { ProductsPage } from './pages/ProductsPage'
import { SaleDetailsPage } from './pages/SaleDetailsPage'
import { SalesPage } from './pages/SalesPage'
import type { Sale } from './types/models'

export type AppSection = 'dashboard' | 'sales' | 'sale-details' | 'products' | 'categories'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [section, setSection] = useState<AppSection>('dashboard')
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [salesCount, setSalesCount] = useState(0)
  const [detailsCount, setDetailsCount] = useState(0)

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 992) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', closeOnDesktop)
    return () => window.removeEventListener('resize', closeOnDesktop)
  }, [])

  const content = useMemo(() => {
    switch (section) {
      case 'dashboard':
        return <DashboardPage salesCount={salesCount} detailsCount={detailsCount} />
      case 'sales':
        return (
          <SalesPage
            selectedSaleId={selectedSale?.saleId ?? null}
            onSelectSale={sale => {
              setSelectedSale(sale)
            }}
            onGoToDetails={() => setSection('sale-details')}
            onSalesCountChange={setSalesCount}
          />
        )
      case 'sale-details':
        return (
          <SaleDetailsPage
            saleId={selectedSale?.saleId ?? null}
            onBackToSales={() => setSection('sales')}
            onDetailsCountChange={setDetailsCount}
          />
        )
      case 'products':
        return <ProductsPage />
      case 'categories':
        return <CategoriesPage />
      default:
        return <DashboardPage salesCount={salesCount} detailsCount={detailsCount} />
    }
  }, [section, selectedSale, salesCount, detailsCount])

  return (
    <div className="admin-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentSection={section}
        onNavigate={setSection}
      />

      <div className="admin-layout__body">
        <Navbar onToggleMenu={() => setIsSidebarOpen(current => !current)} selectedSale={selectedSale} />
        <main className="main-panel">{content}</main>
      </div>
    </div>
  )
}

export default App
