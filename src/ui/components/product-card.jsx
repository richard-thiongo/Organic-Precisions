"use client";

import * as React from "react";
import { Package, Tag, Layers, TrendingUp } from "lucide-react";

/**
 * A responsive product card component to display product details and its variants.
 * Replaces traditional tables for a more modern, mobile-friendly look.
 */
export function ProductCard({ product, onEdit, onAddStock }) {
  const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock_quantity || 0), 0) || 0;
  const priceRange = product.variants?.length > 0 
    ? {
        min: Math.min(...product.variants.map(v => v.price)),
        max: Math.max(...product.variants.map(v => v.price))
      }
    : null;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 transition-all hover:shadow-xl hover:border-primary/30">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            {product.name}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 uppercase tracking-widest font-semibold">
            {product.category || "General"}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
          totalStock > 20 
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
            : totalStock > 0 
            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          <Layers className="w-3 h-3" />
          {totalStock} in stock
        </div>
      </div>

      {/* Price Summary */}
      <div className="flex items-center gap-2 mb-6">
        <Tag className="w-4 h-4 text-primary" />
        <span className="text-2xl font-bold text-primary">
          {priceRange 
            ? priceRange.min === priceRange.max 
              ? `KSh ${priceRange.min.toFixed(2)}`
              : `KSh ${priceRange.min.toFixed(2)} - KSh ${priceRange.max.toFixed(2)}`
            : "N/A"
          }
        </span>
      </div>

      {/* Variants List (Mini Cards) */}
      <div className="space-y-3 mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Variants</p>
        <div className="grid grid-cols-1 gap-2">
          {product.variants?.map((v, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
              <div className="flex flex-col">
                <span className="text-sm font-bold capitalize">{v.measurement_value} {v.measurement_unit}</span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-tighter">Variant #{i + 1}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono font-bold">KSh {v.price.toFixed(2)}</span>
                <div className="text-xs font-semibold text-neutral-400">{v.stock_quantity} pcs</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button 
          onClick={() => onAddStock?.(product)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-primary/10 text-primary font-bold text-sm transition-all hover:bg-primary/20 active:scale-95"
        >
          <TrendingUp className="w-4 h-4" />
          Restock
        </button>
        <button 
          onClick={() => onEdit?.(product)}
          className="px-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 font-bold text-sm transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
