import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/constants/products';

export interface CartItem {
  id: string;
  name: string;
  thaiName: string;
  price: number; // Price of the specific size
  quantity: number;
  selectedWeight: string;
  image: string;
  spicyLevel: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, weight: string) => void;
  removeFromCart: (productId: string, weight: string) => void;
  updateQuantity: (productId: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  promoDiscount: number;
  promoCode: string;
  applyPromo: (code: string) => boolean;
  deliveryFee: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  // Quick delivery calculation: free over 300 THB, else 40 THB
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 1),
    0
  );
  const deliveryFee = subtotal > 300 || subtotal === 0 ? 0 : 40;

  const cartCount = cartItems.reduce(
    (count, item) => count + (Number(item?.quantity) || 0),
    0
  );
  const cartTotal = Math.max(0, subtotal + deliveryFee - promoDiscount);

  const addToCart = (product: Product, quantity: number = 1, weight: string = '') => {
    // 🛡️ Guard Clause: Check if product object exists
    if (!product || !product.id) {
      console.warn('addToCart cancelled: invalid product object', product);
      return;
    }

    // Support both price and product_price fields
    const basePrice = Number(product.price ?? (product as any).product_price ?? 0);

    // Safely resolve weight option price
    const weightOpt = product.weightOptions?.find(o => o.label === weight) || product.weightOptions?.[0];
    const unitPrice = weightOpt ? Number(weightOpt.price ?? basePrice) : basePrice;
    const selectedWeight = weight || weightOpt?.label || 'ขนาดมาตรฐาน';

    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item?.id === product.id && item?.selectedWeight === selectedWeight
      );

      if (existingIndex > -1) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      } else {
        return [
          ...prev,
          {
            id: String(product.id),
            name: product.name || product.thaiName || 'สินค้า',
            thaiName: product.thaiName || product.name || 'สินค้า',
            price: unitPrice,
            quantity: quantity || 1,
            selectedWeight: selectedWeight,
            image: product.image || '',
            spicyLevel: product.spicyLevel ?? 0,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string, weight: string) => {
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.selectedWeight === weight)));
  };

  const updateQuantity = (productId: string, weight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId && item.selectedWeight === weight ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    setPromoDiscount(0);
  };

  const applyPromo = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'SPICY10' && subtotal > 0) {
      setPromoCode('SPICY10');
      setPromoDiscount(Math.round(subtotal * 0.1)); // 10% off
      return true;
    }
    if (normalized === 'FREESHIP' && subtotal > 0) {
      setPromoCode('FREESHIP');
      setPromoDiscount(deliveryFee); // covers delivery fee
      return true;
    }
    return false;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        promoDiscount,
        promoCode,
        applyPromo,
        deliveryFee,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
