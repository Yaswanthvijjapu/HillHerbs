// client/src/components/dashboard/HistoryCard.jsx
import React from 'react';

// A simple utility to format dates
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: 'numeric', month: 'short', day: 'numeric',
    });
};

function HistoryCard({ submission }) {
    const isVerified = submission.status === 'verified';

    return (
        <div className={`bg-white rounded-lg shadow-sm border-l-4 ${isVerified ? 'border-green-500' : 'border-red-500'}`}>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className={`text-lg font-bold ${isVerified ? 'text-green-700' : 'text-red-700'}`}>
                            {isVerified ? submission.finalPlantName : 'Rejected'}
                        </p>
                        <p className="text-sm text-gray-500">
                            AI Suggestion was: {submission.aiSuggestedName}
                        </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </span>
                </div>
                
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                    {isVerified ? (
                        <p><strong>Method:</strong> {submission.verificationMethod}</p>
                    ) : (
                        <p><strong>Reason:</strong> {submission.rejectionReason}</p>
                    )}
                    {submission.expertNotes && <p><strong>Notes:</strong> {submission.expertNotes}</p>}
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-400">
                    <p>Submitted by {submission.submittedBy.username} | Verified on {formatDate(submission.updatedAt)}</p>
                </div>
            </div>
        </div>
    );
}

export default HistoryCard;