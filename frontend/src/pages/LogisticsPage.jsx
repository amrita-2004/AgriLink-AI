import React, { useState, useEffect } from 'react';
import {
  Truck,
  Navigation,
  Thermometer,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { logisticsAPI } from '../services/api';
import LeafletMap from '../components/LeafletMap';

const LogisticsPage = () => {
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(2);
  const [telemetry, setTelemetry] = useState({
    temp: 4.2,
    speed: 38,
    fuel: '86%',
    driver: 'Rajesh Kumar (Partner #402)',
    vehicle: 'WB-02-AG-8821 (Refrigerated Mini-Truck)',
  });

  const demoStops = [
    {
      stop_number: 1,
      type: 'pickup',
      name: 'Hooghly Organic Farmer Cooperative (HOFC)',
      lat: 22.8953,
      lng: 88.4026,
      action: 'Load 500 kg Fresh Vine-Ripened Tomatoes',
      estimated_time: '09:00 AM (Completed)',
    },
    {
      stop_number: 2,
      type: 'collection_hub',
      name: 'AgriLink Regional Quality & Cold Hub (Dankuni)',
      lat: 22.6845,
      lng: 88.312,
      action: 'Cold-chain verification, barcoding & rapid quality check',
      estimated_time: '09:28 AM (In Progress)',
    },
    {
      stop_number: 3,
      type: 'delivery',
      name: 'FreshBites Central Kitchens, Salt Lake Sector V',
      lat: 22.5726,
      lng: 88.3639,
      action: 'Direct dock handover & smart OTP verification',
      estimated_time: '09:52 AM (Estimated)',
    },
  ];

  const demoWaypoints = [
    [22.8953, 88.4026],
    [22.812, 88.358],
    [22.6845, 88.312],
    [22.623, 88.334],
    [22.5726, 88.3639],
  ];

  useEffect(() => {
    logisticsAPI.getActiveFleet()
      .then((res) => setFleet(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // Telemetry micro-oscillation for realism
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        temp: Number((4.1 + Math.random() * 0.3).toFixed(1)),
        speed: Math.floor(36 + Math.random() * 6),
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Truck className="w-3.5 h-3.5" /> Smart Logistics & Cold Fleet Telemetry
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            AI Multi-Stop Fleet Dispatch & Route Engine
          </h1>
          <p className="text-xs text-slate-300">
            Optimized multi-stop consolidation between Farm Gates → Regional Cold Hubs → Direct Receiving Facilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-white/10 text-white text-xs font-bold border border-white/20">
            Active Fleet: <strong>12 Vehicles</strong>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-extrabold shadow-sm flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 98.4% On-Time ETA
          </div>
        </div>
      </div>

      {/* Live Map & Active Vehicle Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Live Map (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="h-[440px] rounded-3xl overflow-hidden shadow-md border border-slate-200">
            <LeafletMap stops={demoStops} waypoints={demoWaypoints} activeStep={activeStep} />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <span>Map showing active cold-chain corridor: Hooghly → Dankuni Hub → Salt Lake</span>
            <button
              onClick={() => setActiveStep((prev) => (prev % 3) + 1)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Play className="w-3 h-3" /> Advance Fleet Step ({activeStep}/3)
            </button>
          </div>
        </div>

        {/* Right: Real-Time Telemetry & Stop Milestones (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Vehicle Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Active Cold Vehicle</span>
                <h3 className="font-bold text-base text-white">{telemetry.vehicle}</h3>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live GPS
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700">
                <span className="text-slate-400 block text-[10px] flex items-center justify-center gap-1">
                  <Thermometer className="w-3 h-3 text-emerald-400" /> Temp
                </span>
                <span className="text-base font-black text-emerald-400 mt-1 block">{telemetry.temp}°C</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Speed</span>
                <span className="text-base font-black text-white mt-1 block">{telemetry.speed} km/h</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Fuel Level</span>
                <span className="text-base font-black text-indigo-400 mt-1 block">{telemetry.fuel}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span>Driver: {telemetry.driver}</span>
              <span className="text-emerald-400 font-semibold">Route ETA: 52 mins</span>
            </div>
          </div>

          {/* Stops Timeline */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Multi-Stop Routing Schedule
            </h3>

            <div className="space-y-3">
              {demoStops.map((stop) => {
                const isPassed = activeStep > stop.stop_number;
                const isCurrent = activeStep === stop.stop_number;

                return (
                  <div
                    key={stop.stop_number}
                    className={`p-3.5 rounded-2xl border flex gap-3 items-start transition-all ${
                      isCurrent
                        ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20'
                        : isPassed
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
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
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : stop.stop_number}
                    </div>

                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate">{stop.name}</span>
                        <span className="text-[10px] text-slate-500">{stop.estimated_time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{stop.action}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LogisticsPage;
