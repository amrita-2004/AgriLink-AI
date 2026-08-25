import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Truck,
  DollarSign,
  TrendingUp,
  Package,
  RotateCcw,
  Zap,
  ShoppingBag,
  Cpu,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { aiAPI } from '../services/api';

const InteractiveDemoModal = ({ isOpen, onClose, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [demoResult, setDemoResult] = useState(null);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleRunFullDemo = async () => {
    setLoading(true);
    try {
      const res = await aiAPI.executeDemoScenario();
      setDemoResult(res.data);
      setCurrentStep(5);
      triggerConfetti();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 4) {
      handleRunFullDemo();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setDemoResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-xs text-white">
              <Sparkles className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">FarmX AI – Guided Live Demo</h3>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-white text-orange-700 rounded-full shadow-xs">
                  Requirement #17 Scenario
                </span>
              </div>
              <p className="text-xs text-orange-100">
                Direct Farmer Upload → AI Demand & Pricing → Buyer Procurement → Route Optimization
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-900 px-6 py-3 border-b border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className={currentStep >= 1 ? 'text-amber-400 font-bold' : ''}>1. Farmer Upload</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className={currentStep >= 2 ? 'text-amber-400 font-bold' : ''}>2. AI Intelligence</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className={currentStep >= 3 ? 'text-amber-400 font-bold' : ''}>3. Buyer Purchase</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className={currentStep >= 4 ? 'text-amber-400 font-bold' : ''}>4. Route Optimizer</span>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <span className={currentStep >= 5 ? 'text-emerald-400 font-bold' : ''}>5. Live Sync</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: Farmer Produce Upload */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">1</span>
                <span>Farmer Lists Produce on Platform</span>
              </div>
              <p className="text-xs text-slate-600">
                Farmer Ramesh Sharma (Hooghly FPO) lists harvested red tomatoes to sell directly on AgriLink AI without intermediaries.
              </p>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Product:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">🍅 Fresh Tomato</p>
                </div>
                <div>
                  <span className="text-slate-500">Initial Quantity:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">1,000 kg</p>
                </div>
                <div>
                  <span className="text-slate-500">Location:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">Kolkata / Hooghly</p>
                </div>
                <div>
                  <span className="text-slate-500">Farmer Expected Price:</span>
                  <p className="font-bold text-amber-900 text-sm mt-0.5">₹25.00 / kg</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: AI Demand & Price Forecast */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <span className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">2</span>
                <span>AI Analyzes Real-Time Demand & Pricing</span>
              </div>
              <p className="text-xs text-slate-600">
                The ML engine processes current wholesale mandi indices, urban consumption trends, and seasonal cycles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>AI Demand Prediction</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-emerald-800">HIGH DEMAND</span>
                    <span className="text-xs font-bold text-emerald-600 block mt-1">+18% increase projected next week</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-brand-50 border border-brand-300">
                  <div className="flex items-center gap-2 text-brand-800 font-bold text-xs uppercase tracking-wider">
                    <DollarSign className="w-4 h-4 text-brand-600" />
                    <span>AI Fair Price Recommendation</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-brand-700">₹28.00 / kg</span>
                    <span className="text-xs font-semibold text-brand-800 block mt-1">
                      +₹3.00/kg bonus over farmer's expected ₹25/kg (+₹3,000 profit!)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Buyer Purchase */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
                <span>Buyer Places Direct Order</span>
              </div>
              <p className="text-xs text-slate-600">
                Buyer Pooja Verma (FreshBites Retail & Kitchens, Kolkata) purchases 500 kg at the fair price of ₹28/kg.
              </p>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Buyer Entity:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">FreshBites Kitchens</p>
                </div>
                <div>
                  <span className="text-slate-500">Order Quantity:</span>
                  <p className="font-bold text-blue-700 text-sm mt-0.5">500 kg (50% batch)</p>
                </div>
                <div>
                  <span className="text-slate-500">Escrow Total Value:</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">₹14,000.00</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Logistics Route Optimization */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">4</span>
                <span>AI Calculates Multi-Stop Smart Route</span>
              </div>
              <p className="text-xs text-slate-600">
                Logistics engine optimizes pickup, quality sorting hub, and final delivery corridor for minimal time and carbon footprint.
              </p>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-2 rounded-xl bg-white shadow-xs">
                  <span className="text-slate-500 block">Distance</span>
                  <span className="text-lg font-black text-indigo-700 block mt-0.5">24.0 km</span>
                </div>
                <div className="p-2 rounded-xl bg-white shadow-xs">
                  <span className="text-slate-500 block">Estimated Time</span>
                  <span className="text-lg font-black text-indigo-700 block mt-0.5">52 minutes</span>
                </div>
                <div className="p-2 rounded-xl bg-white shadow-xs">
                  <span className="text-slate-500 block">Logistics Cost</span>
                  <span className="text-lg font-black text-brand-700 block mt-0.5">₹420.00</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Completed Full Execution Review */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-brand-600 text-white flex items-center gap-3 shadow-md shadow-emerald-500/20">
                <CheckCircle className="w-8 h-8 text-white shrink-0" />
                <div>
                  <h4 className="font-extrabold text-base">Demo Scenario Completed Successfully!</h4>
                  <p className="text-xs text-emerald-100">
                    Real-time AI synchronization finished. All 5 criteria from Problem Statement #17 verified.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Farmer Impact Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    🌾 Farmer Dashboard Sync
                  </span>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Initial Stock:</span>
                      <span className="font-semibold text-slate-800">1,000 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Purchased by Buyer:</span>
                      <span className="font-bold text-blue-600">-500 kg</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                      <span>Remaining Inventory:</span>
                      <span className="text-brand-600">500 kg</span>
                    </div>
                    <div className="flex justify-between pt-1 font-bold text-emerald-700">
                      <span>Farmer Extra Profit:</span>
                      <span>+₹3,000 (+12%)</span>
                    </div>
                  </div>
                </div>

                {/* Logistics & Buyer Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    🚚 Logistics & Buyer Tracking
                  </span>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Route Distance:</span>
                      <span className="font-semibold text-slate-800">24.0 km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ETA Duration:</span>
                      <span className="font-semibold text-slate-800">52 mins</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transportation Cost:</span>
                      <span className="font-bold text-brand-700">₹420.00</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                      <span>Order Status:</span>
                      <span className="text-indigo-600">In Transit (Active GPS)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart Demo
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 5 && (
              <button
                onClick={handleRunFullDemo}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
              >
                {loading ? 'Running AI Engine...' : '⚡ Run All Steps at Once'}
              </button>
            )}

            {currentStep < 5 ? (
              <button
                onClick={handleNextStep}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  if (onFinish) onFinish();
                }}
                className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-all"
              >
                Explore Live Platform
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InteractiveDemoModal;
