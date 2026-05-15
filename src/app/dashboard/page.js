"use client";

import * as React from "react";
import useSWR from "swr";
import { fetcher, productService } from "@/domain/api/product-service";
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Calendar, 
  DollarSign, 
  ArrowRight,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [isPrivacyMode, setIsPrivacyMode] = React.useState(true);
  const timerRef = React.useRef(null);

  const { data, isLoading, mutate, error } = useSWR(productService.getStats(), fetcher, {
    refreshInterval: 30000 // Refresh every 30 seconds
  });

  // Handle Privacy Mode Toggle with Auto-Blur Timer
  const togglePrivacy = () => {
    setIsPrivacyMode(prev => {
      const nextValue = !prev;
      
      // Clear existing timer
      if (timerRef.current) clearTimeout(timerRef.current);
      
      // If unblurring, set a timer to re-blur after 10 seconds
      if (!nextValue) {
        timerRef.current = setTimeout(() => {
          setIsPrivacyMode(true);
        }, 10000);
      }
      
      return nextValue;
    });
  };

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const stats = data?.data || {
    dailyRevenue: 0,
    monthlyRevenue: 0,
    topProducts: []
  };

  const formatKsh = (val) => {
    return "KSh " + new Intl.NumberFormat('en-US').format(val);
  };

  const Value = ({ children, className = "" }) => (
    <span className={`transition-all duration-500 ${isPrivacyMode ? "blur-[8px] select-none opacity-50" : "blur-0"} ${className}`}>
      {children}
    </span>
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-6">
        <div className="p-4 rounded-full bg-red-50 dark:bg-red-950/20 text-red-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Failed to load statistics</h2>
        <p className="text-neutral-500 text-sm max-w-xs">Please check if the backend API is running correctly.</p>
        <button 
          onClick={() => mutate()} 
          className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
            Performance Overview
          </h1>
          <p className="text-neutral-500 text-sm font-medium">Real-time statistics for Organic Precisions</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={togglePrivacy}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all font-bold text-xs ${
              isPrivacyMode 
                ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400" 
                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
            }`}
          >
            {isPrivacyMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {isPrivacyMode ? "Show Values" : "Hide Values"}
          </button>
          
          <button 
            onClick={() => mutate()} 
            className="p-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Daily Revenue Card */}
        <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase opacity-80">Today's Revenue</span>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-black tracking-tighter">
                {isLoading ? "---" : <Value>{formatKsh(stats.dailyRevenue)}</Value>}
              </p>
              <p className="text-xs font-medium opacity-60">Generated in the last 24 hours</p>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Card */}
        <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase text-neutral-400">Monthly Revenue</span>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-black tracking-tighter text-neutral-900 dark:text-white">
                {isLoading ? "---" : <Value>{formatKsh(stats.monthlyRevenue)}</Value>}
              </p>
              <p className="text-xs font-medium text-neutral-400">Total for current month</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="flex flex-col gap-3">
          <Link 
            href="/dashboard/sell"
            className="flex-1 flex items-center justify-between p-6 rounded-3xl bg-neutral-900 text-white hover:bg-neutral-800 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/10 group-hover:bg-primary transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold">Process Sale</p>
                <p className="text-[10px] opacity-60">Open Point of Sale</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Link>
          
          <Link 
            href="/dashboard/inventory"
            className="flex-1 flex items-center justify-between p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-primary group-hover:text-white transition-colors">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold">Inventory</p>
                <p className="text-[10px] opacity-60 text-neutral-400">Manage Stock Levels</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Link>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xl">
        <div className="p-8 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="font-black tracking-tight">Today's Best Sellers</h2>
          </div>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-neutral-400 italic">
              <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-20" />
              <p className="text-sm">Fetching performance data...</p>
            </div>
          ) : stats.topProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="text-neutral-400 italic text-sm">No sales recorded today yet.</p>
              <Link href="/dashboard/sell" className="text-primary font-bold text-xs hover:underline">
                Start selling to see stats →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3 text-right">Units Sold</th>
                    <th className="px-4 py-3 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
                  {stats.topProducts.map((product, idx) => (
                    <tr key={idx} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-500">
                            #{idx + 1}
                          </div>
                          <span className="font-bold text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-xs">
                          <Value>{product.total_sold}</Value>
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex items-center gap-1 text-green-500 text-[10px] font-bold">
                          <TrendingUp className="w-3 h-3" />
                          +{(100 - idx * 10)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
