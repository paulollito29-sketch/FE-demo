interface DashboardPageProps {
  salesCount: number
  detailsCount: number
}

export function DashboardPage({ salesCount, detailsCount }: DashboardPageProps) {
  return (
    <section className="page-card">
      <h2>Dashboard</h2>
      <p>Resumen rápido del sistema administrativo.</p>
      <div className="stats-grid">
        <article className="stat-card">
          <span>Ventas registradas</span>
          <strong>{salesCount}</strong>
        </article>
        <article className="stat-card">
          <span>Items vendidos (detalle)</span>
          <strong>{detailsCount}</strong>
        </article>
      </div>
    </section>
  )
}
