import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const AIDemandBadge = ({ score = 'HIGH', growth = 18.0, showIcon = true, size = 'sm' }) => {
  const isHigh = score === 'HIGH' || score === 'VERY HIGH' || growth >= 15;
  const isModerate = score === 'MODERATE' || (growth >= 0 && growth < 15);
  
  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-xs' : 'px-2 py-0.5 text-[11px]';

  if (isHigh) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 ${sizeClasses}`}>
        {showIcon && <Zap className="w-3 h-3 text-emerald-600 animate-pulse" />}
        <span>AI High Demand</span>
        <span className="font-bold text-emerald-800">+{growth}%</span>
      </span>
    );
  }

  if (isModerate) {
    return (
      <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30 ${sizeClasses}`}>
        {showIcon && <TrendingUp className="w-3 h-3 text-amber-600" />}
        <span>Moderate Demand</span>
        <span>+{growth}%</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses}`}>
      {showIcon && <CheckCircle className="w-3 h-3 text-slate-500" />}
      <span>Stable Demand</span>
      <span>{growth}%</span>
    </span>
  );
};

export default AIDemandBadge;
