import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const LeafletMap = ({ stops = [], waypoints = [], activeStep = 1 }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center around Hooghly / Kolkata region
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([22.75, 88.35], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers & polylines
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (waypoints && waypoints.length > 0) {
      const latlngs = waypoints.map(([lat, lng]) => [lat, lng]);
      const poly = L.polyline(latlngs, {
        color: '#16a34a',
        weight: 5,
        opacity: 0.85,
        dashArray: '2, 6',
      }).addTo(map);
      polylineRef.current = poly;
      map.fitBounds(poly.getBounds(), { padding: [40, 40] });
    }

    // Add Stop Markers
    stops.forEach((stop, idx) => {
      const isCurrent = activeStep === stop.stop_number;
      const isPickup = stop.type === 'pickup';
      const isHub = stop.type === 'collection_hub';
      
      const bgColor = isPickup ? '#22c55e' : isHub ? '#3b82f6' : '#f59e0b';
      const iconHtml = `
        <div style="
          background-color: ${bgColor};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 13px;
        ">
          ${stop.stop_number || idx + 1}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([stop.lat, stop.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="color: #0f172a;">${stop.name}</strong><br/>
          <span style="color: #64748b;">${stop.action}</span><br/>
          <span style="color: #16a34a; font-weight: bold;">${stop.estimated_time || ''}</span>
        </div>
      `);
      markersRef.current.push(marker);
    });

    return () => {
      // Map stays attached to container ref
    };
  }, [stops, waypoints, activeStep]);

  return (
    <div className="w-full h-full min-h-[300px] relative rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '340px' }} />
    </div>
  );
};

export default LeafletMap;
