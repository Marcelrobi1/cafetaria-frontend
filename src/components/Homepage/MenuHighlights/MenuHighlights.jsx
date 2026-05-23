import './MenuHighlights.css';
import { useNavigate } from 'react-router-dom';
function MenuHighlights() {
  const navigate = useNavigate();
  const navigateToMenu = () => {
    navigate('/menu');
  };
  return (
    <section className="menu-highlights-section">
      <div className="menu-header">
        <h2>Seleções de Menu</h2>
      </div>
      
      <div className="cards-container">
        {/* Tarjeta 1 */}
        <div className="menu-card card-meat" onClick={navigateToMenu}>
          <div className="card-content">
            <h3>Carne</h3>
            <p>Desperta o teu sentido</p>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="menu-card card-fish" onClick={navigateToMenu}>
          <div className="card-content">
            <h3>Peixe</h3>
            <p>O sabor do mar</p>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="menu-card card-vegie" onClick={navigateToMenu}>
          <div className="card-content">
            <h3>Vegetariano</h3>
            <p>Opções saudáveis</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MenuHighlights;