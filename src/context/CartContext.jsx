import { createContext, useState, useEffect, useContext } from 'react';

// Creamos el contexto
const CartContext = createContext();

// Hook personalizado para usar el carrito fácilmente
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Inicializamos el carrito buscando en el localStorage
  const [cart, setCart] = useState(() => {
    const carrinhoGuardado = localStorage.getItem('carrinho');
    return carrinhoGuardado ? JSON.parse(carrinhoGuardado) : [];
  });

  // Cada vez que el carrito cambia, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (prato) => {
    setCart((prevCart) => {
      // Magia: Ahora identificamos un pedido por su ID + la fecha de reserva
      const itemExistente = prevCart.find(item => item.id === prato.id && item.reserveDate === prato.reserveDate);
      
      if (itemExistente) {
        return prevCart.map(item => 
          (item.id === prato.id && item.reserveDate === prato.reserveDate) 
            ? { ...item, quantidade: item.quantidade + 1 } 
            : item
        );
      }
      return [...prevCart, { ...prato, quantidade: 1 }];
    });
  };

  const removeFromCart = (id, dataReserva) => {
    // También actualizamos el remove para que elimine por ID + Fecha
    setCart((prevCart) => prevCart.filter(item => !(item.id === id && item.reserveDate === dataReserva)));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculamos el precio total
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantidade), 0);
  
  // Calculamos la cantidad total de artículos
  const totalItems = cart.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};