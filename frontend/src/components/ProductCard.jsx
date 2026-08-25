import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MapPin, Sparkles, Check, Leaf, Star, ShieldCheck, Eye } from 'lucide-react';
import AIDemandBadge from './AIDemandBadge';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onOpenPriceModal }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(10);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group rounded-2xl bg-white border border-slate-200/90 hover:border-brand-500/50 shadow-xs hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={product.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
          <AIDemandBadge score={product.ai_demand_score} growth={product.ai_predicted_growth || 18.0} />
          
          {product.organic_certified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold shadow-xs backdrop-blur-xs">
              <Leaf className="w-3 h-3" /> Organic
            </span>
          )}
        </div>

        {/* Freshness Overlay Badge */}
        <div className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded-lg bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Harvested: {product.harvest_date || 'Today'}</span>
        </div>

        {/* Quick View Button */}
        <Link
          to={`/products/${product.id}`}
          className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <span className="px-3 py-1.5 rounded-xl bg-white/90 text-slate-900 text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-white">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </Link>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.9'}</span>
              <span className="text-slate-400 font-normal">({product.review_count || 18})</span>
            </div>
          </div>

          {/* Product Name */}
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Farmer & Location Info */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{product.farmer_name} • {product.location}</span>
          </div>
        </div>

        {/* Inventory Stock & Quality */}
        <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Available Stock:</span>
            <span className="font-bold text-slate-800">
              {product.quantity_kg?.toLocaleString()} kg
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.max(15, (product.quantity_kg / 1500) * 100))}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="px-1.5 py-0.5 bg-slate-100 rounded font-medium text-slate-700">{product.quality_grade || 'Grade A'}</span>
            <span className="text-slate-400">Min Order: {product.min_order_kg || 1} kg</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">₹{product.price_per_kg}</span>
              <span className="text-xs text-slate-500 font-medium">/ kg</span>
            </div>
            {product.expected_price && product.expected_price < product.price_per_kg && (
              <span className="text-[10px] text-emerald-600 font-semibold block">
                AI Fair Price (+₹{(product.price_per_kg - product.expected_price).toFixed(0)} farmer gain)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenPriceModal && (
              <button
                type="button"
                onClick={() => onOpenPriceModal(product)}
                className="p-2 rounded-xl text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors"
                title="AI Price Recommendation Breakdown"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20 hover:shadow-md'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" /> Buy
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
