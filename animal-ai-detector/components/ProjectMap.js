'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Loader2, MapPin, Layers } from 'lucide-react';

export default function ProjectMap({ onLocationSelect, initialLocation }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markerRef = useRef(null);
  const layersRef = useRef({});
  const [position, setPosition] = useState(initialLocation || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isSatellite, setIsSatellite] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false // Custom zoom control placement if needed
    }).setView(position || [20, 0], position ? 12 : 2);
    
    mapRef.current = map;

    // Base Layers
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    layersRef.current = { street: streetLayer, satellite: satelliteLayer };
    
    // Default to street or satellite based on state
    (isSatellite ? satelliteLayer : streetLayer).addTo(map);

    // Fix for icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (position) {
      markerRef.current = L.marker(position).addTo(map);
    }

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);

      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng).addTo(map);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle layer toggle
  useEffect(() => {
    if (!mapRef.current || !layersRef.current.street) return;
    
    if (isSatellite) {
      mapRef.current.removeLayer(layersRef.current.street);
      layersRef.current.satellite.addTo(mapRef.current);
    } else {
      mapRef.current.removeLayer(layersRef.current.satellite);
      layersRef.current.street.addTo(mapRef.current);
    }
  }, [isSatellite]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError('');

    // Check if input is coordinates (e.g. "12.34, 56.78")
    const coordMatch = searchQuery.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        const latlng = [lat, lng];
        updateMapPosition(latlng);
        setSearching(false);
        return;
      }
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=jsonv2&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (!data || !data.length) {
        setSearchError('No results found. Try a different location or coordinates.');
        return;
      }
      const { lat, lon } = data[0];
      updateMapPosition([parseFloat(lat), parseFloat(lon)]);
    } catch (err) {
      setSearchError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const updateMapPosition = (latlng) => {
    if (mapRef.current) {
      mapRef.current.flyTo(latlng, 12, { animate: true, duration: 1.5 });
      
      if (markerRef.current) {
        markerRef.current.setLatLng(latlng);
      } else {
        markerRef.current = L.marker(latlng).addTo(mapRef.current);
      }
      
      setPosition(latlng);
      onLocationSelect(latlng[0], latlng[1]);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 relative z-0 shadow-2xl flex flex-col bg-slate-900/50">
      {/* Controls Bar (Above Map) */}
      <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between bg-black/60 backdrop-blur-xl">
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
          <div className="flex-1 relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="City, region, or lat, lon..."
              className="w-full pl-9 pr-4 py-2.5 bg-black/60 border border-white/20 rounded-xl text-white text-sm font-medium placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-all shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-all flex items-center gap-2 text-sm font-bold disabled:opacity-50 shadow-lg"
          >
            {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          </button>
        </form>

        {/* Layer Toggle */}
        <button
          type="button"
          onClick={() => setIsSatellite(!isSatellite)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all shadow-lg shrink-0 ${
            isSatellite 
              ? 'bg-indigo-600 border-indigo-400 text-white' 
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Layers size={14} />
          {isSatellite ? 'Satellite' : 'Map View'}
        </button>
      </div>

      {/* Error Message */}
      {searchError && (
        <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20 text-xs text-red-400 font-bold">
          {searchError}
        </div>
      )}

      {/* Actual Map */}
      <div ref={containerRef} className="bg-slate-900 w-full" style={{ height: '500px' }} />
    </div>
  );
}
