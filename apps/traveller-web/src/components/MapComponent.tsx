'use client';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Location } from '../app/plan/page';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle dynamic map updates without remounting
function MapUpdater({ destinations }: { destinations: Location[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (destinations.length > 0) {
      const bounds = L.latLngBounds(destinations.map(loc => [loc.lat, loc.lon]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [destinations, map]);

  return null;
}

export default function MapComponent({ destinations }: { destinations: Location[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ height: '100%', width: '100%', backgroundColor: '#0f172a' }}></div>;

  const polylineCoords: [number, number][] = destinations.map(loc => [loc.lat, loc.lon]);
  
  const center: [number, number] = destinations.length > 0 
    ? [destinations[0].lat, destinations[0].lon] 
    : [22.5, 75.0];

  return (
    <MapContainer 
      center={center} 
      zoom={6} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <MapUpdater destinations={destinations} />
      
      {destinations.map((loc, idx) => (
        <Marker key={idx} position={[loc.lat, loc.lon]}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}

      {polylineCoords.length > 1 && (
        <Polyline positions={polylineCoords} color="#4f46e5" weight={4} dashArray="10, 10" />
      )}
    </MapContainer>
  );
}
