import './navbar.css';
function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <h2>Early Cafetaria</h2>
      </div>
      <ul className="nav-links">
        <li>Inicio</li>
        <li>Menu</li>
        <li>Sobre Nós</li>
        <li>Contato</li>
        <li>FAQ</li>
      </ul>
      <div className="user-profile">
        {/* Aquí irá el icono del usuario y la lógica de login/logout */}
        <span>👤 Perfil</span>
      </div>
    </nav>
  );
}

export default Navbar;