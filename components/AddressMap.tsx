'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Crosshair } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet marker missing icon issue
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface AddressMapProps {
  address: { coordinates: { lat: number, lng: number } };
  setAddress: (fn: (prev: any) => any) => void;
  setActiveTab?: (tab: 'form' | 'map') => void;
  handleGetLiveLocation: () => void;
}

export default function AddressMap({ address, setAddress, setActiveTab, handleGetLiveLocation }: AddressMapProps) {
  
  const defaultCenter: [number, number] = [20.5937, 78.9629]; // India Center
  const currentCoords: [number, number] = address?.coordinates 
    ? [address.coordinates.lat, address.coordinates.lng] 
    : defaultCenter;

  const fetchAddressDetails = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`);
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        setAddress((prev: any) => ({
          ...prev,
          coordinates: { lat, lng },
          street: addr.road || addr.suburb || addr.neighbourhood || prev.street || '',
          city: addr.city || addr.town || addr.village || addr.county || prev.city || '',
          state: addr.state || prev.state || '',
          zipCode: addr.postcode || prev.zipCode || ''
        }));
      } else {
        setAddress((prev: any) => ({
          ...prev,
          coordinates: { lat, lng }
        }));
      }
    } catch (err) {
      console.error(err);
      setAddress((prev: any) => ({
        ...prev,
        coordinates: { lat, lng }
      }));
    }
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e: any) {
        fetchAddressDetails(e.latlng.lat, e.latlng.lng);
      },
    });

    useEffect(() => {
      if (address?.coordinates) {
        const targetZoom = Math.max(map.getZoom(), 16);
        map.flyTo([address.coordinates.lat, address.coordinates.lng], targetZoom, {
          duration: 1.5 
        });
      }
    }, [address?.coordinates?.lat, address?.coordinates?.lng, map]);

    return address?.coordinates ? (
      <Marker position={[address.coordinates.lat, address.coordinates.lng]} />
    ) : null;
  };

  const onGetLiveLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchAddressDetails(latitude, longitude);
      }, (error) => {
        console.error("Error getting location:", error);
        alert("Could not get your location. Please check permissions.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="bg-white rounded-[40px] overflow-hidden shadow-xl shadow-slate-200/50 border border-white h-[500px] relative">
      <MapContainer 
        center={currentCoords} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
      
      <div className="absolute top-6 right-6 z-[1000]">
        <button 
          onClick={onGetLiveLocation}
          className="bg-white text-emerald-600 px-4 py-3 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2 hover:bg-emerald-50 transition-all border border-emerald-100"
        >
          <Crosshair className="w-5 h-5" /> Live Location
        </button>
      </div>
      
      <div className="absolute bottom-6 left-6 right-6 z-[1000]">
        <div className="glass p-4 rounded-2xl flex items-center justify-between border-white shadow-lg bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Selected Location</p>
              <p className="text-sm font-bold text-slate-900">
                {address?.coordinates?.lat?.toFixed(4) || '0.0000'}, {address?.coordinates?.lng?.toFixed(4) || '0.0000'}
              </p>
            </div>
          </div>
          {setActiveTab && (
            <button 
              onClick={() => setActiveTab('form')}
              className="bg-white text-slate-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all border border-slate-200"
            >
              Review Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
