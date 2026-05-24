import { useNavigate } from 'react-router-dom';
import './BestSellers.css';

function BestSellers() {
  const navigate = useNavigate();

  // Función inteligente que decide a dónde enviar al usuario
  const handleItemClick = () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Si está autenticado, va directo a reservar
      navigate('/menu');
    } else {
      // Si es un invitado, le pedimos que inicie sesión
      navigate('/login');
    }
  };

  return (
    <section className="bestsellers-section">
      <div className="bestsellers-header">
        <div className="header-titles">
          <span className="subtitle">FAVORITOS DA CASA</span>
          <h2>Os Pratos mais Vendidos</h2>
        </div>
        {/* Cambiamos la etiqueta <a> por un botón que ejecuta nuestra función */}
        <button onClick={handleItemClick} className="view-all-btn">VER MENU COMPLETO &rarr;</button>
      </div>
      
      <div className="bestsellers-grid">
        {/* Elemento Principal (Izquierda) */}
        <div className="grid-item main-dish" onClick={handleItemClick}>
          <div className="item-content">
            <span className="tag">ASSINATURA</span>
            <h3>Velvet Garden</h3>
            <p>Uma mistura surpreendente de vegetais da época e sabores da terra...</p>
          </div>
        </div>

        {/* Elemento Superior (Derecha) */}
        <div className="grid-item side-top" onClick={handleItemClick}>
          <div className="item-content">
            <h3>Tarte de Maçã</h3>
          </div>
        </div>

        {/* Elementos Inferiores (Derecha) */}
        <div className="grid-item side-bottom-left" onClick={handleItemClick}>
          <div className="item-content price-content">
            <h3>Pudim de Caramelo</h3>
            <span className="price">€3.50</span>
          </div>
        </div>
        
        <div className="grid-item side-bottom-right" onClick={handleItemClick}>
          {/* Solo imagen, sin texto en tu diseño */}
        </div>
      </div>
    </section>
  );
}

export default BestSellers;