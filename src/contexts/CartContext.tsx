import React, { createContext, useContext, useState, useEffect } from 'react';

interface RideItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  date: string;
  quantity: number;
  type: 'ride';
}

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'food';
}

type CartItem = RideItem | FoodItem;

interface CartContextType {
  items: CartItem[];
  addRide: (ride: Omit<RideItem, 'quantity'>, date: string) => void;
  addFood: (food: Omit<FoodItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addRide = (ride: Omit<RideItem, 'quantity'>, date: string) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item._id === ride._id && item.type === 'ride' && 'date' in item && item.date === date
      );
      
      if (existingItemIndex !== -1) {
        // Increment quantity if ride with same date already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Add new ride
        return [...prevItems, { ...ride, date, quantity: 1, type: 'ride' }];
      }
    });
  };

  const addFood = (food: Omit<FoodItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item._id === food._id && item.type === 'food'
      );
      
      if (existingItemIndex !== -1) {
        // Increment quantity if food already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Add new food
        return [...prevItems, { ...food, quantity: 1, type: 'food' }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addRide,
        addFood,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};