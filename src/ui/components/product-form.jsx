"use client";

import * as React from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { productService } from "@/domain/api/product-service";
import { toast } from "sonner";
import { ConfirmationModal } from "@/ui/components/confirmation-modal";

/**
 * Product Form for creating or editing products and their variants.
 * Handles unified product creation as required by the API.
 */
export function ProductForm({ product, onClose, onSuccess }) {
  const [product_name, setProductName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [variants, setVariants] = React.useState([
    { measurement_unit: "", measurement_value: "", price: "", stock_quantity: 0 }
  ]);
  const [loading, setLoading] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // Initialize state with product data when editing
  React.useEffect(() => {
    if (product) {
      setProductName(product.name || "");
      setCategory(product.category || "");
      setDescription(product.description || "");
      if (product.variants && product.variants.length > 0) {
        // Map variants to ensure no undefined values (prevents controlled/uncontrolled warning)
        const sanitizedVariants = product.variants.map(v => ({
          id: v.id,
          measurement_unit: v.measurement_unit || "",
          measurement_value: v.measurement_value || "",
          price: v.price || 0,
          stock_quantity: v.stock_quantity || 0
        }));
        setVariants(sanitizedVariants);
      }
    }
  }, [product]);

  const handleAddVariant = () => {
    setVariants([...variants, { measurement_unit: "", measurement_value: "", price: "", stock_quantity: 0 }]);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    const isNumeric = ['price', 'stock_quantity', 'measurement_value'].includes(field);
    newVariants[index][field] = isNumeric ? parseFloat(value) || value : value;
    setVariants(newVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure we pass variant_id for existing variants to retain details
      const formattedVariants = variants.map(v => ({
        variant_id: v.id, // backend expects variant_id
        measurement_unit: v.measurement_unit,
        measurement_value: v.measurement_value,
        price: v.price,
        stock_quantity: v.stock_quantity
      }));

      const payload = { product_name, category, description, variants: formattedVariants };
      let result;
      
      if (product?.id) {
        result = await productService.updateProduct(product.id, payload);
      } else {
        result = await productService.createProduct(payload);
      }

      if (result.status === "success" || result.message.includes("successfully")) {
        toast.success(product ? "Product updated successfully" : "Product created successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(result.message || "Operation failed.");
      }
    } catch (err) {
      toast.error("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!product?.id) return;
    
    setLoading(true);
    try {
      const result = await productService.deleteProduct(product.id);
      if (result.status === "success" || result.message.includes("successfully")) {
        toast.success("Product deleted successfully");
        setIsDeleteModalOpen(false);
        onSuccess();
        onClose();
      } else {
        toast.error(result.message || "Delete failed.");
      }
    } catch (err) {
      toast.error("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete ${product_name}? This will remove all associated variants and cannot be undone.`}
        isLoading={loading}
      />

      <div className="w-full max-w-2xl bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {product ? "Edit Product" : "New Organic Product"}
            </h2>
            {product && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors group flex items-center gap-2"
                title="Delete Product"
              >
                <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-wider">Delete</span>
              </button>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Product Name</label>
              <input
                required
                value={product_name}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="e.g. Pure Organic Honey"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Category</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer font-medium"
              >
                <option value="">Select Category</option>
                <option value="Human Sector">Human Sector</option>
                <option value="Farm Sector">Farm Sector</option>
                <option value="Animal Sector">Animal Sector</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Product Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px] resize-none"
              placeholder="Tell us more about this organic product..."
            />
          </div>

          {/* Variants Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">Variants (Sizes, Weights, etc.)</label>
              <button 
                type="button" 
                onClick={handleAddVariant}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Add Variant
              </button>
            </div>
            
            <div className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className="p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 space-y-4 relative group">
                  {variants.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveVariant(i)}
                      className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-neutral-400">Measurement Value</label>
                      <input
                        required
                        value={v.measurement_value}
                        onChange={(e) => handleVariantChange(i, 'measurement_value', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-sm"
                        placeholder="e.g. 500, 1, 250"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-neutral-400">Measurement Unit</label>
                      <select
                        required
                        value={v.measurement_unit}
                        onChange={(e) => handleVariantChange(i, 'measurement_unit', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-sm appearance-none cursor-pointer"
                      >
                        <option value="">Select Unit</option>
                        <option value="kg">kg</option>
                        <option value="grams">grams</option>
                        <option value="pcs">pcs</option>
                        <option value="litre">litre</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-neutral-400">Price (KSh)</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={v.price}
                        onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-neutral-400">Stock Quantity</label>
                      <input
                        required
                        type="number"
                        value={v.stock_quantity}
                        onChange={(e) => handleVariantChange(i, 'stock_quantity', e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
