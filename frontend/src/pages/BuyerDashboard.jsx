import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  TrendingDown,
  Clock,
  MapPin,
  CheckCircle2,
  Navigation,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  FileText,
  DollarSign,
} from 'lucide-react';
import { orderAPI, productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RouteMapModal from '../components/RouteMapModal';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRouteOrder, setSelectedRouteOrder] = useState(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  useEffect(() => {
    fetchBuyerOrders();
  }, []);

  const fetchBuyerOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getAll();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTracking = (order) => {
    setSelectedRouteOrder(order.logistics_info || {});
    setIsRouteModalOpen(true);
  };

  const totalSpent = orders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
  const middlemanSaved = Math.round(totalSpent * 0.24);
  const inTransitCount = orders.filter((o) => ['Picked Up', 'In Transit', 'Confirmed'].includes(o.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            <ShoppingBag className="w-3.5 h-3.5" /> Consumer & Commercial Buyer Portal
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            {user?.name || 'Pooja Verma (FreshBites Retail & Kitchens)'}
          </h1>
          <p className="text-xs text-slate-300">
            Procurement Base: {user?.location || 'Kolkata, West Bengal'} • Escrow Verified
          </p>
        </div>

        <Link
          to="/marketplace"
          className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Procure More Fresh Produce
        </Link>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
            Total Spend
            <DollarSign className="w-4 h-4 text-slate-700" />
          </span>
          <p className="text-2xl font-black text-slate-900">₹{totalSpent.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">{orders.length} total orders placed</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
            Middleman Cost Saved
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </span>
          <p className="text-2xl font-black text-emerald-700">₹{middlemanSaved.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-bold">-24% cheaper than mandis</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
            Live Deliveries
            <Truck className="w-4 h-4 text-indigo-600" />
          </span>
          <p className="text-2xl font-black text-indigo-700">{inTransitCount}</p>
          <span className="text-[11px] text-indigo-600 font-semibold">Cold-chain tracked</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
            Quality Assurance
            <ShieldCheck className="w-4 h-4 text-brand-600" />
          </span>
          <p className="text-2xl font-black text-brand-700">100%</p>
          <span className="text-[11px] text-brand-700 font-semibold">Grade A & Organic</span>
        </div>

      </div>

      {/* Orders Tracking List */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Procurement Orders & Logistics Tracking</h3>
            <p className="text-xs text-slate-500">Live multi-stop shipment status from farm to receiving facility</p>
          </div>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
            Real-time GPS Active
          </span>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading order history...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No orders placed yet.</p>
              <Link to="/marketplace" className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold inline-block">
                Visit Marketplace
              </Link>
            </div>
          ) : (
            orders.map((o) => {
              const statusColors = {
                Pending: 'bg-amber-50 text-amber-700 border-amber-200',
                Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
                'Picked Up': 'bg-purple-50 text-purple-700 border-purple-200',
                'In Transit': 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-2 ring-indigo-500/20 animate-pulse',
                Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              };

              return (
                <div
                  key={o.id}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-all space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-900">Order #{o.id?.slice(0, 10)}</span>
                      <span className="text-slate-400 ml-2">
                        {new Date(o.created_at || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          statusColors[o.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        🚚 {o.status}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {o.payment_status || 'Escrow Paid'}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {o.items?.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
                        <img
                          src={item.image_url || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"}
                          alt={item.product_name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-900 truncate">{item.product_name}</p>
                          <p className="text-[11px] text-slate-500">{item.quantity_kg} kg @ ₹{item.price_per_kg}/kg</p>
                          <p className="text-xs font-extrabold text-brand-700">₹{item.item_total?.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Logistics Status & Map Button */}
                  <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="text-slate-600 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-md">{o.delivery_address}</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Total Escrow</span>
                        <span className="font-black text-slate-900 text-sm">₹{o.total_amount?.toLocaleString()}</span>
                      </div>

                      <button
                        onClick={() => handleOpenTracking(o)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all hover:scale-102"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Live Map Route ({o.logistics_info?.distance_km || 24} km)
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Route Tracking Modal */}
      <RouteMapModal
        routeData={selectedRouteOrder}
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
      />

    </div>
  );
};

export default BuyerDashboard;
