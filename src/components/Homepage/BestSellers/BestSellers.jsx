import { useNavigate } from 'react-router-dom';
import './BestSellers.css';

function BestSellers() {
  const navigate = useNavigate();

  // Função inteligente que decide para onde enviar o usuário
  const handleItemClick = () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Se estiver autenticado, vai direto para reservar
      navigate('/menu');
    } else {
      // Se for convidado, pedimos para fazer login
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
        <button onClick={handleItemClick} className="view-all-btn">VER MENU COMPLETO &rarr;</button>
      </div>
      
      <div className="bestsellers-grid">
        {/* Elemento Principal (Esquerda) */}
        <div className="grid-item main-dish" onClick={handleItemClick}>
          <div className="item-content">
            <span className="tag">ASSINATURA</span>
            <h3>Velvet Garden</h3>
            <p>Uma mistura surpreendente de vegetais da época e sabores da terra...</p>
          </div>
        </div>

        {/* Elemento Superior (Direita) */}
        <div className="grid-item side-top" onClick={handleItemClick}>
          <div className="item-content">
            <h3>Tarte de Maçã</h3>
          </div>
        </div>

        {/* Elementos Inferiores (Direita) */}
        <div className="grid-item side-bottom-left" onClick={handleItemClick}>
          <div className="item-content price-content">
            <h3>Pudim de Caramelo</h3>
            <span className="price">€3.50</span>
          </div>
        </div>
        
        <div className="grid-item side-bottom-right" onClick={handleItemClick}>
        </div>
      </div>
    </section>
  );
}

export default BestSellers;