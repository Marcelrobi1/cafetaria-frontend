import './BestSellers.css';

function BestSellers() {
  return (
    <section className="bestsellers-section">
      <div className="bestsellers-header">
        <div className="header-titles">
          <span className="subtitle">FAVORITOS DA CASA</span>
          <h2>Os Pratos mais Vendidos</h2>
        </div>
        <a href="#menu-completo" className="view-all">VER MENU COMPLETO &rarr;</a>
      </div>
      
      <div className="bestsellers-grid">
        {/* Elemento Principal (Izquierda) */}
        <div className="grid-item main-dish">
          <div className="item-content">
            <span className="tag">ASSINATURA</span>
            <h3>Velvet Garden</h3>
            <p>Uma mistura surpreendente de vegetais da época e sabores da terra...</p>
          </div>
        </div>

        {/* Elemento Superior (Derecha) */}
        <div className="grid-item side-top">
          <div className="item-content">
            <h3>Tarte de Maçã</h3>
          </div>
        </div>

        {/* Elementos Inferiores (Derecha) */}
        <div className="grid-item side-bottom-left">
          <div className="item-content price-content">
            <h3>Pudim de Caramelo</h3>
            <span className="price">€3.50</span>
          </div>
        </div>
        
        <div className="grid-item side-bottom-right">
          {/* Solo imagen, sin texto en tu diseño */}
        </div>
      </div>
    </section>
  );
}

export default BestSellers;