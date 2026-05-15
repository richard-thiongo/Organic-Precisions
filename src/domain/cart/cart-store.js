import { create } from "zustand";

/**
 * Cart Store to handle POS (Point of Sale) operations.
 * Manages selected items, quantities, and totals.
 */
export const useCartStore = create((set, get) => ({
  items: [],
  
  addItem: (variant, product) => {
    const currentItems = get().items;
    const existing = currentItems.find(i => i.variant_id === variant.id);
    const stockLimit = variant.stock_quantity || 0;
    
    if (existing) {
      if (existing.quantity >= stockLimit) return; // Prevent over-stock
      set({
        items: currentItems.map(i => 
          i.variant_id === variant.id 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        )
      });
    } else {
      if (stockLimit <= 0) return;
      set({
        items: [...currentItems, { 
          variant_id: variant.id, 
          name: `${product.name} (${variant.measurement_value} ${variant.measurement_unit})`,
          price: variant.price,
          quantity: 1,
          stock_limit: stockLimit
        }]
      });
    }
  },

  removeItem: (variantId) => {
    set({ items: get().items.filter(i => i.variant_id !== variantId) });
  },

  updateQuantity: (variantId, quantity) => {
    const item = get().items.find(i => i.variant_id === variantId);
    if (!item || quantity < 1 || quantity > item.stock_limit) return;
    set({
      items: get().items.map(i => 
        i.variant_id === variantId ? { ...i, quantity } : i
      )
    });
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  }
}));
