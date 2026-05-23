import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import './CartSidebar.css';

// Icono SVG personalizado que se parece al de la imagen (una cesta de compra moderna)
const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.1 19.3L16.9 19.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5.4 15L18.6 15L20 8.2L4 8.2L5.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8.2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 5.2L14 5.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, total, clearCart, totalItems } = useCart();
  const [loading, setLoading] = useState(false);
  
  const BASE_URL = 'https://siws.ufp.pt/lwlc/api';

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setLoading(true);
    const token = localStorage.getItem('token');

    // Paylaod exacto para Swagger: un array de IDs de los platos
    const payload = {
      dishIds: cart.map(item => item.id) 
    };

    try {
      const response = await fetch(`${BASE_URL}/purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Compra finalizada com sucesso! O seu pedido está a ser preparado.');
        clearCart(); 
        onClose();   
      } else {
        const errorText = await response.text();
        alert(`Erro ao finalizar compra: ${errorText}`);
      }
    } catch (error) {
      alert('Erro de conexão ao processar a compra.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay con efecto de desenfoque de cristal (Glassmorphism) */}
      <div className="cart-overlay-glass" onClick={onClose}></div>
      
      {/* Panel lateral del carrito */}
      <div className="cart-sidebar-premium">
        <div className="cart-header-premium">
          <div className="cart-title-group">
            <span className="cart-icon-container"><CartIcon /></span>
            <h2>Resumo do pedido</h2>
          </div>
          <button className="close-cart-btn-premium" onClick={onClose}>✕</button>
        </div>

        <div className="cart-content-premium">
          {cart.length === 0 ? (
            <div className="empty-cart-message">
              <p>O seu carrinho está vazio.</p>
              <button className="btn-continue-premium" onClick={onClose}>Continuar a explorar</button>
            </div>
          ) : (
            <div className="cart-items-list-premium">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="cart-item-premium">
                  <img 
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=100&q=80'} 
                    alt={item.name} 
                    className="cart-item-image-premium"
                  />
                  <div className="cart-item-details-premium">
                    <div className="cart-item-top-premium">
                      <h4>{item.name}</h4>
                      <button className="remove-item-btn-premium" onClick={() => removeFromCart(item.id)}>Remover</button>
                    </div>
                    <div className="cart-item-bottom-premium">
                      <span className="cart-item-qty">{item.quantidade || 1} x</span>
                      <span className="cart-item-unit-price">
                        {item.price ? item.price.toFixed(2) : '0.00'}€
                      </span>
                      <span className="cart-item-total-price">
                        {( (item.price || 0) * (item.quantidade || 1) ).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer-premium">
            <div className="cart-total-premium">
              <span>Total:</span>
              <span className="total-amount-premium">{total.toFixed(2)}€</span>
            </div>
            
            <button className="btn-continue-premium full-width" onClick={onClose}>
              CONTINUAR A EXPLORAR
            </button>
            
            <button 
              className="btn-checkout-premium" 
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'A PROCESSAR...' : 'FINALIZAR COMPRA'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartSidebar;