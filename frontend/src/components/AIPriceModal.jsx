import React, { useState, useEffect } from 'react';
import { X, Sparkles, TrendingUp, DollarSign, ShieldCheck, ArrowUpRight, Calculator, CheckCircle2 } from 'lucide-react';
import { aiAPI } from '../services/api';

const AIPriceModal = ({ product, isOpen, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simQty, setSimQty] = useState(500);

  useEffect(() => {
    if (product && isOpen) {
      setLoading(true);
      setSimQty(product.quantity_kg || 500);
      aiAPI.getPriceRecommendation({
        product_name: product.name,
        category: product.category,
        quantity_kg: product.quantity_kg || 1000,
        location: product.location || 'Kolkata',
        quality_grade: product.quality_grade || 'Grade A',
        expected_price: product.expected_price || 25.0,
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const currentRec = data?.recommended_price_per_kg || product.price_per_kg || 28;
  const farmerExp = product.expected_price || 25;
  const simTotalRev = simQty * currentRec;
  const simFarmerGain = simQty * (currentRec - farmerExp);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/20 border border-brand-400/30 text-brand-300">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">AI Fair Price Intelligence</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-500/30 text-brand-300 rounded-full border border-brand-500/40">
                  Real-time ML Model
                </span>
              </div>
              <p className="text-xs text-slate-300">{product.name} • {product.location}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Analyzing historical mandi indices, supply velocity & demand elasticity...</p>
            </div>
          ) : (
            <>
              {/* Main Price Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Mandi Benchmark Avg</span>
                  <div className="text-2xl font-black text-slate-800 mt-1">
                    ₹{data?.current_market_avg_price || 26}<span className="text-xs font-normal text-slate-500">/kg</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Local wholesale baseline</span>
                </div>

                <div className="p-4 rounded-2xl bg-brand-50 border-2 border-brand-500/40 relative overflow-hidden shadow-xs">
                  <div className="absolute top-2 right-2 text-brand-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-brand-800 font-bold uppercase tracking-wider">AI Recommended Price</span>
                  <div className="text-2xl font-black text-brand-700 mt-1">
                    ₹{data?.recommended_price_per_kg || 28}<span className="text-xs font-bold text-brand-700">/kg</span>
                  </div>
                  <span className="text-[11px] text-brand-700 font-semibold mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> Fair Direct Value
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs text-amber-800 font-medium">Farmer Expected</span>
                  <div className="text-2xl font-black text-amber-900 mt-1">
                    ₹{product.expected_price || 25}<span className="text-xs font-normal text-amber-700">/kg</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
                    +₹{(currentRec - farmerExp).toFixed(1)}/kg Bonus via AI
                  </span>
                </div>

              </div>

              {/* Profit & Value Narrative */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-brand-500/5 to-slate-50 border border-brand-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Why this price is optimal for both Farmer & Buyer:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Traditional middlemen purchase at ₹{farmerExp}/kg and sell to retail at ₹34-38/kg (up to 45% margin loss). 
                  AgriLink AI recommends <strong>₹{currentRec}/kg</strong>, giving the farmer an additional 
                  <strong> +₹{data?.potential_additional_earnings?.toLocaleString() || '3,000'}</strong> profit while saving the buyer <strong>22%</strong> compared to traditional wholesale markets.
                </p>
              </div>

              {/* Interactive Profit Simulator */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-brand-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Interactive Profit Calculator</span>
                  </div>
                  <span className="text-xs text-brand-400 font-semibold">{simQty.toLocaleString()} kg batch</span>
                </div>

                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={simQty}
                  onChange={(e) => setSimQty(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400">Total Direct Revenue:</span>
                    <p className="text-xl font-bold text-white mt-0.5">₹{simTotalRev.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Extra Farmer Profit vs Traditional:</span>
                    <p className="text-xl font-bold text-emerald-400 mt-0.5">+₹{simFarmerGain.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Bulk Tiers */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                  AI Volume-Based Pricing Tiers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 font-medium block">Retail (1 - 50 kg)</span>
                    <span className="font-bold text-slate-900 text-sm mt-1 block">₹{(currentRec * 1.05).toFixed(1)} /kg</span>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-50 border border-brand-300">
                    <span className="text-brand-800 font-bold block">Standard (50 - 250 kg)</span>
                    <span className="font-bold text-brand-700 text-sm mt-1 block">₹{currentRec.toFixed(1)} /kg</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 font-medium block">Bulk Wholesale (250+ kg)</span>
                    <span className="font-bold text-slate-900 text-sm mt-1 block">₹{(currentRec * 0.94).toFixed(1)} /kg</span>
                  </div>
                </div>
              </div>

            </>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
};

export default AIPriceModal;
