import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Heart, ShieldCheck, Zap, Globe, Github, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                FarmX<span className="text-brand-400">.AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering farmers & FPOs with direct digital market access, machine-learning demand forecasting, dynamic fair pricing, and smart cold-chain route optimization.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Direct • Zero Middlemen Exploitation</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Marketplace & AI</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/marketplace" className="hover:text-brand-400 transition-colors">Browse Produce Catalog</Link></li>
              <li><Link to="/ai-analytics" className="hover:text-brand-400 transition-colors">AI Demand Forecasting</Link></li>
              <li><Link to="/ai-analytics" className="hover:text-brand-400 transition-colors">Dynamic Price Recommender</Link></li>
              <li><Link to="/logistics" className="hover:text-brand-400 transition-colors">AI Route Logistics Engine</Link></li>
              <li><Link to="/marketplace?category=Vegetables" className="hover:text-brand-400 transition-colors">Fresh Vegetables & Fruits</Link></li>
              <li><Link to="/marketplace?category=Dairy" className="hover:text-brand-400 transition-colors">Organic Dairy & Pulses</Link></li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Portals & Stakeholders</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/farmer-dashboard" className="hover:text-brand-400 transition-colors">Farmer / FPO Portal</Link></li>
              <li><Link to="/buyer-dashboard" className="hover:text-brand-400 transition-colors">Consumer & Bulk Buyer Dashboard</Link></li>
              <li><Link to="/admin-dashboard" className="hover:text-brand-400 transition-colors">Admin & Quality Governance</Link></li>
              <li><Link to="/logistics" className="hover:text-brand-400 transition-colors">Fleet Dispatch & Cold Hubs</Link></li>
              <li><Link to="/cart" className="hover:text-brand-400 transition-colors">Smart Escrow Checkout</Link></li>
            </ul>
          </div>

          {/* Tech & Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Contact & Support</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>support@agrilink.ai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>Toll-Free Kisan Line: 1800-AGRI-LINK</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-400" />
                <span>Operations across Kolkata, Delhi, Nashik, Bengaluru</span>
              </div>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 bg-slate-800 text-[11px] font-medium text-slate-300 rounded-md border border-slate-700">
                  Built with FastAPI • Scikit-Learn • React • Vite • Tailwind
                </span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} AgriLink AI – National Farmer Digital Empowerment Platform.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Fair Price Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
