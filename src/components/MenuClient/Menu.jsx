import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Importación vital
import './Menu.css';

function Menu() {
  // 1. Extraemos la función mágica del contexto global
  const { addToCart } = useCart(); 
  const navigate = useNavigate();
  
  const [pratos, setPratos] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [selectedPrato, setSelectedPrato] = useState(null);

  const BASE_URL = 'https://siws.ufp.pt/lwlc/api';

  useEffect(() => {
    const fetchPratos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/dishes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPratos(data); 
        } else {
          setErro("Não foi possível carregar o catálogo de pratos.");
        }
      } catch (error) {
        setErro("Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchPratos();
  }, []);

  // 2. FUNCIÓN PARA AÑADIR AL CARRITO
  const adicionarAoCarrinho = (prato) => {
    const token = localStorage.getItem('token');
    
    // Si no ha iniciado sesión, no le dejamos comprar
    if (!token) {
      alert("Por favor, inicie sessão para adicionar pratos à encomenda.");
      navigate('/login');
      return;
    }

    console.log("Enviando prato para o contexto global:", prato); // Para diagnóstico (F12)
    
    addToCart(prato); // Invocamos el estado global
    alert(`"${prato.name}" adicionado ao seu carrinho!`);
    setSelectedPrato(null); // Cerramos la ventana emergente
  };

  const pratosFiltrados = pratos.filter((prato) => {
    if (termoBusca === '') return true;
    const termoLower = termoBusca.toLowerCase();
    const nomeInclui = prato.name.toLowerCase().includes(termoLower);
    const ingredientesIncluem = prato.ingredientNames && prato.ingredientNames.some(ing => 
      ing.toLowerCase().includes(termoLower)
    );
    return nomeInclui || ingredientesIncluem;
  });

  return (
    <section className="menu-catalog-section" id="menu-completo">
      <div className="catalog-header">
        <span className="subtitle">SABORES DO MUNDO</span>
        <h2>Menu Completo</h2>
        <p>Explore as nossas criações preparadas diariamente.</p>
        
        <div className="search-bar-container">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input"
            placeholder="Procurar por prato ou ingrediente..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">A carregar os pratos...</div>
      ) : erro ? (
        <div className="error-message">{erro}</div>
      ) : (
        <div className="catalog-container">
          {pratosFiltrados.length === 0 ? (
            <div className="empty-message">Nenhum prato encontrado com o termo "{termoBusca}".</div>
          ) : (
            <div className="pratos-grid">
              {pratosFiltrados.map((prato) => (
                <div key={prato.id} className="prato-card" onClick={() => setSelectedPrato(prato)}>
                  <div className="image-container">
                    <img 
                      src={prato.imageUrl || 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=500&q=80'} 
                      alt={prato.name} 
                      className="prato-image" 
                    />
                  </div>
                  
                  <div className="prato-info">
                    <div className="prato-header">
                      <h4>{prato.name}</h4>
                      <span className="price">{prato.price ? prato.price.toFixed(2) : '0.00'}€</span>
                    </div>
                    
                    <div className="prato-tags">
                      {prato.ingredientNames && prato.ingredientNames.slice(0, 3).map((ing, idx) => (
                        <span key={idx} className="tag">{ing}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedPrato && (
        <div className="modal-overlay" onClick={() => setSelectedPrato(null)}>
          <div className="modal-content dish-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPrato(null)}>✕</button>
            
            <div className="modal-layout">
              <img 
                src={selectedPrato.imageUrl || 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=500&q=80'} 
                alt={selectedPrato.name} 
                className="modal-image"
              />
              
              <div className="modal-details">
                <h2>{selectedPrato.name}</h2>
                <span className="modal-price">{selectedPrato.price ? selectedPrato.price.toFixed(2) : '0.00'}€</span>
                
                <div className="modal-ingredients">
                  <h3>Ingredientes:</h3>
                  {selectedPrato.ingredientNames && selectedPrato.ingredientNames.length > 0 ? (
                    <ul>
                      {selectedPrato.ingredientNames.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Detalhes nutricionais não disponíveis.</p>
                  )}
                </div>

                {/* BOTÓN CONECTADO A LA FUNCIÓN DEL CARRITO */}
                {localStorage.getItem('token') ? (
                  <button 
                    className="btn-add-cart" 
                    onClick={() => adicionarAoCarrinho(selectedPrato)}
                  >
                    <span className="cart-icon">🛒</span> ADICIONAR AO CARRINHO
                  </button>
                ) : (
                  <button 
                    className="btn-add-cart" 
                    style={{ backgroundColor: '#888', cursor: 'pointer' }}
                    onClick={() => navigate('/login')}
                  >
                    <span className="cart-icon">🔒</span> INICIAR SESSÃO PARA COMPRAR
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Menu;