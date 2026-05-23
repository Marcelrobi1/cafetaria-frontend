import './Footer.css';

function Footer() {
  return (
    <footer className="footer-section" id = "footer">
      <div className="footer-container">
        
        {/* Columna 1: Marca */}
        <div className="footer-brand">
          <h2>Early Cafetaria</h2>
          <p>O teu ritual matinal no coração do Porto. Café de especialidade e design pensados para despertar os sentidos.</p>
        </div>

        {/* Columna 2: Enlaces */}
        <div className="footer-column">
          <h4>MENU</h4>
          <ul>
            <li><a href="/menu" style={{ textDecoration: 'none', color: 'inherit' }}>Carne</a></li>
            <li><a href="/menu" style={{ textDecoration: 'none', color: 'inherit' }}>Peixe</a></li>
            <li><a href="/menu" style={{ textDecoration: 'none', color: 'inherit' }}>Vegetariano</a></li>
          </ul>
        </div>

        {/* Columna 3: Ubicación */}
        <div className="footer-column">
          <h4>VISITE-NOS</h4>
          <p>📍 Rua dos Bragas 351, 4050-123 Porto<br/>Porto, Portugal</p>
          <p>🕒 Seg - Sex: 08:00 — 18:00<br/>Sáb - Dom: 09:00 — 16:00</p>
        </div>

        {/* Columna 4: Contacto */}
        <div className="footer-column">
          <h4>REDES SOCIAIS</h4>
          <p className="social-links">
            <span> <a href="https://www.instagram.com/earlycedofeita/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>Instagram</a></span>
            <span> <a href="https://www.pinterest.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>Pinterest</a></span>
          </p>
          <h4 className="phone-title">TELEFONE</h4>
          <p>📞 +351 937 461 551</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 EARLY CAFETARIA — DEVELOPED BY ROBI HENRIQUEZ & PEDRO PAIVA - UFP</p>
      </div>
    </footer>
  );
}

export default Footer;