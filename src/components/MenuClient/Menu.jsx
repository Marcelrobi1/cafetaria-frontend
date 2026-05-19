import { useState, useEffect } from 'react';
import './Menu.css';

function Menu() {
  const [pratos, setPratos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NUEVO ESTADO: Guardará el plato en el que el usuario hizo clic.
  // Empieza en 'null' (ningún plato seleccionado).
  const [selectedPrato, setSelectedPrato] = useState(null);

  useEffect(() => {
    const fetchPratos = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await fetch('https://siws.ufp.pt/lwlc/api/pratos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Asumimos que la API devuelve un array de platos. 
          // Si por ahora la API está vacía, puedes poner datos de prueba aquí para ver el diseño.
          setPratos(data); 
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPratos();
  }, []);

  const pratosCarne = pratos.filter(prato => prato.categoria === 'Carne');
  const pratosPeixe = pratos.filter(prato => prato.categoria === 'Peixe');
  const pratosVegetariano = pratos.filter(prato => prato.categoria === 'Vegetariano');

  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedPrato(null);
  };

  // Renderiza una sección de cuadrícula (Grid) en lugar de una lista
  const renderSection = (title, items) => (
    <div className="menu-category">
      <h3 className="category-title">{title}</h3>
      <div className="menu-grid">
        {items.length > 0 ? (
          items.map((prato) => (
            // Al hacer clic, guardamos este plato en el estado 'selectedPrato'
            <div key={prato.id} className="prato-card" onClick={() => setSelectedPrato(prato)}>
              {/* RF5: La API devuelve una imagen o usamos una por defecto */}
              <img src={prato.imagemUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'} alt={prato.nome} className="prato-image" />
              
              <div className="prato-info">
                <div className="prato-header-card">
                  <h4>{prato.nome}</h4>
                  <span className="prato-price">€{prato.preco.toFixed(2)}</span>
                </div>
                
                {/* Etiquetas de ejemplo inspiradas en tu diseño */}
                <div className="prato-tags">
                  <span className="tag">Artesanal</span>
                  <span className="tag">{prato.categoria}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-message">Nenhum prato disponível nesta categoria.</p>
        )}
      </div>
    </div>
  );

  return (
    <section className="menu-page-section" id="menu-completo">
      <div className="menu-header-top">
        <h2>O Nosso Menu</h2>
        <p>Produção diária com ingredientes frescos para garantir textura e sabor inigualáveis.</p>
      </div>

      {loading ? (
        <div className="loading-spinner">A carregar o menu...</div>
      ) : (
        <div className="menu-layout">
          {renderSection('Carne', pratosCarne)}
          {renderSection('Peixe', pratosPeixe)}
          {renderSection('Vegetariano', pratosVegetariano)}
        </div>
      )}

      {/* RENDERIZADO CONDICIONAL DEL MODAL: Solo se dibuja si selectedPrato tiene datos */}
      {selectedPrato && (
        <div className="modal-overlay" onClick={closeModal}>
          {/* Evitamos que el clic dentro del modal lo cierre */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>✕</button>
            
            <div className="modal-layout">
              <img src={selectedPrato.imagemUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'} alt={selectedPrato.nome} />
              
              <div className="modal-details">
                <h2>{selectedPrato.nome}</h2>
                <span className="modal-price">€{selectedPrato.preco.toFixed(2)}</span>
                <p className="modal-desc">{selectedPrato.descricao}</p>
                
                <div className="modal-ingredients">
                  <h3>Ingredientes:</h3>
                  <ul>
                    {/* Verificamos si la API nos mandó ingredientes (RF4/RF5) */}
                    {selectedPrato.ingredientes && selectedPrato.ingredientes.length > 0 ? (
                      selectedPrato.ingredientes.map((ing, idx) => (
                        <li key={idx}>{ing.nome || ing}</li>
                      ))
                    ) : (
                      <li>Informação de ingredientes não disponível.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Menu;