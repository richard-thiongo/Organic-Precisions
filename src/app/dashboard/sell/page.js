"use client";

import * as React from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { fetcher, productService } from "@/domain/api/product-service";
import { useCartStore } from "@/domain/cart/cart-store";
import { ShoppingBag, Trash2, Plus, Minus, CheckCircle, Loader2, X, Search } from "lucide-react";
import { toast } from "sonner";

/**
 * Sell Page (POS) for processing transactions.
 * Allows users to select product variants and complete sales.
 */
export default function SellPage() {
  const { data, isLoading, mutate } = useSWR(productService.getProducts(), fetcher);
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const [processing, setProcessing] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [amountPaid, setAmountPaid] = React.useState("");
  const [isCalcOpen, setIsCalcOpen] = React.useState(false);

  const formatKsh = (val) => {
    return "KSh " + new Intl.NumberFormat('en-US').format(val);
  };
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");

  const products = data?.data || [];
  
  const categories = ["All", "Human Sector", "Farm Sector", "Animal Sector"];
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setProcessing(true);
    try {
      const payload = items.map(i => ({ variant_id: i.variant_id, quantity: i.quantity }));
      const result = await productService.sellItems(payload);
      
      if (result.message.includes("successfully") || result.status === "success") {
        setSuccess(true);
        toast.success("Transaction completed successfully");
        clearCart();
        setIsCartOpen(false);
        mutate(); // Revalidate local data
        globalMutate(productService.getProducts()); // Revalidate everywhere
        setTimeout(() => setSuccess(false), 3000);
      } else {
        toast.error(result.message || "Sale failed. Check stock levels.");
      }
    } catch (err) {
      toast.error("Failed to process sale. Is the API online?");
    } finally {
      setProcessing(false);
    }
  };

  // Shared Cart Component for Drawer and Sidebar
  const CartUI = ({ isSidebar = false }) => (
    <div className={`flex flex-col h-full ${isSidebar ? "" : "w-full"}`}>
      <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isSidebar && (
            <button onClick={() => setIsCartOpen(false)} className="lg:hidden p-2 -ml-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full">
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2 font-bold text-lg">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Cart ({cartItemCount})
          </div>
        </div>
        <button onClick={clearCart} className="text-[10px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded-md transition-colors uppercase tracking-widest">
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4 italic">
            <div className="p-6 rounded-full bg-neutral-100 dark:bg-neutral-900">
              <ShoppingBag className="w-12 h-12 opacity-20" />
            </div>
            <p className="font-medium text-sm">No items in the cart yet</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.variant_id} className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 animate-in slide-in-from-right-4 duration-300">
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate text-[11px]">{item.name}</p>
                <p className="text-[10px] text-primary font-mono font-bold">{formatKsh(item.price)}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-0.5">
                <button onClick={() => updateQuantity(item.variant_id, item.quantity - 1)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className="w-5 text-center font-bold text-[11px]">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.variant_id, item.quantity + 1)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
              <button onClick={() => removeItem(item.variant_id)} className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 space-y-4 pb-safe">
        {items.length > 0 && (
          <div className="space-y-3">
            <button 
              onClick={() => setIsCalcOpen(!isCalcOpen)}
              className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors"
            >
              <span>{isCalcOpen ? "Hide Calculator" : "Show Change Calculator"}</span>
              <div className="h-px flex-1 mx-4 bg-neutral-200 dark:bg-neutral-800" />
            </button>

            {isCalcOpen && (
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-inner space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-neutral-400">Amount Paid</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-neutral-400">KSh</span>
                    <input 
                      type="number"
                      placeholder="0.00"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono font-bold text-[11px]"
                    />
                  </div>
                </div>
                
                {parseFloat(amountPaid) > 0 && (
                  <div className="flex justify-between items-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="text-[9px] font-bold uppercase text-primary/60">Balance</span>
                    <span className="font-mono font-black text-[11px] text-primary">
                      {formatKsh(Math.max(0, parseFloat(amountPaid) - getTotal()))}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] text-neutral-500 font-medium">
            <span>Subtotal</span>
            <span>{formatKsh(getTotal())}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-black tracking-tight pt-2 border-t border-neutral-200 dark:border-neutral-800 mt-2">
            <span>Total</span>
            <span className="text-primary underline underline-offset-4 decoration-primary/20">{formatKsh(getTotal())}</span>
          </div>
        </div>
        
        <button
          disabled={items.length === 0 || processing}
          onClick={handleCheckout}
          className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20 ${
            success 
              ? "bg-green-500 text-white shadow-green-500/20" 
              : "bg-primary text-primary-foreground hover:scale-[1.01] active:scale-[0.99] hover:shadow-2xl hover:shadow-primary/30"
          }`}
        >
          {processing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : success ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Complete
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 opacity-50" />
              Complete Sale
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px-64px)] sm:h-[calc(100vh-64px)] overflow-hidden bg-neutral-50/30 dark:bg-neutral-900/10">
      {/* Left Column: Search, Filters, and Products */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Sticky Header Section */}
        <div className="sticky top-0 z-20 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 p-4 lg:px-8 lg:py-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold tracking-tight">Point of Sale</h1>
              <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Organic Precisions</p>
            </div>
            {/* Cart Button (Visible only on smaller screens where sidebar is hidden) */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="lg:hidden relative p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md hover:border-primary/50 transition-all active:scale-90"
            >
              <ShoppingBag className="w-5 h-5 text-primary" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[9px] font-black rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-6 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-sm"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight whitespace-nowrap transition-all border ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10"
                      : "bg-white dark:bg-neutral-950 text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:border-primary/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Selection Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-20">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col">
                  <h3 className="font-bold mb-3 truncate text-[12px]">{product.name}</h3>
                  <div className="space-y-2 mt-auto">
                    {product.variants?.map((v) => {
                      const cartItem = items.find(i => i.variant_id === v.id);
                      const isMaxed = cartItem && cartItem.quantity >= v.stock_quantity;
                      const isOutOfStock = v.stock_quantity <= 0;

                      return (
                        <div key={v.id} className="relative group">
                          <button
                            onClick={() => addItem(v, product)}
                            disabled={isOutOfStock || isMaxed}
                            className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition-all disabled:opacity-50 ${
                              cartItem 
                                ? isMaxed ? "bg-amber-50 border-amber-200" : "bg-primary/5 border-primary/50 shadow-sm" 
                                : "bg-transparent border-neutral-100 dark:border-neutral-800 hover:border-primary/50 hover:bg-primary/5"
                            }`}
                          >
                            <div className="flex flex-col items-start text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold capitalize">{v.measurement_value} {v.measurement_unit}</span>
                                {cartItem && (
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-black animate-in zoom-in ${
                                    isMaxed ? "bg-amber-500 text-white" : "bg-primary text-primary-foreground"
                                  }`}>
                                    {isMaxed ? "MAX" : cartItem.quantity}
                                  </span>
                                )}
                              </div>
                              <span className="text-[8px] text-neutral-400 font-medium uppercase tracking-wider">
                                {isOutOfStock ? "Out of Stock" : `${v.stock_quantity} in stock`}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] font-bold text-primary">{formatKsh(v.price)}</span>
                          </button>
                          
                          {cartItem && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(v.id, cartItem.quantity - 1);
                                if (cartItem.quantity === 1) removeItem(v.id);
                              }}
                              className="absolute -left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-red-500 shadow-md hover:scale-110 active:scale-90 transition-all z-10"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Sticky Sidebar Cart (Visible on desktop) */}
      <aside className="hidden lg:flex w-80 2xl:w-96 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex-col h-full sticky top-0">
        <CartUI isSidebar={true} />
      </aside>

      {/* Mobile Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-950 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
            <CartUI isSidebar={false} />
          </div>
        </div>
      )}
    </div>
  );
}
