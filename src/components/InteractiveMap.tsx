import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Layers, 
  Flame, 
  Store, 
  Activity, 
  Compass, 
  ShieldAlert, 
  Eye, 
  Maximize2,
  TrendingUp,
  Clock,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Zone, Vendor } from '../types';

export const InteractiveMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatLayerRef = useRef<L.LayerGroup | null>(null);
  const trafficLayerRef = useRef<L.LayerGroup | null>(null);

  const {
    zones,
    filteredVendors,
    selectedZone,
    setSelectedZone,
    setSelectedVendor,
    setIsComplaintModalOpen,
    t
  } = useApp();

  const [activeLayer, setActiveLayer] = useState<{
    heat: boolean;
    vendors: boolean;
    traffic: boolean;
  }>({
    heat: true,
    vendors: true,
    traffic: true,
  });

  const [activeCity, setActiveCity] = useState<'all' | 'nagpur' | 'pune' | 'mumbai'>('nagpur');
  const [inspectedZone, setInspectedZone] = useState<Zone | null>(zones[0] || null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clear any previous map if container changed
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default to Nagpur Center
    const map = L.map(mapContainerRef.current, {
      center: [21.1458, 79.0832],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Official Clean OpenStreetMap CartoDB Positron / OSM tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a> | Maharashtra Smart City GIS',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    heatLayerRef.current = L.layerGroup().addTo(map);
    trafficLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Invalidate size immediately and after layout settles
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Zone Heatmap & Traffic Circles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !heatLayerRef.current || !trafficLayerRef.current) return;

    heatLayerRef.current.clearLayers();
    trafficLayerRef.current.clearLayers();

    zones.forEach((zone) => {
      // Heatmap Color Scheme: Green = Low, Yellow = Medium, Red = High / Very High
      let fillColor = '#22c55e'; // Green
      let strokeColor = '#16a34a';
      if (zone.activityScore >= 90) {
        fillColor = '#dc2626'; // Red High
        strokeColor = '#991b1b';
      } else if (zone.activityScore >= 75) {
        fillColor = '#ea580c'; // Orange
        strokeColor = '#c2410c';
      } else if (zone.activityScore >= 50) {
        fillColor = '#eab308'; // Yellow Medium
        strokeColor = '#ca8a04';
      }

      // Heat Circle
      if (activeLayer.heat) {
        const radius = zone.activityScore >= 90 ? 1100 : zone.activityScore >= 75 ? 900 : 700;
        const circle = L.circle([zone.lat, zone.lng], {
          color: strokeColor,
          fillColor: fillColor,
          fillOpacity: 0.22,
          weight: 2,
          radius: radius,
        });

        circle.on('click', () => {
          setInspectedZone(zone);
          setSelectedZone(zone);
          map.flyTo([zone.lat, zone.lng], 15, { duration: 1.2 });
        });

        circle.bindTooltip(
          `<strong>${zone.name}</strong><br/>Activity Index: ${zone.activityScore}/100 • ${zone.activityLevel}`,
          { direction: 'top', className: 'custom-leaflet-tooltip' }
        );

        heatLayerRef.current?.addLayer(circle);
      }

      // Traffic Pressure Outer Pulse Ring
      if (activeLayer.traffic && (zone.trafficPressure === 'Critical' || zone.trafficPressure === 'Heavy')) {
        const trafficRing = L.circle([zone.lat, zone.lng], {
          color: zone.trafficPressure === 'Critical' ? '#ef4444' : '#f97316',
          fillColor: zone.trafficPressure === 'Critical' ? '#fee2e2' : '#ffedd5',
          fillOpacity: 0.15,
          weight: 1.5,
          dashArray: '5, 5',
          radius: 1400,
        });
        trafficLayerRef.current?.addLayer(trafficRing);
      }

      // Zone Center Marker with Badge
      const zoneHtml = `
        <div class="flex flex-col items-center cursor-pointer group">
          <div class="px-2 py-1 rounded-md text-white text-[11px] font-bold shadow-lg flex items-center space-x-1 border border-white/60" style="background-color: ${strokeColor};">
            <span>${zone.name.split(' ')[0]}</span>
            <span class="bg-black/30 px-1 rounded text-[10px]">${zone.activityScore}</span>
          </div>
          <div class="w-2 h-2 rotate-45 -mt-1 shadow-sm" style="background-color: ${strokeColor};"></div>
        </div>
      `;

      const zoneIcon = L.divIcon({
        html: zoneHtml,
        className: 'zone-marker-custom',
        iconSize: [100, 30],
        iconAnchor: [50, 28],
      });

      const zoneMarker = L.marker([zone.lat, zone.lng], { icon: zoneIcon });
      zoneMarker.on('click', () => {
        setInspectedZone(zone);
        setSelectedZone(zone);
        map.flyTo([zone.lat, zone.lng], 15, { duration: 1.2 });
      });

      heatLayerRef.current?.addLayer(zoneMarker);
    });
  }, [zones, activeLayer.heat, activeLayer.traffic]);

  // Update Vendor Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    if (activeLayer.vendors) {
      filteredVendors.forEach((vendor) => {
        let pinColor = '#3b82f6';
        if (vendor.activityScore >= 90) pinColor = '#dc2626'; // Red
        else if (vendor.activityScore >= 75) pinColor = '#ea580c'; // Orange
        else if (vendor.activityScore >= 50) pinColor = '#eab308'; // Yellow
        else pinColor = '#22c55e'; // Green

        const vendorHtml = `
          <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-md border-2 border-white hover:scale-125 transition" style="background-color: ${pinColor};" title="${vendor.shopName}">
            <span>${vendor.activityScore}</span>
          </div>
        `;

        const vendorIcon = L.divIcon({
          html: vendorHtml,
          className: 'vendor-marker-custom',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([vendor.lat, vendor.lng], { icon: vendorIcon });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-1 text-slate-900 font-sans min-w-[200px]';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between pb-1 border-b border-slate-200">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${vendor.category}</span>
            <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Score: ${vendor.activityScore}/100</span>
          </div>
          <h4 class="text-xs font-bold text-[#0f2942] mt-1.5 leading-snug">${vendor.shopName}</h4>
          <p class="text-[11px] text-slate-600 mt-0.5">${vendor.address}</p>
          <div class="grid grid-cols-2 gap-1 mt-2 text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200">
            <div><strong>Today:</strong> ${vendor.todayTransactions} tx</div>
            <div><strong>Status:</strong> ${vendor.status}</div>
          </div>
          <button id="btn-view-${vendor.id}" class="w-full mt-2 py-1 px-2 rounded bg-[#0f2942] text-white text-xs font-semibold hover:bg-amber-600 transition flex items-center justify-center">
            View Shop Profile & Feedback
          </button>
        `;

        // Handle button click inside Leaflet popup
        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-view-${vendor.id}`);
          if (btn) {
            btn.onclick = () => setSelectedVendor(vendor);
          }
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }
  }, [filteredVendors, activeLayer.vendors]);

  // City Fly-To Handler
  const handleFlyCity = (city: 'nagpur' | 'pune' | 'mumbai') => {
    setActiveCity(city);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (city === 'nagpur') {
      map.flyTo([21.1458, 79.0832], 13, { duration: 1.5 });
      setInspectedZone(zones.find((z) => z.city === 'Nagpur') || null);
    } else if (city === 'pune') {
      map.flyTo([18.5236, 73.8415], 13, { duration: 1.5 });
      setInspectedZone(zones.find((z) => z.city === 'Pune') || null);
    } else if (city === 'mumbai') {
      map.flyTo([19.0178, 72.8478], 13, { duration: 1.5 });
      setInspectedZone(zones.find((z) => z.city === 'Mumbai') || null);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      {/* Map Section Header & Controls */}
      <div className="bg-[#0f2942] text-white rounded-t-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b-2 border-amber-500">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {t('Maharashtra Smart City Commercial GIS Map', 'महाराष्ट्र स्मार्ट सिटी व्यापारी जीआयएस नकाशा')}
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            {t(
              'Real-time visualization of commercial zones, UPI transaction pulse heatmaps, and vehicular traffic pressure corridors.',
              'व्यापारी गर्दीचा रिअल-टाईम हीटमॅप, डिजिटल व्यवहार वारंवारिता आणि वाहतूक भार.'
            )}
          </p>
        </div>

        {/* City Quick Switchers & Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* City Fly Buttons */}
          <div className="inline-flex rounded-md bg-white/10 p-0.5 border border-white/20">
            <button
              onClick={() => handleFlyCity('nagpur')}
              className={`px-3 py-1 rounded font-semibold transition ${
                activeCity === 'nagpur' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-200 hover:text-white'
              }`}
            >
              Nagpur (नागपूर)
            </button>
            <button
              onClick={() => handleFlyCity('pune')}
              className={`px-3 py-1 rounded font-semibold transition ${
                activeCity === 'pune' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-200 hover:text-white'
              }`}
            >
              Pune (पुणे)
            </button>
            <button
              onClick={() => handleFlyCity('mumbai')}
              className={`px-3 py-1 rounded font-semibold transition ${
                activeCity === 'mumbai' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-200 hover:text-white'
              }`}
            >
              Mumbai (मुंबई)
            </button>
          </div>

          {/* Layer Checkbox Buttons */}
          <div className="flex items-center space-x-1.5 bg-[#16385b] px-2 py-1 rounded border border-slate-600">
            <label className="flex items-center space-x-1 text-[11px] cursor-pointer text-slate-200">
              <input
                type="checkbox"
                checked={activeLayer.heat}
                onChange={(e) => setActiveLayer((prev) => ({ ...prev, heat: e.target.checked }))}
                className="rounded text-amber-500 h-3 w-3"
              />
              <span>Heatmap</span>
            </label>
            <span className="text-slate-600">|</span>
            <label className="flex items-center space-x-1 text-[11px] cursor-pointer text-slate-200">
              <input
                type="checkbox"
                checked={activeLayer.vendors}
                onChange={(e) => setActiveLayer((prev) => ({ ...prev, vendors: e.target.checked }))}
                className="rounded text-amber-500 h-3 w-3"
              />
              <span>Vendors</span>
            </label>
            <span className="text-slate-600">|</span>
            <label className="flex items-center space-x-1 text-[11px] cursor-pointer text-slate-200">
              <input
                type="checkbox"
                checked={activeLayer.traffic}
                onChange={(e) => setActiveLayer((prev) => ({ ...prev, traffic: e.target.checked }))}
                className="rounded text-amber-500 h-3 w-3"
              />
              <span>Traffic Rings</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Zone Details Split Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-white rounded-b-xl shadow-lg border-x border-b border-slate-200 overflow-hidden">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 relative min-h-[440px] md:min-h-[540px] bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full min-h-[440px] md:min-h-[540px] z-0"></div>

          {/* Map Floating Legend (Official Government Heatmap Colors) */}
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-slate-300 text-xs max-w-xs">
            <div className="font-bold text-slate-900 mb-1.5 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span>{t('Activity Heatmap Scale', 'गर्दी निर्देशांक प्रमाण')}</span>
              <span className="text-[10px] text-slate-500 font-mono">UPI Signals</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-600"></span>
                  <span className="font-semibold text-slate-800">Red: High / Critical</span>
                </span>
                <span className="text-slate-500 font-mono">&gt; 85 Score</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="font-semibold text-slate-800">Yellow: Medium</span>
                </span>
                <span className="text-slate-500 font-mono">50 - 85</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-slate-800">Green: Low Normal</span>
                </span>
                <span className="text-slate-500 font-mono">&lt; 50 Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Details Inspection Panel */}
        <div className="lg:col-span-4 p-5 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
          {inspectedZone ? (
            <div className="space-y-4">
              {/* Zone Title & Activity Score */}
              <div className="pb-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {inspectedZone.city} Commercial Zone
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-black uppercase ${
                      inspectedZone.activityLevel === 'Very High' || inspectedZone.activityLevel === 'High'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : inspectedZone.activityLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {inspectedZone.activityLevel} Activity
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0f2942] mt-1 leading-snug">
                  {inspectedZone.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium">{inspectedZone.marathiName}</p>
                <p className="text-[11px] text-slate-500 mt-1">{inspectedZone.description}</p>
              </div>

              {/* 4 Crucial Zone Metrics as required */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">{t('Activity Score', 'व्यवहार निर्देशांक')}</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5 flex items-center">
                    {inspectedZone.activityScore}
                    <span className="text-xs text-slate-400 font-normal ml-1">/100</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +{inspectedZone.trendPercent}% vs avg
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-[10px] uppercase font-bold">{t('Total Vendors', 'एकूण व्यापारी')}</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {inspectedZone.totalVendors}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1">
                    {inspectedZone.activeVendorsNow} active now
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-slate-500" />
                    {t('Current Peak Hour', 'सध्याची गर्दी वेळ')}
                  </div>
                  <div className="text-xs font-black text-amber-900 mt-1">
                    {inspectedZone.peakHour}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Observed footfall</div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center">
                    <Sparkles className="w-3 h-3 mr-1 text-purple-600" />
                    {t('Predicted Peak', 'AI अंदाजित वेळ')}
                  </div>
                  <div className="text-xs font-black text-purple-900 mt-1">
                    {inspectedZone.predictedPeakHour}
                  </div>
                  <div className="text-[10px] text-purple-700 font-semibold mt-0.5">High Confidence</div>
                </div>
              </div>

              {/* Traffic Pressure & AI Civic Advisory */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-amber-950 font-bold">
                  <span className="flex items-center">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-700 mr-1" />
                    {t('Civic Mobility Advisory', 'नागरी व वाहतूक सूचना')}
                  </span>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded font-mono">
                    Traffic: {inspectedZone.trafficPressure}
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {inspectedZone.aiAdvisoryNote || 'Standard commercial regulations apply. Maintain pedestrian corridor.'}
                </p>
                <div className="text-[10px] text-slate-500 font-medium pt-1 border-t border-amber-200/60">
                  <strong>Jurisdiction:</strong> {inspectedZone.policeStationWard}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Click on any zone marker on the map to inspect live metrics.
            </div>
          )}

          {/* Quick Action Button */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <button
              onClick={() => setIsComplaintModalOpen(true)}
              className="w-full py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold transition flex items-center justify-center space-x-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>{t('Report Overcrowding / Obstruction in this Zone', 'या विभागात गर्दी / अडथळा तक्रार नोंदवा')}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
