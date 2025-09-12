import React, { useState, useEffect, useCallback } from 'react';
import plantService from '../services/plantService';
import SubmissionCard from '../components/dashboard/SubmissionCard';
import Spinner from '../components/shared/Spinner';
import Modal from '../components/shared/Modal';

// --- Main Dashboard Component ---
function ExpertDashboard() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await plantService.getPending();
            setSubmissions(response.data);
        } catch (err) {
            setError('Failed to fetch submissions. Please try refreshing the page.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const handleOpenModal = (submission) => {
        setSelectedSubmission(submission);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSubmission(null);
    };

    const handleUpdateSubmission = async (id, payload) => {
        try {
            await plantService.verify(id, payload);
            // Remove the verified submission from the local state for an immediate UI update
            setSubmissions(prev => prev.filter(sub => sub._id !== id));
            handleCloseModal(); // Close the modal on success
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update submission.';
            // In a real app, you'd show this error inside the modal itself
            alert(errorMessage);
        }
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-2 text-gray-600">Loading submissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Expert Verification Dashboard</h2>
            <p className="text-gray-600 mb-8">Review and validate plant submissions from the community.</p>
            
            {error && <p className="text-red-600 bg-red-50 p-3 rounded-md text-sm text-center mb-6">{error}</p>}
            
            {submissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {submissions.map(submission => (
                        <SubmissionCard 
                            key={submission._id} 
                            submission={submission} 
                            onVerifyClick={() => handleOpenModal(submission)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow-md mt-8">
                    <h3 className="text-2xl font-semibold text-gray-800">All Caught Up!</h3>
                    <p className="text-gray-500 mt-2">There are no new submissions to verify at this time.</p>
                </div>
            )}

            {/* --- THE VERIFICATION MODAL --- */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Verify Plant Submission">
                {selectedSubmission && (
                    <VerificationForm 
                        submission={selectedSubmission}
                        onUpdate={handleUpdateSubmission}
                        onClose={handleCloseModal}
                    />
                )}
            </Modal>
        </div>
    );
}


// --- Nested Component for the Modal's Form ---
const VerificationForm = ({ submission, onUpdate, onClose }) => {
    const [action, setAction] = useState('approve'); // 'approve', 'reject', 'correct'
    const [correctedName, setCorrectedName] = useState('');
    const [verificationMethod, setVerificationMethod] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [expertNotes, setExpertNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const payload = { action, correctedName, verificationMethod, rejectionReason, expertNotes };
        // The onUpdate function is passed from the parent and will handle the API call
        await onUpdate(submission._id, payload); 
        setLoading(false);
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <p className="text-sm text-gray-600">AI Suggestion: <strong className="text-lg text-gray-800">{submission.aiSuggestedName}</strong></p>
                <img src={submission.imageURL} alt="Submission" className="w-full h-48 object-cover rounded-md my-2" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Action</label>
                <select value={action} onChange={(e) => setAction(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                    <option value="approve">Approve AI Suggestion</option>
                    <option value="correct">Correct & Approve</option>
                    <option value="reject">Reject Submission</option>
                </select>
            </div>

            {/* Conditional Fields based on Action */}
            {(action === 'approve' || action === 'correct') && (
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Verification Method (Required)</label>
                    <input type="text" value={verificationMethod} onChange={e => setVerificationMethod(e.target.value)} placeholder="e.g., Cross-referenced with 'Ayurvedic Pharmacopoeia'" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>
            )}
            {action === 'correct' && (
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Correct Plant Name (Required)</label>
                    <input type="text" value={correctedName} onChange={e => setCorrectedName(e.target.value)} placeholder="Enter the correct name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>
            )}
             {action === 'reject' && (
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Rejection Reason (Required)</label>
                    <input type="text" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="e.g., Misidentified, it is a non-medicinal lookalike" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                <textarea value={expertNotes} onChange={e => setExpertNotes(e.target.value)} rows="3" placeholder="e.g., Found in the upper regions of..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></textarea>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50" disabled={loading}>Cancel</button>
                <button type="submit" disabled={loading} className="inline-flex justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400">
                    {loading && <Spinner />}
                    {loading ? "Submitting..." : "Submit Verification"}
                </button>
            </div>
        </form>
    );
}

export default ExpertDashboard;