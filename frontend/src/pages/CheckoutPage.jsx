import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Lock, CheckCircle2, ArrowLeft, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart, totalWeight } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState(
    'FreshBites Central Processing Kitchen, Salt Lake Sector V, Kolkata, West Bengal - 700091'
  );
  const [paymentMethod, setPaymentMethod] = useState('Online UPI (Escrow Protected)');
  const [notes, setNotes] = useState('Please maintain cold chain below 5°C throughout transit.');
  const [loading, setLoading] = useState(false);

  const logisticsEstimate = 420.0;
  const grandTotal = cartTotal + logisticsEstimate;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    try {
      const orderPayload = {
        items: cartItems.map((i) => ({
          product_id: i.product_id,
          product_name: i.product_name,
          farmer_id: i.farmer_id || 'usr_farmer_01',
          farmer_name: i.farmer_name || 'Hooghly FPO',
          price_per_kg: i.price_per_kg,
          quantity_kg: i.quantity_kg,
          item_total: i.item_total,
          image_url: i.image_url,
          farmer_location: i.farmer_location,
        })),
        delivery_address: address,
        delivery_coordinates: { lat: 22.5726, lng: 88.3639 },
        payment_method: paymentMethod,
        notes: notes,
      };

      const res = await orderAPI.create(orderPayload);
      clearCart();
      confetti({ particleCount: 100, spread: 80 });
      navigate('/buyer-dashboard');
    } catch (err) {
      console.error(err);
      alert('Order creation failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/cart')}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900">Secure Direct Checkout</h1>
          <p className="text-xs text-slate-500">AgriEscrow guaranteed payment & automated route dispatch.</p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left: Address & Payment (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Delivery Address */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" /> Delivery Address & Facility
            </h2>

            <textarea
              rows="3"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Handling Instructions:</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" /> Payment Method
            </h2>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Online UPI (Escrow Protected)', desc: 'Instant UPI transfer with 100% money-back guarantee' },
                { name: 'Commercial Corporate NetBanking', desc: 'Direct NEFT / RTGS for bulk restaurants & institutions' },
                { name: 'AgriEscrow Smart Wallet', desc: 'Pre-funded buyer balance with zero payment gateway fees' },
              ].map((m) => (
                <label
                  key={m.name}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === m.name
                      ? 'bg-brand-50/70 border-brand-500 ring-1 ring-brand-500/30'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.name}
                    checked={paymentMethod === m.name}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-brand-600"
                  />
                  <div>
                    <p className="font-bold text-slate-900">{m.name}</p>
                    <p className="text-[11px] text-slate-500">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Order Summary Card (5 cols) */}
        <div className="md:col-span-5 rounded-3xl bg-slate-900 text-white p-6 shadow-xl border border-slate-800 space-y-6 sticky top-24">
          <h2 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Order Summary</span>
            <span className="text-xs text-brand-400 font-semibold">{cartItems.length} items</span>
          </h2>

          <div className="max-h-48 overflow-y-auto space-y-2 divide-y divide-slate-800 text-xs">
            {cartItems.map((item) => (
              <div key={item.product_id} className="pt-2 flex items-center justify-between text-slate-300">
                <span className="truncate max-w-[160px]">{item.product_name} ({item.quantity_kg}kg)</span>
                <span className="font-bold text-white">₹{item.item_total?.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Total Weight:</span>
              <span className="font-bold text-slate-200">{totalWeight} kg</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Subtotal Produce:</span>
              <span className="font-bold text-slate-200">₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>AI Route Logistics:</span>
              <span className="font-bold text-slate-200">₹{logisticsEstimate}</span>
            </div>
            <div className="flex justify-between text-white font-black text-lg pt-3 border-t border-slate-800">
              <span>Payable Total:</span>
              <span className="text-brand-400">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-102 active:scale-98"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" /> Confirm & Authorize Escrow
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            256-bit Encrypted & Bank Grade Escrow Protection
          </p>
        </div>

      </form>

    </div>
  );
};

export default CheckoutPage;
