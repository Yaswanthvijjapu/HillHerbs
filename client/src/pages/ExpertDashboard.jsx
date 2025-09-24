import React, { useState, useEffect, useCallback } from 'react';
import plantService from '../services/plantService';
import SubmissionCard from '../components/dashboard/SubmissionCard';
import HistoryCard from '../components/dashboard/HistoryCard';
import Spinner from '../components/shared/Spinner';
import Modal from '../components/shared/Modal';

// --- Main Dashboard Component ---
function ExpertDashboard() {
    // --- State Management ---
    const [pendingSubmissions, setPendingSubmissions] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Use Promise.all to fetch both sets of data concurrently for better performance
            const [pendingRes, historyRes] = await Promise.all([
                plantService.getPending(),
                plantService.getHistory()
            ]);
            setPendingSubmissions(pendingRes.data);
            setHistory(historyRes.data);
        } catch (err) {
            setError('Failed to fetch dashboard data. Please try refreshing the page.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Event Handlers ---
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
            // Refetch all data to get the latest state for both pending and history lists
            fetchData(); 
            handleCloseModal(); // Close the modal on success
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update submission.';
            // Display the error to the user
            alert(errorMessage);
        }
    };

    // --- Render Logic ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-2 text-gray-600">Loading Dashboard Data...</p>
                </div>
            </div>
        );
    }

    const verifiedHistory = history.filter(item => item.status === 'verified');
    const rejectedHistory = history.filter(item => item.status === 'rejected');

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Expert Verification Dashboard</h2>
            <p className="text-gray-600 mb-8">Review and validate plant submissions from the community.</p>

            {error && <p className="text-red-600 bg-red-50 p-3 rounded-md text-sm text-center mb-6">{error}</p>}

            {/* Section for Pending Submissions */}
            <section>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Pending Verification ({pendingSubmissions.length})</h3>
                {pendingSubmissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {pendingSubmissions.map(submission => (
                            <SubmissionCard 
                                key={submission._id} 
                                submission={submission} 
                                onVerifyClick={() => handleOpenModal(submission)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                        <h3 className="text-xl font-medium text-gray-800">All caught up!</h3>
                        <p className="text-gray-500 mt-2">There are no new submissions to verify.</p>
                    </div>
                )}
            </section>
            
            {/* Section for Verification History */}
            <section className="mt-16">
                 <h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Your Recent Activity</h3>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Column for Verified Plants */}
                    <div>
                        <h4 className="text-xl font-medium text-green-700 mb-3">Recently Verified ({verifiedHistory.length})</h4>
                        {verifiedHistory.length > 0 ? (
                            <div className="space-y-4">
                                {verifiedHistory.map(item => <HistoryCard key={item._id} submission={item} />)}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm mt-4">No verified plants in your recent history.</p>
                        )}
                    </div>
                    {/* Column for Rejected Plants */}
                    <div>
                        <h4 className="text-xl font-medium text-red-700 mb-3">Recently Rejected ({rejectedHistory.length})</h4>
                        {rejectedHistory.length > 0 ? (
                            <div className="space-y-4">
                                {rejectedHistory.map(item => <HistoryCard key={item._id} submission={item} />)}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm mt-4">No rejected plants in your recent history.</p>
                        )}
                    </div>
                 </div>
            </section>

            {/* The Verification Modal (rendered here but only visible when isModalOpen is true) */}
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


// --- Nested Component for the Modal's Form 
const VerificationForm = ({ submission, onUpdate, onClose }) => {
    const [action, setAction] = useState('approve');
    const [correctedName, setCorrectedName] = useState('');
    const [verificationMethod, setVerificationMethod] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [expertNotes, setExpertNotes] = useState('');
    const [medicinalUses, setMedicinalUses] = useState('');
    const [importance, setImportance] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = { action, correctedName, verificationMethod, rejectionReason, expertNotes, medicinalUses, importance };
        await onUpdate(submission._id, payload);
        // Parent component will handle closing and loading state
    };
    
    // Base classes for all input fields for consistency
    const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <p className="text-sm text-gray-600">AI Suggestion: <strong className="text-lg text-gray-800">{submission.aiSuggestedName}</strong></p>
                <img src={submission.imageURL} alt="Submission" className="w-full h-48 object-cover rounded-md my-2" />
            </div>

            <div>
                <label htmlFor="action-select" className="block text-sm font-medium text-gray-700">Action</label>
                <select id="action-select" value={action} onChange={(e) => setAction(e.target.value)} className={inputClasses}>
                    <option value="approve">Approve AI Suggestion</option>
                    <option value="correct">Correct & Approve</option>
                    <option value="reject">Reject Submission</option>
                </select>
            </div>

            {/* --- Conditional Fields for APPROVE or CORRECT --- */}
            {(action === 'approve' || action === 'correct') && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-md border">
                    {action === 'correct' && (
                         <div>
                            <label htmlFor="correctedName" className="block text-sm font-medium text-gray-700">Correct Plant Name (Required)</label>
                            <input id="correctedName" type="text" value={correctedName} onChange={e => setCorrectedName(e.target.value)} placeholder="Enter the correct name" required className={inputClasses} />
                        </div>
                    )}
                    <div>
                        <label htmlFor="verificationMethod" className="block text-sm font-medium text-gray-700">Verification Method (Required)</label>
                        <input id="verificationMethod" type="text" value={verificationMethod} onChange={e => setVerificationMethod(e.target.value)} placeholder="e.g., Cross-referenced with 'Ayurvedic Pharmacopoeia'" required className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="medicinalUses" className="block text-sm font-medium text-gray-700">Medicinal Uses (Required)</label>
                        <textarea id="medicinalUses" value={medicinalUses} onChange={e => setMedicinalUses(e.target.value)} rows="4" placeholder="e.g., Used for treating skin ailments, improving digestion..." required className={inputClasses}></textarea>
                    </div>
                    <div>
                        <label htmlFor="importance" className="block text-sm font-medium text-gray-700">Importance & Harvesting Notes (Optional)</label>
                        <textarea id="importance" value={importance} onChange={e => setImportance(e.target.value)} rows="3" placeholder="e.g., Rare species, harvest only mature leaves..." className={inputClasses}></textarea>
                    </div>
                </div>
            )}
             
             {/* --- Conditional Field for REJECT --- */}
             {action === 'reject' && (
                 <div className="p-4 bg-gray-50 rounded-md border">
                    <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">Rejection Reason (Required)</label>
                    <input id="rejectionReason" type="text" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="e.g., Misidentified, non-medicinal lookalike" required className={inputClasses} />
                </div>
            )}

            {/* --- Field for Additional Notes (Common to all actions) --- */}
            <div>
                <label htmlFor="expertNotes" className="block text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                <textarea id="expertNotes" value={expertNotes} onChange={e => setExpertNotes(e.target.value)} rows="3" placeholder="e.g., Found in the upper regions of..." className={inputClasses}></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50" disabled={loading}>Cancel</button>
                <button type="submit" disabled={loading} className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400">
                    {loading && <Spinner />}
                    {loading ? "Submitting..." : "Submit Verification"}
                </button>
            </div>
        </form>
    );
}
export default ExpertDashboard;