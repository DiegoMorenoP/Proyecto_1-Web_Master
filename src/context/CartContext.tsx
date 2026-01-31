import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Kit } from '../types';
// import { useToast } from '../components/common/Toast';

export interface CartItem extends Kit {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (kit: Kit) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    itemCount: number;
    subtotal: number;
    isOpen: boolean;
    toggleCart: () => void;
    updateQuantity: (id: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [isOpen, setIsOpen] = useState(false);
    // const { showToast } = useToast(); // Removed unused hook

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (kit: Kit) => {
        setItems(current => {
            const existing = current.find(item => item.id === kit.id);
            if (existing) {
                return current.map(item =>
                    item.id === kit.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...current, { ...kit, quantity: 1 }];
        });
        // Toast removed as per user request
    };

    const removeItem = (id: string) => {
        setItems(current => current.filter(item => item.id !== id));
    };

    const clearCart = () => setItems([]);

    const toggleCart = () => setIsOpen(prev => !prev);

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setItems(current =>
            current.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            clearCart,
            itemCount,
            subtotal,
            isOpen,
            toggleCart,
            updateQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
