import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  MapPin,
  Leaf,
  Filter,
  ArrowUpDown,
  Tag,
} from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import AIPriceModal from '../components/AIPriceModal';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Rice', 'Wheat', 'Pulses', 'Spices', 'Dairy'];
const LOCATIONS = ['All', 'Kolkata', 'Hooghly', 'Chandannagar', 'Nashik', 'Ratnagiri', 'Karnal', 'Erode'];
const GRADES = ['All', 'Grade A', 'Organic Premium', 'Grade B'];

const MarketplacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  // Filter States
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState('All');
  const [qualityGrade, setQualityGrade] = useState('All');
  const [maxPrice, setMaxPrice] = useState(250);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState('demand');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [category, location, qualityGrade, maxPrice, organicOnly, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: category !== 'All' ? category : undefined,
        search: search.trim() || undefined,
        location: location !== 'All' ? location : undefined,
        quality_grade: qualityGrade !== 'All' ? qualityGrade : undefined,
        max_price: maxPrice < 250 ? maxPrice : undefined,
        organic_only: organicOnly ? true : undefined,
        sort_by: sortBy,
      };
      const res = await productAPI.getAll(params);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setCategory('All');
    setSearch('');
    setLocation('All');
    setQualityGrade('All');
    setMaxPrice(250);
    setOrganicOnly(false);
    setSortBy('demand');
  };

  const openPriceModal = (product) => {
    setSelectedProduct(product);
    setIsPriceModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Monitored Fair Produce</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            Agricultural Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Procure fresh produce directly from verified farmers & FPOs with guaranteed transparency, quality certifications, and cold-chain delivery.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Tomato, Rice, FPO..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 text-white text-xs border border-white/20 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors shadow-sm"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20 scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Filter Sidebar (3 cols) */}
        <aside className="hidden lg:block lg:col-span-3 rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-600" /> Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Origin Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>
              ))}
            </select>
          </div>

          {/* Quality Grade Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" /> Quality Grade
            </label>
            <select
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>{g === 'All' ? 'All Grades' : g}</option>
              ))}
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700 uppercase tracking-wider">Max Price / kg</label>
              <span className="font-extrabold text-brand-700">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="20"
              max="250"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>

          {/* Organic Only Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" /> Organic Certified Only
            </span>
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 accent-brand-600 cursor-pointer"
            />
          </div>

          {/* Sort Selector */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /> Sort Results
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="demand">⚡ AI High Demand</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Fresh Harvest (Newest)</option>
            </select>
          </div>

        </aside>

        {/* Product Grid Area (9 cols) */}
        <main className="lg:col-span-9 space-y-6">
          
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              Showing <span className="text-brand-700 font-bold">{products.length}</span> agricultural items
            </span>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-bold flex items-center gap-1"
            >
              <Filter className="w-3.5 h-3.5" /> Filters
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-white border border-slate-200 p-4 space-y-3 animate-pulse">
                  <div className="aspect-4/3 bg-slate-100 rounded-xl" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white border border-slate-200 p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800">No products match your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your price range, category, or search keywords to view available farm harvest.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenPriceModal={openPriceModal}
                />
              ))}
            </div>
          )}

        </main>

      </div>

      {/* AI Price Recommendation Modal */}
      <AIPriceModal
        product={selectedProduct}
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
      />

    </div>
  );
};

export default MarketplacePage;
