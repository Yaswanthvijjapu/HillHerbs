// client/src/components/dashboard/SubmissionCard.jsx
import React from 'react';
import { Eye, MapPin, User, Leaf, Clock, ArrowRight } from 'lucide-react';

function SubmissionCard({ submission, onVerifyClick }) {
    return (
        <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100">
            {/* Image with Overlay */}
            <div className="relative h-56 overflow-hidden">
                <img 
                    src={submission.imageURL} 
                    alt="Plant Submission" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Submission Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium">Submitted by {submission.submittedBy.username}</span>
                    </div>
                </div>
            </div>
            
            <div className="p-5">
                {/* AI Suggestion */}
                <div className="mb-4">
                    <div className="flex items-center text-gray-600 mb-2">
                        <Leaf className="h-4 w-4 mr-2" />
                        <span className="text-xs font-semibold uppercase tracking-wide">AI Suggestion</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                        {submission.aiSuggestedName}
                    </h3>
                </div>

                {/* Location */}
                <div className="mb-5">
                    <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Location</span>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-xl">
                        <p className="text-sm font-mono text-gray-900 font-medium">
                            {submission.location.coordinates[1].toFixed(6)}, {submission.location.coordinates[0].toFixed(6)}
                        </p>
                    </div>
                </div>

                {/* Verify Button */}
                <button 
                    onClick={onVerifyClick} 
                    className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    <Eye className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Review & Verify</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}

export default SubmissionCard;