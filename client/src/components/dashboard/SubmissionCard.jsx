import React, { useState } from 'react';

function SubmissionCard({ submission, onUpdate }) {
    const [isCorrecting, setIsCorrecting] = useState(false);
    const [correctedName, setCorrectedName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAction = async (action) => {
        if (action === 'correct' && !correctedName) return;
        setLoading(true);
        await onUpdate(submission._id, action, correctedName);
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <img src={submission.imageURL} alt="Plant Submission" className="w-full h-48 object-cover" />
            <div className="p-4">
                <p className="text-sm text-gray-500">Submitted by: {submission.submittedBy.username}</p>
                <p className="font-semibold text-lg text-gray-800">AI Suggestion: <span className="text-green-600">{submission.aiSuggestedName}</span></p>
                <p className="text-xs text-gray-500">Location: {submission.location.coordinates[1].toFixed(4)}, {submission.location.coordinates[0].toFixed(4)}</p>
                
                {isCorrecting && (
                    <div className="my-2">
                        <input
                            type="text"
                            value={correctedName}
                            onChange={(e) => setCorrectedName(e.target.value)}
                            placeholder="Enter correct plant name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                )}
                
                <div className="mt-4 flex justify-between items-center space-x-2">
                    {!isCorrecting ? (
                        <>
                            <button onClick={() => handleAction('approve')} disabled={loading} className="flex-1 text-center py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium disabled:bg-gray-400">Approve</button>
                            <button onClick={() => setIsCorrecting(true)} disabled={loading} className="flex-1 text-center py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm font-medium disabled:bg-gray-400">Correct</button>
                            <button onClick={() => handleAction('reject')} disabled={loading} className="flex-1 text-center py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium disabled:bg-gray-400">Reject</button>
                        </>
                    ) : (
                        <>
                             <button onClick={() => handleAction('correct')} disabled={loading || !correctedName} className="flex-1 text-center py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium disabled:bg-gray-400">Save</button>
                             <button onClick={() => setIsCorrecting(false)} disabled={loading} className="flex-1 text-center py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm font-medium disabled:bg-gray-400">Cancel</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SubmissionCard;