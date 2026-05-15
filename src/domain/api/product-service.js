/**
 * Product Service for interacting with the Organic Precisions API.
 * Handles fetching, selling, and stock management.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const productService = {
  // Get all products with variants
  getProducts: () => `${API_BASE_URL}/products`,

  // Create a new product with variants
  createProduct: async (productData) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    return res.json();
  },

  // Sell items (Shopping Cart)
  sellItems: async (items) => {
    const res = await fetch(`${API_BASE_URL}/sales/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
    return res.json();
  },

  // Get Analytics Stats
  getStats: () => `${API_BASE_URL}/sales/stats`,

  // Update stock level
  updateStock: async (stockData) => {
    const res = await fetch(`${API_BASE_URL}/products/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stockData),
    });
    return res.json();
  },

  // Edit an existing product
  updateProduct: async (id, productData) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    return res.json();
  },

  // Delete a product
  deleteProduct: async (id) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
};
