import { createContext, useState, useEffect, useContext } from 'react';

// Contexto
const CartContext = createContext();

// Hook personalizado para usar o carrito facilmente
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Inicializamos o carrito buscando no localStorage
  const [cart, setCart] = useState(() => {
    const carrinhoGuardado = localStorage.getItem('carrinho');
    return carrinhoGuardado ? JSON.parse(carrinhoGuardado) : [];
  });

  // Sempre que o carrinho é alterado, guardamos as alterações no localStorage.
  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (prato) => {
    setCart((prevCart) => {
      // Magia: Agora identificamos um pedido pelo seu ID + a data da reserva.
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
    //  Atualizamos o remove (ID + Fecha)
    setCart((prevCart) => prevCart.filter(item => !(item.id === id && item.reserveDate === dataReserva)));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculamos o preço total
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantidade), 0);
  
  // Calculamos o número total de itens.
  const totalItems = cart.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};