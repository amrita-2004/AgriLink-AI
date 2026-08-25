import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Plus,
  TrendingUp,
  Package,
  DollarSign,
  ShoppingBag,
  Sparkles,
  Check,
  X,
  Truck,
  Eye,
  Trash2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { productAPI, orderAPI, aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AIDemandBadge from '../components/AIDemandBadge';
import AIPriceModal from '../components/AIPriceModal';

const REVENUE_DATA = [
  { month: 'Apr', revenue: 42000, orders: 12 },
  { month: 'May', revenue: 68000, orders: 19 },
  { month: 'Jun', revenue: 95000, orders: 28 },
  { month: 'Jul', revenue: 135000, orders: 38 },
  { month: 'Aug', revenue: 182000, orders: 52 },
];

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  // New Product Form State
  const [newProd, setNewProd] = useState({
    name: 'Fresh Hybrid Red Tomatoes',
    category: 'Vegetables',
    variety: 'Avinash-2 High Lycopene',
    quantity_kg: 1000,
    price_per_kg: 28,
    expected_price: 25,
    quality_grade: 'Grade A',
    harvest_date: new Date().toISOString().slice(0, 10),
    location: user?.location || 'Hooghly, West Bengal',
    description: 'Crisp naturally vine-ripened tomatoes harvested early morning.',
    organic_certified: true,
  });
  const [aiSuggPrice, setAiSuggPrice] = useState(28);
  const [aiGrowth, setAiGrowth] = useState(18);
  const [addingProduct, setAddingProduct] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        productAPI.getMyInventory(),
        orderAPI.getAll(),
      ]);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpectedPriceChange = async (val) => {
    const p = Number(val);
    setNewProd((prev) => ({ ...prev, expected_price: p }));
    try {
      const res = await aiAPI.getPriceRecommendation({
        product_name: newProd.name,
        category: newProd.category,
        quantity_kg: newProd.quantity_kg,
        location: newProd.location,
        expected_price: p,
      });
      setAiSuggPrice(res.data.recommended_price_per_kg);
      setNewProd((prev) => ({ ...prev, price_per_kg: res.data.recommended_price_per_kg }));
    } catch (err) {}
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setAddingProduct(true);
    try {
      await productAPI.create(newProd);
      setIsAddModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error creating product: ' + (err.response?.data?.detail || err.message));
    } finally {
      setAddingProduct(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, { status: newStatus });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this product from the marketplace?')) return;
    try {
      await productAPI.delete(productId);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const totalStockKg = products.reduce((acc, p) => acc + (p.quantity_kg || 0), 0);
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
  const activeOrdersCount = orders.filter((o) => ['Confirmed', 'Picked Up', 'In Transit'].includes(o.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-brand-950 via-slate-900 to-brand-950 text-white p-6 sm:p-8 shadow-xl border border-brand-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
            <Sprout className="w-3.5 h-3.5" /> Farmer & FPO Producer Portal
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            {user?.fpo_name || user?.name || 'Hooghly Organic Farmer Cooperative'}
          </h1>
          <p className="text-xs text-slate-300">
            Location: {user?.location || 'Hooghly, West Bengal'} • Direct Marketplace Active
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Agricultural Product
        </button>
      </div>

      {/* AI Demand Alert Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-amber-950">
              ⚠️ AI Demand Trend: Potato & Tomato Surge Expected Next Week
            </h4>
            <p className="text-xs text-amber-900 mt-0.5">
              Wholesale inquiries in Kolkata & Delhi metros are up <strong>+18%</strong>. Recommended selling price adjusted to ₹28/kg.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0"
        >
          List More Stock
        </button>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
            Total Revenue
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </span>
          <p className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-bold">+18.2% vs middleman</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
            Active Orders
            <ShoppingBag className="w-4 h-4 text-brand-600" />
          </span>
          <p className="text-2xl font-black text-slate-900">{activeOrdersCount}</p>
          <span className="text-[11px] text-brand-700 font-semibold">Ready for dispatch</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
            Available Inventory
            <Package className="w-4 h-4 text-amber-600" />
          </span>
          <p className="text-2xl font-black text-slate-900">{totalStockKg.toLocaleString()} kg</p>
          <span className="text-[11px] text-slate-500">{products.length} produce listings</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
            AI Fair Price Index
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </span>
          <p className="text-2xl font-black text-indigo-700">₹28.0 / kg</p>
          <span className="text-[11px] text-indigo-600 font-bold">+₹3.0/kg gain</span>
        </div>

      </div>

      {/* Analytics Chart & Incoming Orders Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sales Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Direct Sales Growth & Revenue</h3>
              <p className="text-xs text-slate-500">Monthly direct sales through AgriLink AI</p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold bg-brand-50 text-brand-700 rounded-full">
              Escrow Guaranteed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incoming Orders Queue (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Incoming Buyer Orders</h3>
              <span className="text-xs text-brand-600 font-bold">{orders.length} Total</span>
            </div>

            <div className="space-y-3 mt-3 max-h-72 overflow-y-auto divide-y divide-slate-100">
              {orders.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No orders received yet.</p>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="pt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{o.buyer_name}</span>
                      <span className="font-extrabold text-brand-700">₹{o.total_amount?.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Items: {o.items?.map((i) => `${i.product_name} (${i.quantity_kg}kg)`).join(', ')}</span>
                      <span className="px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700">
                        {o.status}
                      </span>
                    </div>

                    {/* Status Action Buttons */}
                    {o.status === 'Confirmed' && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, 'Picked Up')}
                          className="px-3 py-1 bg-brand-600 text-white rounded-lg font-bold text-[11px] hover:bg-brand-700"
                        >
                          Dispatch / Ready for Pickup
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Inventory Management Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Farm Inventory & AI Fair Pricing</h3>
            <p className="text-xs text-slate-500">Live products currently available for direct purchase</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 text-xs font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Produce
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Produce</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Available Stock</th>
                <th className="px-4 py-3">Selling Price</th>
                <th className="px-4 py-3">AI Demand</th>
                <th className="px-4 py-3">Harvest Date</th>
                <th className="px-4 py-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image_url || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.variety || 'Grade A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-600">{p.category}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{p.quantity_kg?.toLocaleString()} kg</td>
                  <td className="px-4 py-3">
                    <span className="font-extrabold text-brand-700 text-sm">₹{p.price_per_kg}</span>
                    <span className="text-slate-400 text-[10px]"> /kg</span>
                  </td>
                  <td className="px-4 py-3">
                    <AIDemandBadge score={p.ai_demand_score} growth={p.ai_predicted_growth || 18.0} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.harvest_date || 'Today'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setIsPriceModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-brand-700 bg-brand-50 hover:bg-brand-100"
                        title="AI Price Breakdown"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete Produce"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-gradient-to-r from-brand-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sprout className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-base text-white">List Produce on Direct Marketplace</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Produce Name</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Rice">Rice</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Spices">Spices</option>
                    <option value="Dairy">Dairy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProd.quantity_kg}
                    onChange={(e) => setNewProd({ ...newProd, quantity_kg: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-amber-800">Your Expected (₹/kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newProd.expected_price}
                    onChange={(e) => handleExpectedPriceChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-amber-50 border border-amber-300 font-bold text-amber-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-600" /> AI Suggested
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newProd.price_per_kg}
                    onChange={(e) => setNewProd({ ...newProd, price_per_kg: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-brand-50 border-2 border-brand-500 font-black text-brand-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Quality Grade</label>
                  <select
                    value={newProd.quality_grade}
                    onChange={(e) => setNewProd({ ...newProd, quality_grade: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    <option value="Grade A">Grade A (Premium)</option>
                    <option value="Organic Premium">Organic Certified</option>
                    <option value="Grade B">Grade B (Standard)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Harvest Date</label>
                  <input
                    type="date"
                    value={newProd.harvest_date}
                    onChange={(e) => setNewProd({ ...newProd, harvest_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Farm Location</label>
                <input
                  type="text"
                  value={newProd.location}
                  onChange={(e) => setNewProd({ ...newProd, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description & Handling Notes</label>
                <textarea
                  rows="2"
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              {/* AI Auto-Evaluation preview */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> AI Pricing Analysis:
                </span>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  By listing at the recommended ₹{newProd.price_per_kg}/kg rather than your initial ₹{newProd.expected_price}/kg, your estimated earnings will increase by <strong>+₹{((newProd.price_per_kg - newProd.expected_price) * newProd.quantity_kg).toLocaleString()}</strong>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingProduct}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-md shadow-brand-600/30"
                >
                  {addingProduct ? 'Adding Produce...' : 'Publish to Marketplace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Price Modal */}
      <AIPriceModal
        product={selectedProduct}
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
      />

    </div>
  );
};

export default FarmerDashboard;
