"use client";

import * as React from "react";
import useSWR from "swr";
import { fetcher, productService } from "@/domain/api/product-service";
import { TrendingUp, Plus, Minus, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

/**
 * Stock Management Page for quick inventory replenishment.
 * Allows users to update stock levels for specific variants.
 */
export default function StockPage() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const { data, isLoading, mutate } = useSWR(productService.getProducts(), fetcher);
  const [updates, setUpdates] = React.useState({});
  const [processing, setProcessing] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const products = data?.data || [];

  // Scroll to highlighted product
  React.useEffect(() => {
    if (highlightId && !isLoading) {
      const element = document.getElementById(`product-${highlightId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [highlightId, isLoading]);

  const handleUpdateChange = (variantId, amount) => {
    setUpdates(prev => ({
      ...prev,
      [variantId]: Math.max(0, (prev[variantId] || 0) + amount)
    }));
  };

  const handleSaveStock = async () => {
    const payload = Object.entries(updates)
      .filter(([_, amount]) => amount > 0)
      .map(([id, amount]) => ({ variant_id: parseInt(id), quantity: amount }));

    if (payload.length === 0) return;

    setProcessing(true);
    try {
      // Loop through and update (API takes one variant at a time based on docs or batch if supported)
      // Documentation says PATCH /api/products/stock with { variant_id, quantity }
      // I'll send them sequentially for simplicity or batch if API allows.
      // Based on docs, it seems to be one at a time.
      for (const item of payload) {
        await productService.updateStock(item);
      }
      
      setSuccess(true);
      toast.success("Inventory updated successfully");
      setUpdates({});
      mutate(); // Revalidate SWR cache
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error("Failed to update stock.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            Stock Replenishment
          </h1>
          <p className="text-neutral-500">Update stock levels when new shipments arrive.</p>
        </div>
        
        <button
          disabled={Object.keys(updates).length === 0 || processing}
          onClick={handleSaveStock}
          className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
            success 
              ? "bg-green-500 text-white" 
              : "bg-primary text-primary-foreground shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          }`}
        >
          {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : success ? <CheckCircle className="w-5 h-5" /> : "Save All Updates"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product) => {
            const isHighlighted = highlightId === String(product.id);
            return (
              <div 
                key={product.id} 
                id={`product-${product.id}`}
                className={`p-6 rounded-3xl bg-white dark:bg-neutral-900 border shadow-sm transition-all duration-1000 ${
                  isHighlighted 
                    ? "border-amber-400 ring-4 ring-amber-400/20 shadow-xl shadow-amber-400/10 scale-[1.02]" 
                    : "border-neutral-200 dark:border-neutral-800"
                }`}
              >
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  {product.name}
                  {isHighlighted && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase font-black">Target</span>}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.variants?.map((v) => (
                    <div key={v.id} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold capitalize">{v.measurement_value} {v.measurement_unit}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold text-neutral-400">Current:</span>
                        <span className={`text-xs font-bold ${v.stock_quantity < 10 ? "text-red-500" : "text-neutral-600"}`}>
                          {v.stock_quantity} pcs
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-1">
                        <button 
                          onClick={() => handleUpdateChange(v.id, -1)}
                          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input 
                          type="number"
                          value={updates[v.id] || 0}
                          onChange={(e) => setUpdates({...updates, [v.id]: parseInt(e.target.value) || 0})}
                          className="w-12 text-center font-bold bg-transparent focus:outline-none"
                        />
                        <button 
                          onClick={() => handleUpdateChange(v.id, 1)}
                          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {updates[v.id] > 0 && (
                        <div className="text-[10px] font-bold text-primary animate-pulse whitespace-nowrap">
                          +{updates[v.id]} New
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
