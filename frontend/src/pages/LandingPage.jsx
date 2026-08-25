import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  ShoppingBag,
  Cpu,
  Truck,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Sparkles,
  Users,
  CheckCircle2,
  BarChart3,
  Star,
  Award,
  ChevronRight,
  Leaf,
  Scale,
  Zap,
} from 'lucide-react';
import { productAPI, aiAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import AIPriceModal from '../components/AIPriceModal';
import { useAuth } from '../context/AuthContext';

const LandingPage = ({ onOpenDemoModal }) => {
  const navigate = useNavigate();
  const { quickSwitchRole } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    productAPI.getAll({ limit: 4 })
      .then((res) => setFeaturedProducts(res.data.slice(0, 4)))
      .catch((err) => console.error(err));

    aiAPI.getPlatformInsights()
      .then((res) => setInsights(res.data))
      .catch((err) => console.error(err));
  }, []);

  const openPriceModal = (product) => {
    setSelectedProduct(product);
    setIsPriceModalOpen(true);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-brand-50/70 via-emerald-50/30 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-300 text-brand-800 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Next-Gen Agricultural Digital Marketplace</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                <span className="text-emerald-700">AI Powered</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-slate-950 tracking-tight leading-[1.1]">
                From Farm to Market, <br />
                <span className="bg-gradient-to-r from-brand-700 via-emerald-600 to-brand-500 bg-clip-text text-transparent">
                  Without Unnecessary Middlemen.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                FramX AI connects farmers and FPOs directly with consumers, retailers, restaurants, and bulk buyers while using AI-powered demand forecasting, intelligent fair pricing, and smart logistics to create a fairer and more efficient agricultural supply chain.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => {
                    quickSwitchRole('farmer');
                    navigate('/farmer-dashboard');
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Sprout className="w-4 h-4" />
                  Sell Your Produce
                </button>

                <Link
                  to="/marketplace"
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-400" />
                  Buy Direct
                </Link>

                <button
                  onClick={onOpenDemoModal}
                  className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-sm shadow-md shadow-amber-500/25 hover:opacity-95 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  ⚡ 1-Click Demo
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Escrow-Secured Payments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  <span>AI Demand & Fair Pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Cold-Chain Optimized Routes</span>
                </div>
              </div>

            </div>

            {/* Right Live Teaser Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-slate-900 text-white p-6 shadow-2xl border border-slate-800 space-y-5">
                
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-400 ml-2">FramX AI Live Engine</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 animate-pulse">
                    Live Mandi Feed
                  </span>
                </div>

                {/* Example Live Forecast Teaser */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">🍅 Fresh Tomato (Hooghly FPO)</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-slate-950 rounded-full">
                      +18% Demand
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400">Traditional Mandi Price:</span>
                      <p className="text-base font-bold text-slate-300 line-through">₹22.00 /kg</p>
                    </div>
                    <div>
                      <span className="text-slate-400">FramX Fair Price:</span>
                      <p className="text-lg font-extrabold text-emerald-400">₹28.00 /kg</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
                    <span>Route: Hooghly → Salt Lake</span>
                    <span className="text-indigo-400 font-bold">24 km • 52 mins • ₹420</span>
                  </div>
                </div>

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Farmer Gain</span>
                    <span className="text-base font-bold text-emerald-400 mt-0.5 block">+18.2%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Buyer Savings</span>
                    <span className="text-base font-bold text-brand-400 mt-0.5 block">-24.0%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <span className="text-slate-400 block text-[10px]">Logistics ETA</span>
                    <span className="text-base font-bold text-indigo-400 mt-0.5 block">98.4% On-Time</span>
                  </div>
                </div>

                <button
                  onClick={onOpenDemoModal}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-brand-600/30"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Launch Interactive Scenario Demo
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THREE-PILLAR AI TECHNOLOGY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full">
            Core Technological Innovation
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900">
            Powered by 3 Intelligent Machine Learning Engines
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            FramX AI replaces guesswork and predatory cartels with predictive data science tailored for Indian and global agriculture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Demand Forecasting */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-400 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">1. AI Demand Forecasting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Analyzes multi-year mandi arrivals, regional consumption velocity, seasonal harvest calendars, and upcoming festival spikes to predict high vs low demand cycles.
              </p>
              <div className="p-3 rounded-xl bg-brand-50/70 border border-brand-200 text-xs text-brand-900 font-medium">
                "Tomato demand is expected to increase by 18% next week in Kolkata metro."
              </div>
            </div>
            <Link
              to="/ai-analytics"
              className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              Explore Forecasting Engine <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 2: Price Recommendation */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">2. AI Fair Price Recommendation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates fair prices considering real-time demand elasticity, quality grading (Grade A / Organic), harvest freshness, and middleman margin recovery.
              </p>
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 font-medium">
                "Recommended selling price: ₹28/kg (Potential +₹3,000 profit for 1000kg batch)."
              </div>
            </div>
            <Link
              to="/ai-analytics"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              Simulate Fair Pricing <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 3: Route Optimization */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">3. Multi-Stop Route Optimizer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Solves optimal vehicle routing from Farm Gate $\to$ Regional Quality & Cold Hub $\to$ Bulk Buyer, minimizing transit time, cost, and carbon emissions.
              </p>
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900 font-medium">
                "Distance: 24 km • Estimated Time: 52 mins • Transport Cost: ₹420."
              </div>
            </div>
            <Link
              to="/logistics"
              className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              View Logistics Simulator <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS (STEP-BY-STEP WORKFLOW) */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider bg-brand-950/80 px-3 py-1 rounded-full border border-brand-800/60">
              Transparent Digital Supply Chain
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              How FramX AI Works from Harvest to Delivery
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              End-to-end transparent transaction flow ensuring fair value, zero delayed payments, and fresh produce delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3 relative">
              <span className="w-7 h-7 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
              <h4 className="font-bold text-sm text-white">Farmer Lists Produce</h4>
              <p className="text-xs text-slate-400">
                Uploads harvest quantity, expected price, location, quality grade, and photos.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3 relative">
              <span className="w-7 h-7 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
              <h4 className="font-bold text-sm text-white">AI Suggests Fair Price</h4>
              <p className="text-xs text-slate-400">
                AI evaluates current demand trends and suggests the maximum profitable selling price.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3 relative">
              <span className="w-7 h-7 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center">3</span>
              <h4 className="font-bold text-sm text-white">Buyer Orders & Escrow</h4>
              <p className="text-xs text-slate-400">
                Buyer or restaurant orders directly. Payment is held safely in escrow.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3 relative">
              <span className="w-7 h-7 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center">4</span>
              <h4 className="font-bold text-sm text-white">Smart Route Logistics</h4>
              <p className="text-xs text-slate-400">
                Cold-chain route is optimized for pickup, hub quality check, and rapid dropoff.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3 relative">
              <span className="w-7 h-7 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center">5</span>
              <h4 className="font-bold text-sm text-white">Delivery & Instant Payout</h4>
              <p className="text-xs text-slate-400">
                Verified delivery triggers automatic escrow release directly to farmer's account.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. FEATURED MARKETPLACE PRODUCE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full">
              Direct Marketplace
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-2">
              Fresh Harvest Available Right Now
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified Grade A & Organic produce directly from regional Farmer Producer Organizations.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            Explore All Produce ({featuredProducts.length}+) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenPriceModal={openPriceModal}
            />
          ))}
        </div>
      </section>

      {/* 5. STAKEHOLDER VALUE PROPOSITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* For Farmers */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-brand-50 border border-emerald-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-base">🌾</div>
              <h3 className="font-bold text-lg text-emerald-950">For Farmers & FPOs</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Direct access to thousands of verified buyers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> AI fair price recommendations prevent distress selling</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Advance demand alerts for optimal harvest timing</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Instant escrow-guaranteed payments</li>
            </ul>
          </div>

          {/* For Buyers */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-600 text-white font-bold text-base">🛒</div>
              <h3 className="font-bold text-lg text-blue-950">For Buyers & Restaurants</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> 18-24% lower procurement costs vs mandi middlemen</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> 100% farm-gate freshness & quality traceability</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Scheduled bulk repeat deliveries for commercial kitchens</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" /> Live GPS vehicle tracking with cold-chain monitoring</li>
            </ul>
          </div>

          {/* For Logistics */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-base">🚚</div>
              <h3 className="font-bold text-lg text-indigo-950">For Smart Logistics</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /> AI-optimized multi-stop consolidation routes</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /> Reduced empty return trips with backhaul matching</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /> Lower fuel consumption and carbon footprint</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /> Fast digital turnaround at collection hubs</li>
            </ul>
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-800 via-brand-700 to-emerald-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
              Ready to modernize your agricultural commerce?
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
              Join the Direct AgriLink Movement Today.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100">
              Whether you are a farmer with 500kg harvest or a restaurant buying weekly produce, AgriLink AI delivers fair pricing and AI-driven reliability.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-2xl bg-white text-brand-900 font-extrabold text-sm text-center shadow-lg hover:bg-slate-100 hover:scale-105 transition-all"
            >
              Create Free Account
            </Link>
            <button
              onClick={onOpenDemoModal}
              className="px-6 py-3.5 rounded-2xl bg-amber-500 text-white font-extrabold text-sm text-center shadow-lg hover:bg-amber-600 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> 1-Click Interactive Demo
            </button>
          </div>
        </div>
      </section>

      {/* AI Price Modal */}
      <AIPriceModal
        product={selectedProduct}
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
      />

    </div>
  );
};

export default LandingPage;
