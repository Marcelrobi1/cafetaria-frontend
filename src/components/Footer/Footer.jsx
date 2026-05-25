import { useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const navigate = useNavigate();

  const handleMenuNavigation = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      navigate('/menu');
    }
  };

  return (
    <footer className="footer-section" id="footer">
      <div className="footer-container">
        
        {/* Coluna 1: Marca */}
        <div className="footer-brand">
          <h2>Early Cafetaria</h2>
          <p>O teu ritual matinal no coração do Porto. Café de especialidade e design pensados para despertar os sentidos.</p>
        </div>

        {/* Coluna 2: Links */}
        <div className="footer-column">
          <h4>MENU</h4>
          <ul>
            <li><span onClick={handleMenuNavigation}>Carne</span></li>
            <li><span onClick={handleMenuNavigation}>Peixe</span></li>
            <li><span onClick={handleMenuNavigation}>Vegetariano</span></li>
          </ul>
        </div>

        {/* Coluna 3: Localização */}
        <div className="footer-column">
          <h4>VISITE-NOS</h4>
          <p>📍 Rua dos Bragas 351, 4050-123 Porto<br/>Porto, Portugal</p>
          <p>🕒 Seg - Sex: 08:00 — 18:00<br/>Sáb - Dom: 09:00 — 16:00</p>
        </div>

        {/* Coluna 4: Contactos */}
        <div className="footer-column">
          <h4>REDES SOCIAIS</h4>
          <div className="social-links">
            <a href="https://www.instagram.com/earlycedofeita/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer">Pinterest</a>
          </div>
          <h4 className="phone-title">TELEFONE</h4>
          <p>📞 +351 937 461 551</p>
        </div>

      </div>

      <div className="footer-bottom">
        {/* Utilização do ano dinamico do JS */}
        <p>&copy; {new Date().getFullYear()} EARLY CAFETARIA — DEVELOPED BY ROBI HENRIQUEZ & PEDRO PAIVA - UFP</p>
      </div>
    </footer>
  );
}

export default Footer;