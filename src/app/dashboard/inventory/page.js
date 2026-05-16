"use client";

import * as React from "react";
import useSWR from "swr";
import { fetcher, productService } from "@/domain/api/product-service";
import { ProductCard } from "@/ui/components/product-card";
import { ProductForm } from "@/ui/components/product-form";
import { Plus, Search, Loader2, PackageX } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Inventory Page displaying all products and their variants.
 * Uses SWR for intelligent caching and revalidation.
 */
export default function InventoryPage() {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR(productService.getProducts(), fetcher);
  const [search, setSearch] = React.useState("");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [activeCategory, setActiveCategory] = React.useState("All");

  const categories = ["All", "Human Sector", "Farm Sector", "Animal Sector"];

  const products = data?.data || [];
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  return (
    <div className="relative min-h-screen">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-900 shadow-sm animate-in slide-in-from-top duration-500">
        <div className="max-w-7xl mx-auto p-4 lg:px-8 lg:py-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold tracking-tight">Inventory</h1>
              <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Organic Precisions Shop</p>
            </div>
            <button 
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              New Product
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-6 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight whitespace-nowrap transition-all border ${
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
      </div>

      <div className="p-8 max-w-7xl mx-auto">

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-neutral-500 font-medium italic">Harvesting your data...</p>
        </div>
      ) : error ? (
        <div className="p-12 rounded-3xl border border-red-200 bg-red-50 text-red-700 text-center dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400">
          <h3 className="text-lg font-bold mb-2">Connection Error</h3>
          <p>We couldn't reach the backend API. Please ensure the server is running on port 5000.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 grayscale opacity-50">
          <PackageX className="w-16 h-16" />
          <div>
            <h3 className="text-xl font-bold">No products found</h3>
            <p className="text-neutral-500">Try adjusting your search or add a new product.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onEdit={() => handleOpenEdit(product)}
              onAddStock={() => router.push(`/dashboard/stock?highlight=${product.id}`)}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <ProductForm 
          product={editingProduct} 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => mutate()} 
        />
      )}
      </div>
    </div>
  );
}
