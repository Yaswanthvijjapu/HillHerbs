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
  Calendar, MapPin, Leaf, Users, Eye, ChevronDown, ChevronUp 
} from 'lucide-react';

function ExpertDashboard() {
    const { user } = useAuth();
    const [pendingSubmissions, setPendingSubmissions] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const[isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [stats, setStats] = useState({
        pending: 0,
        verified: 0,
        rejected: 0,
        totalReviewed: 0
    });

    const[showAllVerified, setShowAllVerified] = useState(false);
    const [showAllRejected, setShowAllRejected] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const[pendingRes, historyRes] = await Promise.all([
                plantService.getPending(),
                plantService.getHistory()
            ]);
            setPendingSubmissions(pendingRes.data);
            setHistory(historyRes.data);
            
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
    },[]);

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

    const filterUniqueSubmissions = (array, key) => {
        const seen = new Set();
        return array.filter(item => {
            const val = item[key];
            if (!val) return true; 
            const normalized = val.toLowerCase().trim();
            if (seen.has(normalized)) return false; 
            seen.add(normalized);
            return true;
        });
    };

    const uniquePending = filterUniqueSubmissions(pendingSubmissions, 'aiSuggestedName');
    const uniqueVerifiedHistory = filterUniqueSubmissions(history.filter(item => item.status === 'verified'), 'finalPlantName');
    const uniqueRejectedHistory = filterUniqueSubmissions(history.filter(item => item.status === 'rejected'), 'aiSuggestedName');

    const displayedVerified = showAllVerified ? uniqueVerifiedHistory : uniqueVerifiedHistory.slice(0, 3);
    const displayedRejected = showAllRejected ? uniqueRejectedHistory : uniqueRejectedHistory.slice(0, 3);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <div className="absolute inset-0 bg-grid-slate-100[mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg inline-flex self-start">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Expert Verification Portal</h1>
                                    <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2">Review and validate plant submissions</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Expert Profile Card */}
                        {user && (
                            <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 w-full lg:max-w-sm">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex flex-shrink-0 items-center justify-center">
                                        <User className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold text-gray-900 text-lg truncate">{user.fullName}</h3>
                                        <div className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-semibold mt-1 truncate max-w-full">
                                            <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                                            <span className="truncate">{user.expertiseArea || 'Plant Expert'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
                                    {user.workplace && (
                                        <div className="flex items-center text-gray-600">
                                            <Briefcase className="h-4 w-4 mr-2 text-emerald-500 flex-shrink-0" />
                                            <span className="truncate">{user.workplace}</span>
                                        </div>
                                    )}
                                    {user.yearsOfExperience && (
                                        <div className="flex items-center text-gray-600">
                                            <Award className="h-4 w-4 mr-2 text-emerald-500 flex-shrink-0" />
                                            <span className="truncate">{user.yearsOfExperience} years</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-blue-800">Pending Review</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-blue-900 mt-1">{stats.pending}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-emerald-800">Total Verified</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-emerald-900 mt-1">{stats.verified}</p>
                                </div>
                                <div className="p-3 bg-emerald-100 rounded-xl">
                                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-red-800">Total Rejected</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-red-900 mt-1">{stats.rejected}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-xl">
                                    <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-purple-800">Total Reviewed</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-purple-900 mt-1">{stats.totalReviewed}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl">
                        <div className="flex items-start sm:items-center space-x-3">
                            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                            <div>
                                <p className="font-semibold text-red-800 text-sm sm:text-base">Error Loading Data</p>
                                <p className="text-red-700 text-xs sm:text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pending Submissions Section */}
                <section className="mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-wrap items-center gap-2">
                                <span className="flex items-center">
                                    <FileSearch className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-emerald-600" />
                                    Pending Verification
                                </span>
                                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                                    {uniquePending.length} unique
                                </span>
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">Review new unique submissions</p>
                        </div>
                        
                        {/* Mobile Responsive Search & Filter */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none text-sm"
                                />
                            </div>
                            <button className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center justify-center text-sm font-medium">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </button>
                        </div>
                    </div>
                    
                    {uniquePending.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {uniquePending.map(submission => (
                                <SubmissionCard 
                                    key={submission._id} 
                                    submission={submission} 
                                    onVerifyClick={() => handleOpenModal(submission)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100 px-4">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4">
                                <CheckCircle className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">All caught up!</h3>
                            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-md mx-auto">
                                There are no new submissions to verify. Check back later.
                            </p>
                        </div>
                    )}
                </section>
                
                {/* Verification History Section */}
                <section className="mb-12">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center mb-6">
                        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-emerald-600" />
                        Your Recent Activity
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                        {/* Verified Plants Column */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 sm:px-6 py-4 border-b border-emerald-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 mr-2 sm:mr-3" />
                                        <h4 className="text-lg sm:text-xl font-bold text-emerald-900">Verified</h4>
                                    </div>
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                                        {uniqueVerifiedHistory.length} unique
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 flex-grow">
                                {uniqueVerifiedHistory.length > 0 ? (
                                    <div className="space-y-4 sm:space-y-6">
                                        {displayedVerified.map(item => <HistoryCard key={item._id} submission={item} />)}
                                        
                                        {uniqueVerifiedHistory.length > 3 && (
                                            <div className="text-center pt-4 border-t border-gray-100">
                                                <button 
                                                    onClick={() => setShowAllVerified(!showAllVerified)}
                                                    className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center justify-center mx-auto transition-colors text-sm sm:text-base"
                                                >
                                                    {showAllVerified ? 'Show less' : `View all ${uniqueVerifiedHistory.length} verified`}
                                                    {showAllVerified ? <ChevronUp className="h-4 w-4 ml-1 sm:ml-2" /> : <ChevronDown className="h-4 w-4 ml-1 sm:ml-2" />}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                                            <Leaf className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500">No verified plants in history</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Rejected Plants Column */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div className="bg-gradient-to-r from-red-50 to-red-100 px-4 sm:px-6 py-4 border-b border-red-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mr-2 sm:mr-3" />
                                        <h4 className="text-lg sm:text-xl font-bold text-red-900">Rejected</h4>
                                    </div>
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                                        {uniqueRejectedHistory.length} unique
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 flex-grow">
                                {uniqueRejectedHistory.length > 0 ? (
                                    <div className="space-y-4 sm:space-y-6">
                                        {displayedRejected.map(item => <HistoryCard key={item._id} submission={item} />)}
                                        
                                        {uniqueRejectedHistory.length > 3 && (
                                            <div className="text-center pt-4 border-t border-gray-100">
                                                <button 
                                                    onClick={() => setShowAllRejected(!showAllRejected)}
                                                    className="text-red-600 font-medium hover:text-red-700 flex items-center justify-center mx-auto transition-colors text-sm sm:text-base"
                                                >
                                                    {showAllRejected ? 'Show less' : `View all ${uniqueRejectedHistory.length} rejected`}
                                                    {showAllRejected ? <ChevronUp className="h-4 w-4 ml-1 sm:ml-2" /> : <ChevronDown className="h-4 w-4 ml-1 sm:ml-2" />}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                                            <AlertCircle className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500">No rejected plants in history</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Tips Section */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 sm:p-8 border border-emerald-200">
                    <div className="flex items-center mb-4 sm:mb-6">
                        <Info className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 mr-2 sm:mr-3" />
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Guidelines</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm">
                            <div className="text-emerald-600 font-semibold mb-2 flex items-center text-sm sm:text-base">
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                Accuracy First
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">Always cross-reference with verified botanical sources before approving.</p>
                        </div>
                        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm">
                            <div className="text-emerald-600 font-semibold mb-2 flex items-center text-sm sm:text-base">
                                <BookText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                Detailed Notes
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">Provide comprehensive medicinal uses and identification details.</p>
                        </div>
                        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm sm:col-span-2 md:col-span-1">
                            <div className="text-emerald-600 font-semibold mb-2 flex items-center text-sm sm:text-base">
                                <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                Community
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600">Your verifications help community members learn about local plants.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Verify Submission">
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
    const[action, setAction] = useState('approve');
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
    
    const inputClasses = "mt-1.5 sm:mt-2 px-3 sm:px-4 py-2 sm:py-3 w-full rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none text-sm sm:text-base";
    const labelClasses = "block text-xs sm:text-sm font-semibold text-gray-900";

    return (
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Mobile Responsive Preview */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                    <img 
                        src={submission.imageURL} 
                        alt="Plant" 
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl shadow-md flex-shrink-0" 
                    />
                    <div className="w-full">
                        <h4 className="font-bold text-gray-900 text-base sm:text-lg">Plant Details</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">By: <span className="font-medium">{submission.userId?.username || 'User'}</span></p>
                        <div className="mt-3">
                            <div className="inline-flex items-center justify-center sm:justify-start px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-xs sm:text-sm w-full sm:w-auto">
                                <Leaf className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 flex-shrink-0" />
                                <span className="truncate">AI: <span className="font-bold">{submission.aiSuggestedName}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Responsive Action Selection */}
            <div>
                <label className={labelClasses}>
                    <Shield className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-emerald-600" />
                    Action
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2 sm:mt-3">
                    <button
                        type="button"
                        onClick={() => setAction('approve')}
                        className={`p-3 sm:p-4 rounded-xl border-2 flex sm:flex-col items-center justify-center transition-all ${action === 'approve' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'}`}
                    >
                        <CheckCircle className={`h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-0 sm:mb-2 ${action === 'approve' ? 'text-emerald-600' : 'text-gray-400'}`} />
                        <span className={`text-sm sm:text-base font-medium ${action === 'approve' ? 'text-emerald-800' : 'text-gray-700'}`}>Approve</span>
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setAction('correct')}
                        className={`p-3 sm:p-4 rounded-xl border-2 flex sm:flex-col items-center justify-center transition-all ${action === 'correct' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                    >
                        <FileSearch className={`h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-0 sm:mb-2 ${action === 'correct' ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className={`text-sm sm:text-base font-medium ${action === 'correct' ? 'text-blue-800' : 'text-gray-700'}`}>Correct</span>
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setAction('reject')}
                        className={`p-3 sm:p-4 rounded-xl border-2 flex sm:flex-col items-center justify-center transition-all ${action === 'reject' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}
                    >
                        <XCircle className={`h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-0 sm:mb-2 ${action === 'reject' ? 'text-red-600' : 'text-gray-400'}`} />
                        <span className={`text-sm sm:text-base font-medium ${action === 'reject' ? 'text-red-800' : 'text-gray-700'}`}>Reject</span>
                    </button>
                </div>
            </div>

            {/* Form Fields */}
            {(action === 'approve' || action === 'correct') && (
                <div className="space-y-4 sm:space-y-5 p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                    {action === 'correct' && (
                        <div>
                            <label className={labelClasses}>
                                <BookText className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-emerald-600" />
                                Correct Name
                            </label>
                            <input 
                                type="text" 
                                value={correctedName} 
                                onChange={e => setCorrectedName(e.target.value)} 
                                placeholder="Correct botanical name"
                                required 
                                className={inputClasses}
                            />
                        </div>
                    )}
                    
                    <div>
                        <label className={labelClasses}>
                            <Shield className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-emerald-600" />
                            Method
                        </label>
                        <input 
                            type="text" 
                            value={verificationMethod} 
                            onChange={e => setVerificationMethod(e.target.value)} 
                            placeholder="e.g., Ayurvedic Pharmacopoeia"
                            required 
                            className={inputClasses}
                        />
                    </div>
                    
                    <div>
                        <label className={labelClasses}>
                            <Leaf className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-emerald-600" />
                            Medicinal Uses
                        </label>
                        <textarea 
                            value={medicinalUses} 
                            onChange={e => setMedicinalUses(e.target.value)} 
                            rows="3" 
                            placeholder="e.g., Used for digestion..."
                            required 
                            className={inputClasses}
                        ></textarea>
                    </div>
                    
                    <div>
                        <label className={labelClasses}>
                            <Info className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-emerald-600" />
                            Notes (Optional)
                        </label>
                        <textarea 
                            value={importance} 
                            onChange={e => setImportance(e.target.value)} 
                            rows="2" 
                            placeholder="e.g., Rare species..."
                            className={inputClasses}
                        ></textarea>
                    </div>
                </div>
            )}
            
            {action === 'reject' && (
                <div className="p-4 sm:p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
                    <label className={labelClasses}>
                        <XCircle className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-red-600" />
                        Reason
                    </label>
                    <input 
                        type="text" 
                        value={rejectionReason} 
                        onChange={e => setRejectionReason(e.target.value)} 
                        placeholder="e.g., Misidentified"
                        required 
                        className={inputClasses}
                    />
                </div>
            )}

            <div>
                <label className={labelClasses}>
                    <BookText className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-emerald-600" />
                    Additional Notes (Optional)
                </label>
                <textarea 
                    value={expertNotes} 
                    onChange={e => setExpertNotes(e.target.value)} 
                    rows="2" 
                    placeholder="General notes..."
                    className={inputClasses}
                ></textarea>
            </div>

            {/* Mobile Responsive Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5 sm:pt-6 border-t border-gray-200">
                <button 
                    type="button" 
                    onClick={onClose} 
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform sm:hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                            Submit Verification
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ExpertDashboard;