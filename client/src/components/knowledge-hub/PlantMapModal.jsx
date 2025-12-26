// client/src/components/knowledge-hub/PlantMapModal.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { X, MapPin, Navigation, Loader2 } from 'lucide-react';

// Fix for default Leaflet icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to fit bounds to show both markers
function ChangeView({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
}

function PlantMapModal({ isOpen, onClose, plant }) {
    const [userLocation, setUserLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const [plantCity, setPlantCity] = useState('Loading...');
    const [userCity, setUserCity] = useState('Loading...');
    const [loadingLocation, setLoadingLocation] = useState(true);

    // Plant coordinates
    const plantLocation = [plant.location.coordinates[1], plant.location.coordinates[0]];

    // 1. Calculate Distance (Haversine Formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d.toFixed(1);
    };

    const deg2rad = (deg) => deg * (Math.PI / 180);

    // 2. Fetch City Name (Reverse Geocoding)
    const fetchCityName = async (lat, lng, setCityFunc) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown Location';
            setCityFunc(city);
        } catch (error) {
            setCityFunc('Unknown Location');
        }
    };

    useEffect(() => {
        if (isOpen && plant) {
            setLoadingLocation(true);
            
            // Fetch Plant City
            fetchCityName(plantLocation[0], plantLocation[1], setPlantCity);

            // Get User Location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLat = position.coords.latitude;
                        const userLng = position.coords.longitude;
                        setUserLocation([userLat, userLng]);
                        
                        // Calculate Distance
                        const dist = calculateDistance(plantLocation[0], plantLocation[1], userLat, userLng);
                        setDistance(dist);
                        
                        // Fetch User City
                        fetchCityName(userLat, userLng, setUserCity);
                        setLoadingLocation(false);
                    },
                    (error) => {
                        console.error("Error getting location", error);
                        setLoadingLocation(false);
                        setUserCity("Location Access Denied");
                    }
                );
            } else {
                setLoadingLocation(false);
            }
        }
    }, [isOpen, plant]);

    if (!isOpen) return null;

    // Determine Map Bounds
    const bounds = userLocation ? [plantLocation, userLocation] : [plantLocation];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-xl font-bold flex items-center">
                            <MapPin className="mr-2 h-5 w-5" /> 
                            {plant.finalPlantName} Location
                        </h3>
                        {distance && (
                            <p className="text-emerald-100 text-sm mt-1 flex items-center">
                                <Navigation className="h-3 w-3 mr-1" />
                                {distance} km from your current location
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Info Bar */}
                <div className="bg-gray-50 border-b border-gray-200 p-3 grid grid-cols-2 gap-4 text-sm shrink-0">
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Plant Location</span>
                        <span className="font-semibold text-emerald-700">{plantCity}</span>
                        <span className="text-xs text-gray-400">Lat: {plantLocation[0].toFixed(4)}, Lng: {plantLocation[1].toFixed(4)}</span>
                    </div>
                    <div className="flex flex-col border-l pl-4">
                        <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Your Location</span>
                        {loadingLocation ? (
                            <span className="flex items-center text-gray-600"><Loader2 className="h-3 w-3 animate-spin mr-1"/> Locating...</span>
                        ) : (
                            <>
                                <span className="font-semibold text-blue-700">{userCity}</span>
                                {userLocation && <span className="text-xs text-gray-400">Lat: {userLocation[0].toFixed(4)}, Lng: {userLocation[1].toFixed(4)}</span>}
                            </>
                        )}
                    </div>
                </div>

                {/* Map Container */}
                <div className="flex-grow relative z-0">
                    <MapContainer center={plantLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        <ChangeView bounds={userLocation ? bounds : null} />

                        {/* Plant Marker */}
                        <Marker position={plantLocation}>
                            <Popup>
                                <strong>{plant.finalPlantName}</strong><br />
                                Verified Location
                            </Popup>
                        </Marker>

                        {/* User Marker */}
                        {userLocation && (
                            <Marker position={userLocation}>
                                <Popup>You are here</Popup>
                            </Marker>
                        )}

                        {/* Line connecting them */}
                        {userLocation && (
                            <Polyline positions={[plantLocation, userLocation]} color="blue" dashArray="10, 10" />
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default PlantMapModal;