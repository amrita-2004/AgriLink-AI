import React, { useState } from 'react';
import { X, Truck, Navigation, MapPin, CheckCircle, Clock, Thermometer, ShieldCheck, Play, ArrowRight } from 'lucide-react';
import LeafletMap from './LeafletMap';

const RouteMapModal = ({ routeData, isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(2);

  if (!isOpen || !routeData) return null;

  const summary = routeData.route_summary || {
    total_distance_km: 24.0,
    estimated_duration_minutes: 52,
    estimated_cost_inr: 420.0,
    carbon_saved_kg: 7.4,
    vehicle_type: 'Refrigerated Mini-Truck (Temp 4.2°C)',
    optimization_score: '98.2% Efficiency',
  };

  const stops = routeData.stops || [
    {
      stop_number: 1,
      type: 'pickup',
      name: 'Farmer Farm, Hooghly',
      lat: 22.8953,
      lng: 88.4026,
      action: 'Load 500 kg Fresh Tomato',
      estimated_time: '09:00 AM',
    },
    {
      stop_number: 2,
      type: 'collection_hub',
      name: 'AgriLink Regional Cold Hub (Dankuni / Howrah Junction)',
      lat: 22.6845,
      lng: 88.312,
      action: 'Cold-chain verification & batch barcode scan',
      estimated_time: '09:28 AM',
    },
    {
      stop_number: 3,
      type: 'delivery',
      name: 'Buyer Hub, Salt Lake Kolkata',
      lat: 22.5726,
      lng: 88.3639,
      action: 'Direct handover & smart OTP verification',
      estimated_time: '09:52 AM',
    },
  ];

  const waypoints = routeData.waypoints || [
    [22.8953, 88.4026],
    [22.812, 88.358],
    [22.6845, 88.312],
    [22.623, 88.334],
    [22.5726, 88.3639],
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <Navigation className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">AI Smart Multi-Stop Route Optimizer</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/30 text-indigo-300 rounded-full border border-indigo-500/40">
                  {summary.optimization_score}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Farmer Gate → Quality Collection Hub → Direct Buyer Handover
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-medium block">Total Distance</span>
              <span className="text-xl font-black text-slate-900 mt-0.5 block">{summary.total_distance_km} km</span>
              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">Optimized Path</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 font-medium block">Estimated Time</span>
              <span className="text-xl font-black text-slate-900 mt-0.5 block">{summary.estimated_duration_minutes} mins</span>
              <span className="text-[10px] text-indigo-600 font-semibold mt-0.5">Traffic Adjusted</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-brand-50 border border-brand-300 text-center">
              <span className="text-[11px] text-brand-800 font-bold block">Logistics Cost</span>
              <span className="text-xl font-black text-brand-700 mt-0.5 block">₹{summary.estimated_cost_inr}</span>
              <span className="text-[10px] text-brand-600 font-semibold mt-0.5">-38% vs fragmented freight</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[11px] text-emerald-800 font-medium block">Carbon Saved</span>
              <span className="text-xl font-black text-emerald-700 mt-0.5 block">{summary.carbon_saved_kg || 7.4} kg</span>
              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">Eco Route</span>
            </div>
          </div>

          {/* Map & Stops Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Map Container (7 cols) */}
            <div className="lg:col-span-7 h-[360px] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
              <LeafletMap stops={stops} waypoints={waypoints} activeStep={activeStep} />
            </div>

            {/* Turn-by-Turn Waypoints (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Waypoints & Cold-Chain Stops
                  </h4>
                  <button
                    onClick={() => setActiveStep((prev) => (prev % stops.length) + 1)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" /> Advance Step
                  </button>
                </div>

                <div className="space-y-3">
                  {stops.map((stop) => {
                    const isPassed = activeStep > stop.stop_number;
                    const isCurrent = activeStep === stop.stop_number;

                    return (
                      <div
                        key={stop.stop_number}
                        onClick={() => setActiveStep(stop.stop_number)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3 items-start ${
                          isCurrent
                            ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                            : isPassed
                            ? 'bg-emerald-50/40 border-emerald-200 text-slate-700'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isCurrent
                              ? 'bg-indigo-600 text-white'
                              : isPassed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          {isPassed ? <CheckCircle className="w-4 h-4" /> : stop.stop_number}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {stop.name}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {stop.estimated_time}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                            {stop.action}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cold Fleet Telemetry */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    WB-02-AG-8821
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Thermometer className="w-3.5 h-3.5" /> 4.2°C Chilled
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Driver: Rajesh Kumar (AgriLogistics #402)</span>
                  <span>Speed: 38 km/h</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Zero quality loss with end-to-end cold-chain assurance.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Close Route Map
          </button>
        </div>

      </div>
    </div>
  );
};

export default RouteMapModal;
