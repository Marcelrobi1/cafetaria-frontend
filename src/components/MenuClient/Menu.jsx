import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Menu.css';

function Menu() {
  const { addToCart } = useCart(); 
  const navigate = useNavigate();

  const [menusFuturos, setMenusFuturos] = useState([]);
  const [pratosCatalogo, setPratosCatalogo] = useState([]);
  const [menuAtivo, setMenuAtivo] = useState(null); // El día seleccionado
  
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [selectedPrato, setSelectedPrato] = useState(null);

  const BASE_URL = 'https://siws.ufp.pt/lwlc/api';

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        };

        // Descargamos AMBAS bases de datos en paralelo
        const [resMenus, resPratos] = await Promise.all([
          fetch(`${BASE_URL}/menus`, { headers }),
          fetch(`${BASE_URL}/dishes`, { headers })
        ]);

        if (resMenus.ok && resPratos.ok) {
          const menusData = await resMenus.json();
          const pratosData = await resPratos.json();

          // Filtramos solo los menús de hoy en adelante y los ordenamos por fecha
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);

          const disponiveis = menusData
            .filter(m => new Date(m.date) >= hoje)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

          setMenusFuturos(disponiveis);
          setPratosCatalogo(pratosData);

          // Por defecto, seleccionamos el primer día disponible
          if (disponiveis.length > 0) {
            setMenuAtivo(disponiveis[0]);
          }
        } else {
          setErro("Não foi possível carregar a planificação do menu.");
        }
      } catch (error) {
        setErro("Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  // Función mágica: Busca los detalles completos de un plato usando solo su nombre
  const getPratoDetalhes = (nomePrato) => {
    if (!nomePrato) return null;
    return pratosCatalogo.find(p => p.name === nomePrato) || { name: nomePrato, price: 0, ingredientNames: [] };
  };

  const adicionarAoCarrinho = (prato, dataReserva) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Le inyectamos la fecha exacta de la reserva al objeto del plato
    const pratoComData = { ...prato, reserveDate: dataReserva };
    
    addToCart(pratoComData); 
    alert(`"${prato.name}" reservado para ${formatarData(dataReserva)}!`);
    setSelectedPrato(null); 
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formatarDataCurta = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
  };

  return (
    <section className="menu-catalog-section" id="menu-completo">
      <div className="catalog-header">
        <span className="subtitle">RESERVAS DIÁRIAS</span>
        <h2>Menu Planificado</h2>
        <p>Selecione a data para ver os pratos cuidadosamente escolhidos pela nossa equipa para esse dia.</p>
        
        {/* SELECTOR DE FECHAS (TABS) */}
        {!loading && menusFuturos.length > 0 && (
          <div className="date-tabs-container">
            {menusFuturos.map(menu => (
              <button 
                key={menu.id} 
                className={`date-tab ${menuAtivo?.id === menu.id ? 'active' : ''}`}
                onClick={() => setMenuAtivo(menu)}
              >
                {formatarDataCurta(menu.date)}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-spinner">A carregar o planeamento...</div>
      ) : erro ? (
        <div className="error-message">{erro}</div>
      ) : menusFuturos.length === 0 ? (
        <div className="empty-message">Não há menus planificados para os próximos dias.</div>
      ) : (
        <div className="catalog-container">
          <div className="date-header-large">
            <h3>Disponível para {formatarData(menuAtivo.date)}</h3>
          </div>

          <div className="pratos-grid">
            {/* Renderizamos dinámicamente los 3 platos del día seleccionado */}
            {[menuAtivo.meatDishName, menuAtivo.fishDishName, menuAtivo.vegetarianDishName].map((nomePrato, index) => {
              const pratoDetalhes = getPratoDetalhes(nomePrato);
              if (!pratoDetalhes) return null;

              const categorias = ['Opção de Carne', 'Opção de Peixe', 'Opção Vegetariana'];

              return (
                <div key={index} className="prato-card" onClick={() => setSelectedPrato({ ...pratoDetalhes, categoryLabel: categorias[index] })}>
                  <div className="image-container">
                    <span className="category-badge">{categorias[index]}</span>
                    <img 
                      src={pratoDetalhes.imageUrl || 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=500&q=80'} 
                      alt={pratoDetalhes.name} 
                      className="prato-image" 
                    />
                  </div>
                  
                  <div className="prato-info">
                    <div className="prato-header">
                      <h4>{pratoDetalhes.name}</h4>
                      <span className="price">{pratoDetalhes.price ? pratoDetalhes.price.toFixed(2) : '0.00'}€</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedPrato && (
        <div className="modal-overlay" onClick={() => setSelectedPrato(null)}>
          <div className="modal-content dish-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPrato(null)}>✕</button>
            
            <div className="modal-layout">
              <img src={selectedPrato.imageUrl || 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=500&q=80'} alt={selectedPrato.name} className="modal-image" />
              
              <div className="modal-details">
                <span className="modal-date-tag">Para {formatarData(menuAtivo.date)}</span>
                <h2>{selectedPrato.name}</h2>
                <span className="modal-price">{selectedPrato.price ? selectedPrato.price.toFixed(2) : '0.00'}€</span>
                
                <div className="modal-ingredients">
                  <h3>Ingredientes:</h3>
                  {selectedPrato.ingredientNames && selectedPrato.ingredientNames.length > 0 ? (
                    <ul>
                      {selectedPrato.ingredientNames.map((ing, idx) => <li key={idx}>{ing}</li>)}
                    </ul>
                  ) : <p>Detalhes nutricionais não disponíveis.</p>}
                </div>

                {localStorage.getItem('token') ? (
                  <button className="btn-add-cart" onClick={() => adicionarAoCarrinho(selectedPrato, menuAtivo.date)}>
                    <span className="cart-icon">🛒</span> RESERVAR PARA ESTE DIA
                  </button>
                ) : (
                  <button className="btn-add-cart" style={{ backgroundColor: '#888' }} onClick={() => navigate('/login')}>
                    <span className="cart-icon">🔒</span> INICIAR SESSÃO PARA RESERVAR
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