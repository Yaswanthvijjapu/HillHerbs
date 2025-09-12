// client/src/components/dashboard/SubmissionCard.jsx
import React from 'react';

// The card is now much simpler. Its only job is to display info and trigger the modal.
function SubmissionCard({ submission, onVerifyClick }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={submission.imageURL} alt="Plant Submission" className="w-full h-48 object-cover" />
            <div className="p-4">
                <p className="text-sm text-gray-500">Submitted by: {submission.submittedBy.username}</p>
                <p className="font-semibold text-lg text-gray-800">AI Suggestion: <span className="text-green-600">{submission.aiSuggestedName}</span></p>
                <p className="text-xs text-gray-500">Location: {submission.location.coordinates[1].toFixed(4)}, {submission.location.coordinates[0].toFixed(4)}</p>
                
                <div className="mt-4">
                    <button 
                        onClick={onVerifyClick} 
                        className="w-full text-center py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium"
                    >
                        Review & Verify
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SubmissionCard;