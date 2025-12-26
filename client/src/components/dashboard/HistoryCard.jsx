// client/src/components/dashboard/HistoryCard.jsx
import React from 'react';
import { CheckCircle, XCircle, Calendar, User, FileText, MapPin, Leaf } from 'lucide-react';

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: 'numeric', month: 'short', day: 'numeric',
    });
};

function HistoryCard({ submission }) {
    const isVerified = submission.status === 'verified';

    return (
        <div className={`group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border ${isVerified ? 'border-emerald-200' : 'border-red-200'}`}>
            {/* Header */}
            <div className={`px-5 py-4 ${isVerified ? 'bg-gradient-to-r from-emerald-50 to-green-50' : 'bg-gradient-to-r from-red-50 to-pink-50'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl ${isVerified ? 'bg-emerald-100' : 'bg-red-100'}`}>
                            {isVerified ? (
                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                            )}
                        </div>
                        <div>
                            <h3 className={`font-bold text-lg ${isVerified ? 'text-emerald-800' : 'text-red-800'}`}>
                                {isVerified ? submission.finalPlantName : 'Submission Rejected'}
                            </h3>
                            <div className="flex items-center space-x-3 mt-1">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                </span>
                                <div className="flex items-center text-xs text-gray-500">
                                    <Leaf className="h-3 w-3 mr-1" />
                                    <span>AI: {submission.aiSuggestedName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Verification Details */}
                <div className="mb-4">
                    <div className="flex items-center text-gray-600 mb-3">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="text-xs font-semibold uppercase tracking-wide">
                            {isVerified ? 'Verification Details' : 'Rejection Details'}
                        </span>
                    </div>
                    <div className={`p-4 rounded-xl ${isVerified ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                        <p className={`text-sm ${isVerified ? 'text-emerald-800' : 'text-red-800'}`}>
                            <span className="font-semibold">{isVerified ? 'Method:' : 'Reason:'}</span> {isVerified ? submission.verificationMethod : submission.rejectionReason}
                        </p>
                        {submission.expertNotes && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-700">{submission.expertNotes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Metadata */}
                <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span className="text-xs">Submitted by: <span className="font-medium">{submission.submittedBy.username}</span></span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-xs">Verified on: <span className="font-medium">{formatDate(submission.updatedAt)}</span></span>
                    </div>
                    {submission.location && (
                        <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="text-xs">
                                Location: <span className="font-mono font-medium">
                                    {submission.location.coordinates[1].toFixed(4)}, {submission.location.coordinates[0].toFixed(4)}
                                </span>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                <div className="text-xs text-gray-500">
                    {isVerified ? '✅ Plant successfully verified and added to database' : '❌ Submission did not meet verification criteria'}
                </div>
            </div>
        </div>
    );
}

export default HistoryCard;