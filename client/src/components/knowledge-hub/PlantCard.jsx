// client/src/components/knowledge-hub/PlantCard.jsx
import React from 'react';
import { MapPin, BookOpen, ShieldCheck } from 'lucide-react';

function PlantCard({ plant }) {
    const { finalPlantName, imageURL, location, medicinalUses, importance } = plant;
    const latitude = location.coordinates[1].toFixed(4);
    const longitude = location.coordinates[0].toFixed(4);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
            <img src={imageURL} alt={finalPlantName} className="w-full h-48 object-cover" />
            
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-green-800 mb-3">{finalPlantName}</h3>

                {/* Medicinal Uses */}
                <div className="mb-4">
                    <div className="flex items-center text-gray-600 mb-2">
                        <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                        <h4 className="font-semibold">Medicinal Uses</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                        {medicinalUses || 'No uses specified.'}
                    </p>
                </div>

                {/* Importance & Harvesting Notes */}
                {importance && (
                    <div className="mb-4">
                        <div className="flex items-center text-gray-600 mb-2">
                            <ShieldCheck className="h-5 w-5 mr-2 text-yellow-600" />
                            <h4 className="font-semibold">Importance & Notes</h4>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {importance}
                        </p>
                    </div>
                )}
                
                {/* Location - This is the key part for authorized bodies */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center text-gray-600">
                         <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                         <h4 className="font-semibold">Verified Location</h4>
                    </div>
                    <p className="text-gray-800 text-sm font-mono bg-gray-100 p-2 rounded-md mt-2">
                        Lat: {latitude}, Lon: {longitude}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">For use by authorized research & conservation bodies only.</p>
                </div>
            </div>
        </div>
    );
}

export default PlantCard;