// client/src/components/knowledge-hub/PlantCard.jsx
import React, { useState } from 'react';
import { MapPin, BookOpen, ShieldCheck, CheckCircle, Leaf, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

function PlantCard({ plant }) {
    const { finalPlantName, imageURL, location, medicinalUses, importance } = plant;
    const latitude = location.coordinates[1].toFixed(4);
    const longitude = location.coordinates[0].toFixed(4);
    
    const [showFullMedicinal, setShowFullMedicinal] = useState(false);
    const [showFullConservation, setShowFullConservation] = useState(false);

    return (
        <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col border border-emerald-100">
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
                <img 
                    src={imageURL} 
                    alt={finalPlantName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 rounded-full flex items-center shadow-lg">
                    <CheckCircle className="h-4 w-4 mr-1.5" />
                    <span className="text-xs font-semibold">Expert Verified</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">
                        {finalPlantName}
                    </h3>
                </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                {/* Medicinal Uses */}
                <div className="mb-4">
                    <div className="flex items-center text-emerald-700 mb-3">
                        <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wide">Medicinal Properties</h4>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-100">
                        <p className={`text-gray-800 text-sm leading-relaxed ${!showFullMedicinal && 'line-clamp-3'}`}>
                            {medicinalUses || 'Traditional medicinal uses documented by experts.'}
                        </p>
                        {medicinalUses && medicinalUses.length > 150 && (
                            <button
                                onClick={() => setShowFullMedicinal(!showFullMedicinal)}
                                className="mt-3 inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                            >
                                {showFullMedicinal ? (
                                    <>
                                        Show Less
                                        <ChevronUp className="h-4 w-4 ml-1" />
                                    </>
                                ) : (
                                    <>
                                        See Full Details
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Importance & Harvesting Notes */}
                {importance && (
                    <div className="mb-4">
                        <div className="flex items-center text-amber-700 mb-3">
                            <div className="p-2 bg-amber-100 rounded-lg mr-3">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-wide">Conservation Notes</h4>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100">
                            <p className={`text-gray-800 text-sm leading-relaxed ${!showFullConservation && 'line-clamp-2'}`}>
                                {importance}
                            </p>
                            {importance.length > 100 && (
                                <button
                                    onClick={() => setShowFullConservation(!showFullConservation)}
                                    className="mt-3 inline-flex items-center text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors"
                                >
                                    {showFullConservation ? (
                                        <>
                                            Show Less
                                            <ChevronUp className="h-4 w-4 ml-1" />
                                        </>
                                    ) : (
                                        <>
                                            See Full Notes
                                            <ChevronDown className="h-4 w-4 ml-1" />
                                    </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Location Data */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center text-blue-700 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wide">Verified Location</h4>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-gradient-to-br from-blue-50 to-white p-3 rounded-lg border border-blue-100">
                            <p className="text-xs text-blue-600 font-medium mb-1">Latitude</p>
                            <p className="text-sm font-mono text-gray-900 font-semibold">{latitude}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-white p-3 rounded-lg border border-blue-100">
                            <p className="text-xs text-blue-600 font-medium mb-1">Longitude</p>
                            <p className="text-sm font-mono text-gray-900 font-semibold">{longitude}</p>
                        </div>
                    </div>
                    
                    {/* Protected Data Notice */}
                    <div className="flex items-start bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl border border-gray-200">
                        <ShieldCheck className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5 mr-2" />
                        <p className="text-xs text-gray-600">
                            <span className="font-medium">Protected data:</span> Accessible only to authorized research & conservation organizations for verified use.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlantCard;