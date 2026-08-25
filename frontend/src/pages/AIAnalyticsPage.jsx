import React, { useState, useEffect } from 'react';
import {
  Cpu,
  TrendingUp,
  DollarSign,
  Truck,
  Sparkles,
  Zap,
  Calendar,
  MapPin,
  ShieldCheck,
  Play,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { aiAPI } from '../services/api';
import LeafletMap from '../components/LeafletMap';

const AIAnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('forecast'); // 'forecast', 'pricing', 'route'

  // Tab 1: Forecast Simulator State
  const [fcProduct, setFcProduct] = useState('Tomato');
  const [fcCategory, setFcCategory] = useState('Vegetables');
  const [fcLocation, setFcLocation] = useState('Kolkata');
  const [fcMonth, setFcMonth] = useState(8);
  const [fcResult, setFcResult] = useState(null);
  const [fcLoading, setFcLoading] = useState(false);

  // Tab 2: Pricing Simulator State
  const [prProduct, setPrProduct] = useState('Tomato');
  const [prCategory, setPrCategory] = useState('Vegetables');
  const [prQty, setPrQty] = useState(1000);
  const [prGrade, setPrGrade] = useState('Grade A');
  const [prExpected, setPrExpected] = useState(25);
  const [prLocation, setPrLocation] = useState('Kolkata');
  const [prResult, setPrResult] = useState(null);
  const [prLoading, setPrLoading] = useState(false);

  // Tab 3: Route Optimizer State
  const [rtOrigin, setRtOrigin] = useState('Hooghly Farmer Cooperative, Hooghly');
  const [rtDest, setRtDest] = useState('Central Kitchens Hub, Salt Lake Kolkata');
  const [rtWeight, setRtWeight] = useState(500);
  const [rtResult, setRtResult] = useState(null);
  const [rtLoading, setRtLoading] = useState(false);

  // Initial loads
  useEffect(() => {
    runForecastSimulation();
    runPricingSimulation();
    runRouteSimulation();
  }, []);

  const runForecastSimulation = async () => {
    setFcLoading(true);
    try {
      const res = await aiAPI.getForecast({
        product_name: fcProduct,
        category: fcCategory,
        location: fcLocation,
        current_month: Number(fcMonth),
      });
      setFcResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFcLoading(false);
    }
  };

  const runPricingSimulation = async () => {
    setPrLoading(true);
    try {
      const res = await aiAPI.getPriceRecommendation({
        product_name: prProduct,
        category: prCategory,
        quantity_kg: Number(prQty),
        location: prLocation,
        quality_grade: prGrade,
        expected_price: Number(prExpected),
      });
      setPrResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setPrLoading(false);
    }
  };

  const runRouteSimulation = async () => {
    setRtLoading(true);
    try {
      const res = await aiAPI.getRouteOptimization({
        origin: { name: rtOrigin, lat: 22.8953, lng: 88.4026 },
        destination: { name: rtDest, lat: 22.5726, lng: 88.3639 },
        package_weight_kg: Number(rtWeight),
      });
      setRtResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRtLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
          <Cpu className="w-3.5 h-3.5" /> AI Predictive Intelligence Lab
        </div>
        <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
          FramX AI Machine Learning Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Test and simulate the three core artificial intelligence models: Demand Forecasting, Dynamic Fair Price Optimization, and Multi-Stop Route Planning.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('forecast')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'forecast'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> 1. Demand Forecasting Model
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pricing'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" /> 2. Fair Price Recommender
        </button>

        <button
          onClick={() => setActiveTab('route')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'route'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" /> 3. Smart Route Optimizer
        </button>
      </div>

      {/* TAB 1: DEMAND FORECASTING */}
      {activeTab === 'forecast' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Controls Bar */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Crop / Produce</label>
              <select
                value={fcProduct}
                onChange={(e) => setFcProduct(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              >
                <option value="Tomato">Fresh Tomato</option>
                <option value="Potato">Gold Potato</option>
                <option value="Onion">Red Onion</option>
                <option value="Mango">Alphonso Mango</option>
                <option value="Basmati Rice">Basmati Rice</option>
                <option value="Milk">A2 Cow Milk</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Category</label>
              <select
                value={fcCategory}
                onChange={(e) => setFcCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Rice">Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Dairy">Dairy</option>
                <option value="Spices">Spices</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Consumption Hub</label>
              <select
                value={fcLocation}
                onChange={(e) => setFcLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              >
                <option value="Kolkata">Kolkata Metro</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Nashik">Nashik</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Forecast Month</label>
              <select
                value={fcMonth}
                onChange={(e) => setFcMonth(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              >
                <option value={8}>August (Late Monsoon / Festival Prep)</option>
                <option value={9}>September (Durga Puja / Navratri Spike)</option>
                <option value={10}>October (Diwali / Post-Harvest)</option>
                <option value={11}>November (Winter Season Starts)</option>
              </select>
            </div>

            <button
              onClick={runForecastSimulation}
              disabled={fcLoading}
              className="py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-md shadow-brand-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Run Prediction
            </button>
          </div>

          {/* Forecast Output Cards */}
          {fcResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Key Predictions (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">Demand Classification</span>
                    <span className="px-2.5 py-1 text-xs font-black bg-emerald-100 text-emerald-800 rounded-full">
                      {fcResult.demand_level}
                    </span>
                  </div>

                  <div>
                    <span className="text-3xl font-black text-slate-900">+{fcResult.predicted_growth_percent}%</span>
                    <span className="text-xs text-emerald-700 font-bold block mt-1">Projected 7-Day Velocity Surge</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Model Confidence Score:</span>
                      <span className="font-bold text-slate-900">{fcResult.confidence_score}%</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Recommended Safety Stock:</span>
                      <span className="font-bold text-brand-700">{fcResult.recommended_stock_kg?.toLocaleString()} kg</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 text-slate-700 text-xs leading-relaxed border border-slate-200">
                    {fcResult.summary_text}
                  </div>
                </div>

                {/* Key ML Drivers */}
                <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xs space-y-3 text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-400 block">
                    Top Contributing Factors
                  </span>
                  <ul className="space-y-2 text-slate-300">
                    {fcResult.key_factors?.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: 7-Day Predicted Demand Curve (8 cols) */}
              <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">7-Day Projected Demand Trajectory</h3>
                    <p className="text-xs text-slate-500">Normalized demand velocity curve indexed to mandi baseline</p>
                  </div>
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                    Live Time-Series
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={fcResult.time_series || []}>
                      <defs>
                        <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(val) => [`${val} Index`, 'Demand Velocity']}
                        contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="demand_index" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 2: PRICE RECOMMENDATION */}
      {activeTab === 'pricing' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Controls */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Produce</label>
              <select
                value={prProduct}
                onChange={(e) => setPrProduct(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              >
                <option value="Tomato">Fresh Tomato</option>
                <option value="Potato">Gold Potato</option>
                <option value="Mango">Alphonso Mango</option>
                <option value="Rice">Basmati Rice</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Quality Grade</label>
              <select
                value={prGrade}
                onChange={(e) => setPrGrade(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              >
                <option value="Grade A">Grade A (Premium)</option>
                <option value="Organic Premium">Organic Certified</option>
                <option value="Grade B">Grade B (Standard)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Harvest Quantity (kg)</label>
              <input
                type="number"
                value={prQty}
                onChange={(e) => setPrQty(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-amber-800">Expected Base Price (₹/kg)</label>
              <input
                type="number"
                value={prExpected}
                onChange={(e) => setPrExpected(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-amber-50 border border-amber-300 font-bold text-amber-900"
              />
            </div>

            <button
              onClick={runPricingSimulation}
              disabled={prLoading}
              className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-md shadow-amber-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Calculate Price
            </button>
          </div>

          {/* Pricing Output */}
          {prResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                  AI Recommendation & Farmer Gain
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-brand-50 border border-brand-300">
                    <span className="text-xs text-brand-800 font-bold uppercase">Recommended Selling Price</span>
                    <p className="text-3xl font-black text-brand-700 mt-1">₹{prResult.recommended_price_per_kg} <span className="text-xs font-normal">/kg</span></p>
                    <span className="text-[11px] text-brand-700 font-semibold mt-1 block">Fair direct-to-buyer rate</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Mandi Benchmark</span>
                    <p className="text-3xl font-black text-slate-800 mt-1">₹{prResult.current_market_avg_price} <span className="text-xs font-normal">/kg</span></p>
                    <span className="text-[11px] text-slate-400 mt-1 block">Local wholesale baseline</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 text-xs space-y-1 border border-emerald-200">
                  <span className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Total Extra Farmer Earnings:
                  </span>
                  <p className="text-xl font-black text-emerald-800">+₹{prResult.potential_additional_earnings?.toLocaleString()}</p>
                  <p className="text-[11px] text-emerald-700">{prResult.recommendation_summary}</p>
                </div>
              </div>

              <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 text-white shadow-xs space-y-4">
                <h3 className="font-bold text-base text-white border-b border-slate-800 pb-3">
                  AI Volume-Tiering Structure
                </h3>

                <div className="space-y-3">
                  {prResult.pricing_tiers?.map((tier, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{tier.tier}</p>
                        <p className="text-[11px] text-slate-400">Automated quantity discount curve</p>
                      </div>
                      <span className="text-lg font-black text-emerald-400">₹{tier.price_per_kg} / kg</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: ROUTE OPTIMIZATION */}
      {activeTab === 'route' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Controls */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Origin / Farm Gate</label>
              <input
                type="text"
                value={rtOrigin}
                onChange={(e) => setRtOrigin(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Destination / Buyer Facility</label>
              <input
                type="text"
                value={rtDest}
                onChange={(e) => setRtDest(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
              />
            </div>

            <button
              onClick={runRouteSimulation}
              disabled={rtLoading}
              className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" /> Calculate Multi-Stop Route
            </button>
          </div>

          {/* Route Output */}
          {rtResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Interactive Map (7 cols) */}
              <div className="lg:col-span-7 h-[380px] rounded-3xl overflow-hidden shadow-inner border border-slate-200">
                <LeafletMap stops={rtResult.stops || []} waypoints={rtResult.waypoints || []} activeStep={2} />
              </div>

              {/* Metrics & Stops (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Distance</span>
                    <span className="text-lg font-black text-slate-900 block mt-0.5">{rtResult.route_summary?.total_distance_km} km</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Transit ETA</span>
                    <span className="text-lg font-black text-slate-900 block mt-0.5">{rtResult.route_summary?.estimated_duration_minutes} mins</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-brand-50 border border-brand-300">
                    <span className="text-brand-800 font-bold block text-[10px]">Logistics Cost</span>
                    <span className="text-lg font-black text-brand-700 block mt-0.5">₹{rtResult.route_summary?.estimated_cost_inr}</span>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Waypoints & Consolidation Stops
                  </h4>
                  <div className="space-y-2 text-xs">
                    {rtResult.stops?.map((stop) => (
                      <div key={stop.stop_number} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {stop.stop_number}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{stop.name}</p>
                          <p className="text-[11px] text-slate-500">{stop.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AIAnalyticsPage;
