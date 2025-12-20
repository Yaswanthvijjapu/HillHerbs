// client/src/components/knowledge-hub/PlantCard.jsx
import React from 'react';
import { MapPin, BookOpen, ShieldCheck, CheckCircle } from 'lucide-react';

function PlantCard({ plant }) {
    const { finalPlantName, imageURL, location, medicinalUses, importance } = plant;
    const latitude = location.coordinates[1].toFixed(4);
    const longitude = location.coordinates[0].toFixed(4);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col border border-gray-100">
            {/* Image with Verified Badge */}
            <div className="relative">
                <img src={imageURL} alt={finalPlantName} className="w-full h-56 object-cover" />
                <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full flex items-center shadow-lg">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs font-semibold">Expert Verified</span>
                </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-green-800 mb-4 border-b-2 border-green-100 pb-2">
                    {finalPlantName}
                </h3>

                {/* Medicinal Uses */}
                <div className="mb-4 bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center text-green-700 mb-2">
                        <BookOpen className="h-5 w-5 mr-2" />
                        <h4 className="font-bold text-sm uppercase tracking-wide">Medicinal Uses</h4>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">
                        {medicinalUses || 'No uses specified.'}
                    </p>
                </div>

                {/* Importance & Harvesting Notes */}
                {importance && (
                    <div className="mb-4 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                        <div className="flex items-center text-yellow-700 mb-2">
                            <ShieldCheck className="h-5 w-5 mr-2" />
                            <h4 className="font-bold text-sm uppercase tracking-wide">Conservation & Notes</h4>
                        </div>
                        <p className="text-gray-800 text-sm leading-relaxed">
                            {importance}
                        </p>
                    </div>
                )}
                
                {/* Location - This is the key part for authorized bodies */}
                <div className="mt-auto pt-4 border-t-2 border-gray-200">
                    <div className="flex items-center text-blue-700 mb-2">
                         <MapPin className="h-5 w-5 mr-2" />
                         <h4 className="font-bold text-sm uppercase tracking-wide">Verified Location</h4>
                    </div>
                    <p className="text-gray-900 text-sm font-mono bg-blue-50 p-3 rounded-lg border border-blue-200">
                        Lat: {latitude}, Lon: {longitude}
                    </p>
                    <p className="text-xs text-gray-600 mt-2 italic bg-gray-50 p-2 rounded">
                        🔒 Protected data for authorized research & conservation bodies only.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PlantCard;