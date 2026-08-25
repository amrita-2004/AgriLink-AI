import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Leaf,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  ShoppingCart,
  ArrowLeft,
  Calendar,
  Layers,
  Award,
  DollarSign,
  Phone,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { productAPI, aiAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import AIDemandBadge from '../components/AIDemandBadge';
import AIPriceModal from '../components/AIPriceModal';
import RouteMapModal from '../components/RouteMapModal';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(50);
  const [added, setAdded] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [routeData, setRouteData] = useState(null);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await productAPI.getById(id);
      setProduct(res.data);
      setQty(res.data.min_order_kg || 10);
      
      const revRes = await productAPI.getReviews(id);
      setReviews(revRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, qty);
    navigate('/cart');
  };

  const handleOpenRouteOptimizer = async () => {
    if (!product) return;
    try {
      const res = await aiAPI.getRouteOptimization({
        origin: { name: `${product.farmer_name} Farm`, lat: 22.8953, lng: 88.4026 },
        destination: { name: 'Buyer Central Hub, Kolkata', lat: 22.5726, lng: 88.3639 },
        package_weight_kg: qty,
      });
      setRouteData(res.data);
      setIsRouteModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingReview(true);
    try {
      await productAPI.addReview(id, {
        product_id: id,
        order_id: `ord_direct_${Date.now()}`,
        rating: newRating,
        comment: newComment,
      });
      setNewComment('');
      fetchProductDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading produce specifications and farm traceability...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Produce not found</h2>
        <Link to="/marketplace" className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold inline-block">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const orderTotal = qty * product.price_per_kg;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back Link */}
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace Catalog
      </Link>

      {/* Main Grid: Gallery & Order Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Gallery & Certifications (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-lg">
            <img
              src={product.image_url || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <AIDemandBadge score={product.ai_demand_score} growth={product.ai_predicted_growth || 18.0} size="lg" />
              {product.organic_certified && (
                <span className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> 100% Certified Organic
                </span>
              )}
            </div>

            {/* Freshness banner */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-xs text-white text-xs font-medium flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Harvested: {product.harvest_date || 'Today'} (Shelf Life: {product.shelf_life_days || 8} days)</span>
            </div>
          </div>

          {/* Farmer & FPO Traceability Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 font-bold flex items-center justify-center">
                  👨‍🌾
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{product.farmer_name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {product.farmer_location || product.location}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                Verified FPO Partner
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Quality Inspection Grade:</span>
                <p className="font-bold text-slate-900 mt-0.5">{product.quality_grade || 'Grade A'}</p>
              </div>
              <div>
                <span className="text-slate-500">Farmer Contact Helpline:</span>
                <p className="font-bold text-slate-900 mt-0.5">{product.farmer_phone || '+91 98310 44521'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Product Spec & Purchase Box (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-brand-50 text-brand-700 font-bold text-xs">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating || '4.9'}</span>
                <span className="text-slate-400 font-normal">({product.review_count || 18} reviews)</span>
              </div>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              {product.name}
            </h1>
            <p className="text-xs font-medium text-slate-500">Variety: {product.variety || 'Standard High Yield'}</p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {product.description || 'Premium farm produce harvested with strict quality control. Direct dispatch from farm gate to eliminate cold-chain loss.'}
            </p>
          </div>

          {/* Pricing & AI Profit Box */}
          <div className="p-5 rounded-3xl bg-brand-50/60 border border-brand-200/80 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Direct Marketplace Price</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-black text-slate-900">₹{product.price_per_kg}</span>
                  <span className="text-xs text-slate-500 font-bold">/ kg</span>
                </div>
              </div>

              <button
                onClick={() => setIsPriceModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white border border-brand-300 text-brand-700 text-xs font-bold shadow-xs hover:bg-brand-50 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-600" /> AI Price Breakdown
              </button>
            </div>

            <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5 pt-2 border-t border-brand-200/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct farmer transaction: Zero middleman commission deducted.</span>
            </div>
          </div>

          {/* Order Configuration Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider">Purchase Quantity (kg)</span>
                <span className="text-slate-500">Available: <strong>{product.quantity_kg?.toLocaleString()} kg</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={product.min_order_kg || 5}
                  max={product.quantity_kg || 5000}
                  step="5"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="w-36 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                
                {/* Preset quick buttons */}
                <div className="flex items-center gap-1 text-xs">
                  {[25, 100, 500].map((quickQty) => (
                    <button
                      key={quickQty}
                      type="button"
                      onClick={() => setQty(quickQty)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 text-xs"
                    >
                      {quickQty}kg
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Estimated Order Total</span>
                <p className="text-2xl font-black text-slate-900 mt-0.5">₹{orderTotal.toLocaleString()}</p>
              </div>
              <button
                onClick={handleOpenRouteOptimizer}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
              >
                <Truck className="w-3.5 h-3.5" /> Check Route & Logistics ETA
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all"
              >
                Instant Buy & Checkout
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Customer Reviews & Feedback Section */}
      <section className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-600" /> Verified Buyer Reviews
            </h3>
            <p className="text-xs text-slate-500">Direct feedback from restaurant procurement heads and bulk consumers.</p>
          </div>
          <div className="flex items-center gap-1.5 text-amber-500 font-black text-base">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{product.rating || '4.9'} / 5.0</span>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No reviews yet for this harvest batch.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{rev.buyer_name}</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700">{rev.comment}</p>
                <span className="text-[10px] text-slate-400 block">{new Date(rev.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>

        {/* Review Submission Form */}
        <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-slate-100 space-y-3">
          <span className="font-bold text-xs text-slate-800 block">Leave a Verified Harvest Review</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Rating:</span>
            <select
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
              className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-300 font-bold"
            >
              <option value={5}>5 Stars - Outstanding Quality</option>
              <option value={4}>4 Stars - Great Produce</option>
              <option value={3}>3 Stars - Average Quality</option>
            </select>
          </div>
          <textarea
            rows="2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience regarding produce freshness, packaging, and delivery..."
            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={submittingReview}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors"
          >
            {submittingReview ? 'Submitting...' : 'Post Review'}
          </button>
        </form>
      </section>

      {/* AI Modals */}
      <AIPriceModal
        product={product}
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
      />

      <RouteMapModal
        routeData={routeData}
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
      />

    </div>
  );
};

export default ProductDetailPage;
