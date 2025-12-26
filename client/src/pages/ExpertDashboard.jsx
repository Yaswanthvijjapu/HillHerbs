import React, { useState, useEffect, useCallback } from 'react';
import plantService from '../services/plantService';
import SubmissionCard from '../components/dashboard/SubmissionCard';
import HistoryCard from '../components/dashboard/HistoryCard';
import Modal from '../components/shared/Modal';
import { useAuth } from '../hooks/useAuth'; 
import { 
  Briefcase, Mail, Phone, Award, User, BookText, 
  Shield, CheckCircle, XCircle, Clock, BarChart3,
  FileSearch, AlertCircle, Info, Search, Filter,
  Calendar, MapPin, Leaf, Users, Eye
} from 'lucide-react';

function ExpertDashboard() {
    const { user } = useAuth();
    const [pendingSubmissions, setPendingSubmissions] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [stats, setStats] = useState({
        pending: 0,
        verified: 0,
        rejected: 0,
        totalReviewed: 0
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [pendingRes, historyRes] = await Promise.all([
                plantService.getPending(),
                plantService.getHistory()
            ]);
            setPendingSubmissions(pendingRes.data);
            setHistory(historyRes.data);
            
            // Calculate stats
            const verifiedHistory = historyRes.data.filter(item => item.status === 'verified');
            const rejectedHistory = historyRes.data.filter(item => item.status === 'rejected');
            
            setStats({
                pending: pendingRes.data.length,
                verified: verifiedHistory.length,
                rejected: rejectedHistory.length,
                totalReviewed: verifiedHistory.length + rejectedHistory.length
            });
        } catch (err) {
            setError('Failed to fetch dashboard data. Please try refreshing the page.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
            fetchData();
            handleCloseModal();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update submission.';
            alert(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-lg animate-pulse">
                        <Leaf className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">Loading Expert Dashboard...</p>
                    <p className="text-sm text-gray-500 mt-2">Fetching your verification data</p>
                </div>
            </div>
        );
    }

    const verifiedHistory = history.filter(item => item.status === 'verified');
    const rejectedHistory = history.filter(item => item.status === 'rejected');

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900">Expert Verification Portal</h1>
                                    <p className="text-lg text-gray-600 mt-2">Review and validate plant submissions from the community</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Expert Profile Card */}
                        {user && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-w-[300px]">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                                        <User className="h-7 w-7 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{user.fullName}</h3>
                                        <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold mt-1">
                                            <Briefcase className="h-3 w-3 mr-1" />
                                            {user.expertiseArea || 'Plant Expert'}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {user.workplace && (
                                        <div className="flex items-center text-gray-600">
                                            <Briefcase className="h-4 w-4 mr-2 text-emerald-500" />
                                            <span className="truncate">{user.workplace}</span>
                                        </div>
                                    )}
                                    {user.yearsOfExperience && (
                                        <div className="flex items-center text-gray-600">
                                            <Award className="h-4 w-4 mr-2 text-emerald-500" />
                                            <span>{user.yearsOfExperience} years</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-800">Pending Review</p>
                                    <p className="text-3xl font-bold text-blue-900 mt-2">{stats.pending}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <Clock className="h-8 w-8 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-800">Verified Plants</p>
                                    <p className="text-3xl font-bold text-emerald-900 mt-2">{stats.verified}</p>
                                </div>
                                <div className="p-3 bg-emerald-100 rounded-xl">
                                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-800">Rejected Submissions</p>
                                    <p className="text-3xl font-bold text-red-900 mt-2">{stats.rejected}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-xl">
                                    <XCircle className="h-8 w-8 text-red-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-800">Total Reviewed</p>
                                    <p className="text-3xl font-bold text-purple-900 mt-2">{stats.totalReviewed}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <BarChart3 className="h-8 w-8 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl">
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-red-800">Error Loading Data</p>
                                <p className="text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pending Submissions Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                                <FileSearch className="h-6 w-6 mr-3 text-emerald-600" />
                                Pending Verification
                                <span className="ml-3 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                                    {pendingSubmissions.length} submissions
                                </span>
                            </h3>
                            <p className="text-gray-600 mt-2">Review and verify new plant submissions from community members</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search submissions..." 
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </button>
                        </div>
                    </div>
                    
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
                        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6">
                                <CheckCircle className="h-10 w-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">All caught up!</h3>
                            <p className="text-gray-600 mt-3 max-w-md mx-auto">
                                There are no new submissions to verify. Check back later for new plant submissions.
                            </p>
                        </div>
                    )}
                </section>
                
                {/* Verification History Section */}
                <section className="mb-16">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center mb-8">
                        <Calendar className="h-6 w-6 mr-3 text-emerald-600" />
                        Your Recent Activity
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Verified Plants Column */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-6 py-4 border-b border-emerald-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-6 w-6 text-emerald-600 mr-3" />
                                        <h4 className="text-xl font-bold text-emerald-900">Recently Verified</h4>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                                        {verifiedHistory.length} plants
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                {verifiedHistory.length > 0 ? (
                                    <div className="space-y-6">
                                        {verifiedHistory.slice(0, 3).map(item => <HistoryCard key={item._id} submission={item} />)}
                                        {verifiedHistory.length > 3 && (
                                            <div className="text-center pt-4 border-t border-gray-100">
                                                <button className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center justify-center mx-auto">
                                                    View all {verifiedHistory.length} verified plants
                                                    <Eye className="h-4 w-4 ml-2" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                                            <Leaf className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500">No verified plants in your recent history</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Rejected Plants Column */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <XCircle className="h-6 w-6 text-red-600 mr-3" />
                                        <h4 className="text-xl font-bold text-red-900">Recently Rejected</h4>
                                    </div>
                                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                                        {rejectedHistory.length} submissions
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                {rejectedHistory.length > 0 ? (
                                    <div className="space-y-6">
                                        {rejectedHistory.slice(0, 3).map(item => <HistoryCard key={item._id} submission={item} />)}
                                        {rejectedHistory.length > 3 && (
                                            <div className="text-center pt-4 border-t border-gray-100">
                                                <button className="text-red-600 font-medium hover:text-red-700 flex items-center justify-center mx-auto">
                                                    View all {rejectedHistory.length} rejected submissions
                                                    <Eye className="h-4 w-4 ml-2" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                                            <AlertCircle className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500">No rejected plants in your recent history</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Tips Section */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
                    <div className="flex items-center mb-6">
                        <Info className="h-6 w-6 text-emerald-600 mr-3" />
                        <h3 className="text-xl font-bold text-gray-900">Verification Guidelines</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded-xl shadow-sm">
                            <div className="text-emerald-600 font-semibold mb-3 flex items-center">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Accuracy First
                            </div>
                            <p className="text-sm text-gray-600">Always cross-reference with verified botanical sources before approving submissions.</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm">
                            <div className="text-emerald-600 font-semibold mb-3 flex items-center">
                                <BookText className="h-5 w-5 mr-2" />
                                Detailed Notes
                            </div>
                            <p className="text-sm text-gray-600">Provide comprehensive medicinal uses and identification details for community education.</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm">
                            <div className="text-emerald-600 font-semibold mb-3 flex items-center">
                                <Users className="h-5 w-5 mr-2" />
                                Community Help
                            </div>
                            <p className="text-sm text-gray-600">Your verifications help community members learn about local medicinal plants.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
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

// Verification Form Component
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
    };
    
    const inputClasses = "mt-2 px-4 py-3 w-full rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none";
    const labelClasses = "block text-sm font-semibold text-gray-900";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submission Preview */}
            <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <img src={submission.imageURL} alt="Plant submission" className="w-32 h-32 object-cover rounded-xl shadow-md" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg">Plant Submission Details</h4>
                        <p className="text-sm text-gray-600 mt-2">Submitted by: <span className="font-medium">{submission.userId?.username || 'Unknown User'}</span></p>
                        <div className="mt-4">
                            <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                <Leaf className="h-4 w-4 mr-2" />
                                AI Suggestion: <span className="ml-1 font-bold">{submission.aiSuggestedName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Selection */}
            <div>
                <label className={labelClasses}>
                    <Shield className="inline h-4 w-4 mr-2 text-emerald-600" />
                    Verification Action
                </label>
                <div className="grid grid-cols-3 gap-4 mt-3">
                    <button
                        type="button"
                        onClick={() => setAction('approve')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${action === 'approve' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'}`}
                    >
                        <CheckCircle className={`h-6 w-6 mb-2 ${action === 'approve' ? 'text-emerald-600' : 'text-gray-400'}`} />
                        <span className={`font-medium ${action === 'approve' ? 'text-emerald-800' : 'text-gray-700'}`}>Approve</span>
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setAction('correct')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${action === 'correct' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                    >
                        <FileSearch className={`h-6 w-6 mb-2 ${action === 'correct' ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className={`font-medium ${action === 'correct' ? 'text-blue-800' : 'text-gray-700'}`}>Correct</span>
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setAction('reject')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${action === 'reject' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}
                    >
                        <XCircle className={`h-6 w-6 mb-2 ${action === 'reject' ? 'text-red-600' : 'text-gray-400'}`} />
                        <span className={`font-medium ${action === 'reject' ? 'text-red-800' : 'text-gray-700'}`}>Reject</span>
                    </button>
                </div>
            </div>

            {/* Conditional Fields for APPROVE or CORRECT */}
            {(action === 'approve' || action === 'correct') && (
                <div className="space-y-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                    {action === 'correct' && (
                        <div>
                            <label className={labelClasses}>
                                <BookText className="inline h-4 w-4 mr-2 text-emerald-600" />
                                Correct Plant Name (Required)
                            </label>
                            <input 
                                type="text" 
                                value={correctedName} 
                                onChange={e => setCorrectedName(e.target.value)} 
                                placeholder="Enter the correct botanical name"
                                required 
                                className={inputClasses}
                            />
                        </div>
                    )}
                    
                    <div>
                        <label className={labelClasses}>
                            <Shield className="inline h-4 w-4 mr-2 text-emerald-600" />
                            Verification Method (Required)
                        </label>
                        <input 
                            type="text" 
                            value={verificationMethod} 
                            onChange={e => setVerificationMethod(e.target.value)} 
                            placeholder="e.g., Cross-referenced with 'Ayurvedic Pharmacopoeia'"
                            required 
                            className={inputClasses}
                        />
                    </div>
                    
                    <div>
                        <label className={labelClasses}>
                            <Leaf className="inline h-4 w-4 mr-2 text-emerald-600" />
                            Medicinal Uses (Required)
                        </label>
                        <textarea 
                            value={medicinalUses} 
                            onChange={e => setMedicinalUses(e.target.value)} 
                            rows="4" 
                            placeholder="e.g., Used for treating skin ailments, improving digestion..."
                            required 
                            className={inputClasses}
                        ></textarea>
                    </div>
                    
                    <div>
                        <label className={labelClasses}>
                            <Info className="inline h-4 w-4 mr-2 text-emerald-600" />
                            Importance & Harvesting Notes (Optional)
                        </label>
                        <textarea 
                            value={importance} 
                            onChange={e => setImportance(e.target.value)} 
                            rows="3" 
                            placeholder="e.g., Rare species, harvest only mature leaves..."
                            className={inputClasses}
                        ></textarea>
                    </div>
                </div>
            )}
            
            {/* Conditional Field for REJECT */}
            {action === 'reject' && (
                <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
                    <label className={labelClasses}>
                        <XCircle className="inline h-4 w-4 mr-2 text-red-600" />
                        Rejection Reason (Required)
                    </label>
                    <input 
                        type="text" 
                        value={rejectionReason} 
                        onChange={e => setRejectionReason(e.target.value)} 
                        placeholder="e.g., Misidentified, non-medicinal lookalike, poor image quality"
                        required 
                        className={inputClasses}
                    />
                </div>
            )}

            {/* Additional Notes */}
            <div>
                <label className={labelClasses}>
                    <BookText className="inline h-4 w-4 mr-2 text-emerald-600" />
                    Additional Notes (Optional)
                </label>
                <textarea 
                    value={expertNotes} 
                    onChange={e => setExpertNotes(e.target.value)} 
                    rows="3" 
                    placeholder="e.g., Found in the upper regions of... Note about conservation status..."
                    className={inputClasses}
                ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button 
                    type="button" 
                    onClick={onClose} 
                    disabled={loading}
                    className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                >
                    {loading ? (
                        <span className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Submitting...
                        </span>
                    ) : (
                        <span className="flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Submit Verification
                        </span>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ExpertDashboard;