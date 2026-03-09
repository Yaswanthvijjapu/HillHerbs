import React, { useState } from 'react';
import { MapPin, BookOpen, ShieldCheck, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

function PlantCard({ plant, onMapClick }) {
    const { finalPlantName, imageURL, location, medicinalUses, importance } = plant;
    const latitude = location.coordinates[1].toFixed(4);
    const longitude = location.coordinates[0].toFixed(4);

    // --- State for Show More / Show Less ---
    const [showFullUses, setShowFullUses] = useState(false);
    const[showFullNotes, setShowFullNotes] = useState(false);

    // Character limits to determine if we need a "Read More" button
    const USES_LIMIT = 120;
    const NOTES_LIMIT = 100;

    const needsUsesToggle = medicinalUses && medicinalUses.length > USES_LIMIT;
    const needsNotesToggle = importance && importance.length > NOTES_LIMIT;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col border border-gray-100">
            {/* Image with Verified Badge */}
            <div className="relative">
                <img src={imageURL} alt={finalPlantName} className="w-full h-56 object-cover" />
                <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full flex items-center shadow-lg">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs font-semibold">Verified</span>
                </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-emerald-800 mb-4 border-b-2 border-emerald-100 pb-2">
                    {finalPlantName}
                </h3>

                {/* Medicinal Uses */}
                <div className="mb-4 bg-emerald-50 p-4 rounded-lg transition-all duration-300">
                    <div className="flex items-center text-emerald-700 mb-2">
                        <BookOpen className="h-5 w-5 mr-2" />
                        <h4 className="font-bold text-sm uppercase tracking-wide">Medicinal Uses</h4>
                    </div>
                    <div className="text-gray-800 text-sm leading-relaxed">
                        <p className={!showFullUses ? "line-clamp-3" : ""}>
                            {medicinalUses || 'No uses specified.'}
                        </p>
                        {needsUsesToggle && (
                            <button 
                                onClick={() => setShowFullUses(!showFullUses)}
                                className="flex items-center text-emerald-600 hover:text-emerald-800 font-bold text-xs mt-2 transition-colors"
                            >
                                {showFullUses ? 'Show Less' : 'Read More'}
                                {showFullUses ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Importance & Conservation */}
                {importance && (
                    <div className="mb-4 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 transition-all duration-300">
                        <div className="flex items-center text-yellow-700 mb-2">
                            <ShieldCheck className="h-5 w-5 mr-2" />
                            <h4 className="font-bold text-sm uppercase tracking-wide">Conservation</h4>
                        </div>
                        <div className="text-gray-800 text-sm leading-relaxed">
                            <p className={!showFullNotes ? "line-clamp-2" : ""}>
                                {importance}
                            </p>
                            {needsNotesToggle && (
                                <button 
                                    onClick={() => setShowFullNotes(!showFullNotes)}
                                    className="flex items-center text-yellow-700 hover:text-yellow-900 font-bold text-xs mt-2 transition-colors"
                                >
                                    {showFullNotes ? 'Show Less' : 'Read More'}
                                    {showFullNotes ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                                </button>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Location Section */}
                <div className="mt-auto pt-4 border-t-2 border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-blue-700">
                             <MapPin className="h-5 w-5 mr-2" />
                             <h4 className="font-bold text-sm uppercase tracking-wide">Verified Location</h4>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 bg-blue-50 p-3 rounded-lg border border-blue-200 font-mono text-sm text-gray-800 text-center flex flex-col justify-center">
                            <span>Lat: {latitude}</span>
                            <span>Lon: {longitude}</span>
                        </div>
                        <button 
                            onClick={() => onMapClick(plant)} // Trigger the map
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow transition-colors flex items-center justify-center text-sm font-medium"
                        >
                            <MapPin className="h-4 w-4 mr-2" />
                            View on Map
                        </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2 italic text-center">
                        🔒 Protected data for authorized research only.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PlantCard;