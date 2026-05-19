"use client";

import * as React from "react";
import { productService } from "@/domain/api/product-service";
import { 
  Calendar, 
  Search, 
  DollarSign, 
  ShoppingBag, 
  Loader2, 
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function AnalyticsPage() {
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [reportData, setReportData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [expandedSale, setExpandedSale] = React.useState(null);

  const formatKsh = (val) => "KSh " + new Intl.NumberFormat("en-US").format(val);
  const formatDate = (isoString) => new Date(isoString).toLocaleString();

  const handleGenerateReport = async () => {
    if (!startDate) {
      setError("Please select at least a Start Date.");
      return;
    }
    
    // If no end date is selected, assume it's a single day report
    const finalEndDate = endDate || startDate;

    // Simple validation
    if (new Date(startDate) > new Date(finalEndDate)) {
      setError("Start date cannot be after end date.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const res = await productService.getReports(startDate, finalEndDate);
      
      if (res.status === "success") {
        setReportData(res.data);
      } else {
        setError(res.message || "Failed to generate report.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the report.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent flex items-center gap-3">
          <FileText className="text-primary w-8 h-8" />
          Sales Reports
        </h1>
        <p className="text-neutral-500 text-sm font-medium">
          Generate manual sales reports for specific date ranges
        </p>
      </div>

      {/* Date Selection Card */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <button 
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          {isLoading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {/* Results Section */}
      {reportData && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold tracking-widest uppercase opacity-80">Total Revenue</span>
                </div>
                <p className="text-4xl font-black tracking-tighter">
                  {formatKsh(reportData.totalRevenue)}
                </p>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl relative overflow-hidden">
               <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
               <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-primary">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold tracking-widest uppercase text-neutral-400">Transactions</span>
                </div>
                <p className="text-4xl font-black tracking-tighter">
                  {reportData.totalSalesCount}
                </p>
              </div>
            </div>
          </div>

          {/* Sales Records Table */}
          <div className="bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-black text-lg">Transaction History</h3>
            </div>
            
            {reportData.salesRecords.length === 0 ? (
              <div className="p-12 text-center text-neutral-400 font-medium">
                No sales found for this date range.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {reportData.salesRecords.map((sale) => {
                  const isExpanded = expandedSale === sale.sale_id;
                  
                  return (
                    <div key={sale.sale_id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      {/* Sale Header (Clickable) */}
                      <div 
                        onClick={() => setExpandedSale(isExpanded ? null : sale.sale_id)}
                        className="p-4 md:px-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-bold">Transaction #{sale.sale_id}</p>
                            <p className="text-sm text-neutral-600 dark:text-white font-medium">{formatDate(sale.sale_date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-neutral-100 dark:border-neutral-800">
                          <div className="text-sm text-neutral-500 font-medium">
                            {sale.items.length} item{sale.items.length > 1 ? 's' : ''}
                          </div>
                          <div className="font-black text-primary bg-primary/10 px-4 py-2 rounded-xl">
                            {formatKsh(sale.total_amount)}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Items Details */}
                      {isExpanded && (
                        <div className="px-4 md:px-16 pb-6 pt-2 bg-neutral-50/50 dark:bg-neutral-950/50 animate-in fade-in slide-in-from-top-2">
                          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-x-auto bg-white dark:bg-neutral-900">
                            <table className="w-full text-left text-sm min-w-[400px]">
                              <thead className="bg-neutral-50 dark:bg-neutral-950 text-xs uppercase tracking-widest text-neutral-400 font-bold border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                  <th className="px-4 py-3">Product</th>
                                  <th className="px-4 py-3">Qty</th>
                                  <th className="px-4 py-3 text-right">Price</th>
                                  <th className="px-4 py-3 text-right">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {sale.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td className="px-4 py-3">
                                      <p className="font-bold">{item.product_name}</p>
                                      <p className="text-[10px] text-neutral-500">{item.variant_details}</p>
                                    </td>
                                    <td className="px-4 py-3 font-medium">x{item.quantity}</td>
                                    <td className="px-4 py-3 text-right text-neutral-500">{formatKsh(item.unit_price)}</td>
                                    <td className="px-4 py-3 text-right font-bold">{formatKsh(item.subtotal)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
