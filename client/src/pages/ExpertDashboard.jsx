import React, { useState, useEffect, useCallback } from 'react';
import plantService from '../services/plantService';
import SubmissionCard from '../components/dashboard/SubmissionCard';
import Spinner from '../components/shared/Spinner';

function ExpertDashboard() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSubmissions = useCallback(async () => {
        try {
            const response = await plantService.getPending();
            setSubmissions(response.data);
        } catch (err) {
            setError('Failed to fetch submissions.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const handleUpdateSubmission = async (id, action, correctedName) => {
        try {
            await plantService.verify(id, action, correctedName);
            // Remove the updated submission from the list for a smooth UI experience
            setSubmissions(prev => prev.filter(sub => sub._id !== id));
        } catch (err) {
            setError('Failed to update submission. Please try again.');
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Expert Verification Dashboard</h2>
            <p className="text-gray-600 mb-8">Review and validate plant submissions from the community.</p>
            
            {error && <p className="text-red-500 bg-red-50 p-3 rounded-md text-sm text-center mb-4">{error}</p>}
            
            {submissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {submissions.map(submission => (
                        <SubmissionCard 
                            key={submission._id} 
                            submission={submission} 
                            onUpdate={handleUpdateSubmission}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-medium text-gray-800">All caught up!</h3>
                    <p className="text-gray-500 mt-2">There are no new submissions to verify at this time.</p>
                </div>
            )}
        </div>
    );
}

export default ExpertDashboard;