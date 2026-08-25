import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, totalWeight } = useCart();

  const logisticsEstimate = cartItems.length > 0 ? 420.0 : 0.0;
  const middlemanSaved = Math.round(cartTotal * 0.22);
  const grandTotal = cartTotal + logisticsEstimate;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display font-black text-2xl text-slate-900">Your Agricultural Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Browse our direct farm marketplace to connect with verified farmers and add fresh produce.
        </p>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all"
        >
          Explore Produce Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            Procurement Cart ({cartItems.length} items)
          </h1>
          <p className="text-xs text-slate-500">Direct orders grouped for multi-stop cold consolidation.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline font-semibold"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Item List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product_id}
              className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image_url || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"}
                  alt={item.product_name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-slate-900 truncate">{item.product_name}</h3>
                  <p className="text-xs text-slate-500">{item.farmer_name} • {item.farmer_location}</p>
                  <span className="text-xs font-extrabold text-brand-700 mt-1 block">
                    ₹{item.price_per_kg} / kg
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-2xl">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity_kg - 10)}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Decrease 10kg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-900 w-14 text-center">
                    {item.quantity_kg} kg
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity_kg + 10)}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Increase 10kg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Subtotal</span>
                  <span className="text-base font-black text-slate-900 block">
                    ₹{item.item_total?.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary Box (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200 p-6 shadow-md space-y-6 sticky top-24">
          <h2 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
            Procurement Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Total Produce Weight:</span>
              <span className="font-bold text-slate-800">{totalWeight.toLocaleString()} kg</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Produce Value:</span>
              <span className="font-bold text-slate-800">₹{cartTotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-indigo-600" /> AI Optimized Logistics:
              </span>
              <span className="font-bold text-slate-800">₹{logisticsEstimate}</span>
            </div>

            <div className="flex justify-between text-emerald-700 font-semibold pt-2 border-t border-slate-100">
              <span>Middleman Margin Saved:</span>
              <span>-₹{middlemanSaved.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-slate-900 font-black text-base pt-3 border-t border-slate-200">
              <span>Total Escrow Amount:</span>
              <span className="text-brand-700">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-[11px] font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Escrow Protected: Farmer payout held until delivery signoff.</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-600/30 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default CartPage;
