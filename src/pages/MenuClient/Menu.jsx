import { useState, useEffect } from 'react';
import DishImage from '../../components/DishImage/DishImage';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Menu.css';

function Menu() {
  const { addToCart } = useCart(); 
  const navigate = useNavigate();

  const [menusFuturos, setMenusFuturos] = useState([]);
  const [pratosCatalogo, setPratosCatalogo] = useState([]);
  const [ingredientesCatalogo, setIngredientesCatalogo] = useState([]); // NUEVO: Estado para ingredientes
  const [menuAtivo, setMenuAtivo] = useState(null); 
  
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

        // Descargamos Menús, Platos Y AHORA Ingredientes en paralelo
        const [resMenus, resPratos, resIngredientes] = await Promise.all([
          fetch(`${BASE_URL}/menus`, { headers }),
          fetch(`${BASE_URL}/dishes`, { headers }),
          fetch(`${BASE_URL}/ingredients`, { headers })
        ]);

        if (resMenus.ok && resPratos.ok && resIngredientes.ok) {
          const menusData = await resMenus.json();
          const pratosData = await resPratos.json();
          const ingredientesData = await resIngredientes.json();

          const amanha = new Date();
          amanha.setHours(0, 0, 0, 0);
          amanha.setDate(amanha.getDate() + 1); 

          const disponiveis = menusData
            .filter(m => new Date(m.date) >= amanha)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
            
          setMenusFuturos(disponiveis);
          setPratosCatalogo(pratosData);
          setIngredientesCatalogo(ingredientesData); // Guardamos los ingredientes

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

  const getPratoDetalhes = (nomePrato) => {
    if (!nomePrato) return null;
    return pratosCatalogo.find(p => p.name === nomePrato) || { name: nomePrato, price: 0, ingredientNames: [] };
  };

  // NUEVA FUNCIÓN: Extraer y deducir los alérgenos únicos de un plato
  const getAlergeniosDoPrato = (nomesIngredientes) => {
    if (!nomesIngredientes || nomesIngredientes.length === 0) return [];
    
    const alergeniosEncontrados = new Set();
    
    nomesIngredientes.forEach(nome => {
      const ingredienteCompleto = ingredientesCatalogo.find(ing => ing.name === nome);
      if (ingredienteCompleto && ingredienteCompleto.allergen && ingredienteCompleto.allergen !== 'NONE') {
        alergeniosEncontrados.add(ingredienteCompleto.allergen);
      }
    });

    return Array.from(alergeniosEncontrados);
  };

  // Traductor visual de Alérgenos
  const traduzirAlergenio = (allergen) => {
    const traducoes = {
      'CELERY': 'Aipo', 'NUTS': 'Frutos Secos', 'LUPINS': 'Tremoços', 'CRUSTACEANS': 'Crustáceos',
      'EGGS': 'Ovos', 'MOLLUSCS': 'Moluscos', 'PEANUTS': 'Amendoins', 'GLUTEN_CONTAINING_CEREALS': 'Glúten',
      'FISH': 'Peixe', 'SULPHITES': 'Sulfitos', 'MILK_AND_MILK_PRODUCTS': 'Laticínios',
      'SOYBEANS': 'Soja', 'MUSTARD': 'Mostarda', 'SESAME_SEEDS': 'Sésamo'
    };
    return traducoes[allergen] || allergen;
  };

  const adicionarAoCarrinho = (prato, dataReserva) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
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
            {[menuAtivo.meatDishName, menuAtivo.fishDishName, menuAtivo.vegetarianDishName].map((nomePrato, index) => {
              const pratoDetalhes = getPratoDetalhes(nomePrato);
              if (!pratoDetalhes) return null;

              const categorias = ['Opção de Carne', 'Opção de Peixe', 'Opção Vegetariana'];
              const alergenios = getAlergeniosDoPrato(pratoDetalhes.ingredientNames); // Calculamos alérgenos

              return (
                <div key={index} className="prato-card" onClick={() => setSelectedPrato({ ...pratoDetalhes, categoryLabel: categorias[index] })}>
                  <div className="image-container">
                    <span className="category-badge">{categorias[index]}</span>
                    <DishImage 
                      dishId={pratoDetalhes.id} 
                      altName={pratoDetalhes.name} 
                      className="modal-image" 
                    />
                  </div>
                  
                  <div className="prato-info">
                    <div className="prato-header">
                      <h4>{pratoDetalhes.name}</h4>
                      <span className="price">{pratoDetalhes.price ? pratoDetalhes.price.toFixed(2) : '0.00'}€</span>
                    </div>
                    {/* Renderizamos las etiquetas de alérgenos si las hay */}
                    {alergenios.length > 0 && (
                      <div className="allergens-wrapper">
                        {alergenios.map(a => (
                          <span key={a} className="allergen-tag" title="Contém Alergénio">⚠️ {traduzirAlergenio(a)}</span>
                        ))}
                      </div>
                    )}
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
              <DishImage 
                dishId={selectedPrato.id} 
                altName={selectedPrato.name} 
                className="modal-image" 
              />
              <div className="modal-details">
                <span className="modal-date-tag">Para {formatarData(menuAtivo.date)}</span>
                <h2>{selectedPrato.name}</h2>
                <span className="modal-price">{selectedPrato.price ? selectedPrato.price.toFixed(2) : '0.00'}€</span>
                
                {/* Alérgenos dentro del Modal */}
                {getAlergeniosDoPrato(selectedPrato.ingredientNames).length > 0 && (
                  <div className="modal-allergens-alert">
                    <strong>Atenção Alergias:</strong> Contém {getAlergeniosDoPrato(selectedPrato.ingredientNames).map(traduzirAlergenio).join(', ')}.
                  </div>
                )}

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