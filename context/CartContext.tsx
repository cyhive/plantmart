'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import { normalizeCartProductId } from '@/lib/cart/product-id';
import { fetchUserCart, saveUserCart } from '@/lib/cart/client';
import { mergeCartLines } from '@/lib/cart/merge';
import { clearGuestCart, readGuestCart, writeGuestCart } from '@/lib/cart/guest-storage';
import {
  type CartLineItem,
  cartLinesEqual,
  refreshCartLinesFromCatalog,
} from '@/lib/cart/refresh';

export type CartItem = CartLineItem;

interface CartContextType {
  items: CartItem[];
  cartLoading: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  syncItemsWithCatalog: () => Promise<void>;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SAVE_DEBOUNCE_MS = 450;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const itemsRef = useRef(items);
  const userIdRef = useRef<string | null>(null);
  const skipPersistRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  itemsRef.current = items;

  const syncItemsWithCatalog = useCallback(async () => {
    const prev = itemsRef.current;
    if (prev.length === 0) return;
    const next = await refreshCartLinesFromCatalog(prev);
    setItems((current) => (cartLinesEqual(current, next) ? current : next));
  }, []);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;
    const previousUserId = userIdRef.current;
    userIdRef.current = user?.id ?? null;

    (async () => {
      setCartLoading(true);
      skipPersistRef.current = true;

      try {
        if (user) {
          const guestItems = readGuestCart();
          let serverItems: CartItem[] = [];

          try {
            serverItems = await fetchUserCart();
          } catch (err) {
            console.error('Failed to fetch user cart', err);
          }

          const merged =
            previousUserId === user.id && guestItems.length === 0
              ? serverItems
              : mergeCartLines(guestItems, serverItems);

          const refreshed = await refreshCartLinesFromCatalog(merged);

          if (cancelled) return;

          const withInFlight = mergeCartLines(itemsRef.current, refreshed);
          setItems(withInFlight);
          clearGuestCart();

          try {
            const saved = await saveUserCart(withInFlight);
            if (!cancelled) {
              setItems((current) => {
                const mergedSaved = mergeCartLines(current, saved);
                return cartLinesEqual(current, mergedSaved) ? current : mergedSaved;
              });
            }
          } catch (err) {
            console.error('Failed to save merged cart', err);
          }
        } else {
          const guestItems = readGuestCart();
          const refreshed = await refreshCartLinesFromCatalog(guestItems);
          if (!cancelled) setItems(refreshed);
        }
      } finally {
        if (!cancelled) {
          setHasLoaded(true);
          setCartLoading(false);
          skipPersistRef.current = false;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  useEffect(() => {
    if (!hasLoaded || skipPersistRef.current) return;

    if (user) {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        void saveUserCart(itemsRef.current).catch((err) => {
          console.error('Failed to persist cart', err);
        });
      }, SAVE_DEBOUNCE_MS);

      return () => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      };
    }

    writeGuestCart(items);
  }, [items, hasLoaded, user?.id]);

  useEffect(() => {
    if (!hasLoaded) return;
    void syncItemsWithCatalog();
  }, [hasLoaded, syncItemsWithCatalog]);

  const addItem = (item: CartItem) => {
    const line: CartItem = {
      ...item,
      id: normalizeCartProductId(item.id),
    };
    setItems((prev) => {
      const existing = prev.find((i) => i.id === line.id);
      if (existing) {
        return prev.map((i) =>
          i.id === line.id
            ? {
                ...line,
                quantity: i.quantity + line.quantity,
              }
            : i,
        );
      }
      return [...prev, line];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        syncItemsWithCatalog,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
