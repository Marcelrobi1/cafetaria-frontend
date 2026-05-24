import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DishImage from '../../DishImage/DishImage'; // Ajusta la ruta si es necesario
import './MenuHighlights.css';

function MenuHighlights() {
  const navigate = useNavigate();
  const [nextMenu, setNextMenu] = useState(null);
  const [dishesInfo, setDishesInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = 'https://siws.ufp.pt/lwlc/api';

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Hacemos las dos peticiones en paralelo para mayor velocidad
        const [resMenus, resDishes] = await Promise.all([
          fetch(`${BASE_URL}/menus`, { headers }),
          fetch(`${BASE_URL}/dishes`, { headers })
        ]);

        if (resMenus.ok && resDishes.ok) {
          const menusData = await resMenus.json();
          const dishesData = await resDishes.json();

          // Lógica de tiempo: Buscar a partir de mañana a las 00:00
          const amanha = new Date();
          amanha.setHours(0, 0, 0, 0);
          amanha.setDate(amanha.getDate() + 1);

          // Filtrar menús futuros y ordenarlos por el más cercano
          const futureMenus = menusData
            .filter(m => new Date(m.date) >= amanha)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

          if (futureMenus.length > 0) {
            const next = futureMenus[0];
            setNextMenu(next);

            // Mapeamos los nombres de los platos del menú con sus IDs reales del catálogo
            const matchDish = (name, typeLabel) => {
              const d = dishesData.find(dish => dish.name === name);
              return d ? { ...d, typeLabel } : null;
            };

            const matched = [
              matchDish(next.meatDishName, 'Opção de Carne'),
              matchDish(next.fishDishName, 'Opção de Peixe'),
              matchDish(next.vegetarianDishName, 'Opção Vegetariana')
            ].filter(Boolean); // Filtra por si algún plato no se encontró

            setDishesInfo(matched);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar destaques do menu", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  // Función para formatear la fecha maravillosamente en portugués
  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('pt-PT', options);
  };

  const navigateToMenu = () => {
    // Redirigimos pasando la fecha exacta como "state" oculto
    // (Puedes usar esto más adelante en Menu.jsx si quieres forzar esa pestaña)
    navigate('/menu', { state: { selectedDate: nextMenu?.date } });
  };

  // Si está cargando o no hay menús futuros, mostramos un estado de gracia
  if (loading) {
    return (
      <section className="menu-highlights-section">
        <div className="menu-header">
          <h2>A preparar as próximas sugestões...</h2>
        </div>
      </section>
    );
  }

  if (!nextMenu || dishesInfo.length === 0) {
    return null; // Oculta la sección de forma elegante si no hay reservas futuras planificadas
  }

  return (
    <section className="menu-highlights-section">
      <div className="menu-header">
        <h2>Próximo Menu Disponível</h2>
        <p style={{ fontFamily: 'Arial', color: '#555', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Reserve já para {formatDate(nextMenu.date)}
        </p>
      </div>
      
      <div className="cards-container">
        {dishesInfo.map((dish, index) => (
          <div key={dish.id || index} className="menu-card dynamic-card" onClick={navigateToMenu}>
            
            {/* El componente DishImage actúa como fondo */}
            <DishImage 
              dishId={dish.id} 
              altName={dish.name} 
              className="highlight-bg-img" 
            />
            
            {/* Capa oscura para que el texto resalte siempre */}
            <div className="card-overlay"></div>

            <div className="card-content">
              <h3>{dish.typeLabel}</h3>
              <p>{dish.name}</p>
              <span className="highlight-price">{dish.price.toFixed(2)}€</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MenuHighlights;