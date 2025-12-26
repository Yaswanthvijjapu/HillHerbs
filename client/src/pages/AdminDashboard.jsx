import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from '../components/shared/Spinner';
import { Check, X, FileText, UserCheck, UserX, Clock } from 'lucide-react';

function AdminDashboard() {
    // State to store grouped data
    const [expertData, setExpertData] = useState({
        pending: [],
        verified: [],
        rejected: []
    });
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'verified' | 'rejected'
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await api.get('/admin/experts-data');
            setExpertData(res.data);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVerification = async (userId, action) => {
        if(!window.confirm(`Are you sure you want to ${action} this user?`)) return;
        try {
            await api.post('/admin/verify-expert', { userId, action });
            // Refresh data after action
            fetchData();
        } catch (error) {
            alert('Action failed');
        }
    };

    if (loading) return <div className="flex justify-center h-screen items-center"><Spinner /></div>;

    // Helper to render the list based on active tab
    const renderList = () => {
        const list = expertData[activeTab];

        if (list.length === 0) {
            return (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    No {activeTab} experts found.
                </div>
            );
        }

        return (
            <ul className="divide-y divide-gray-200 bg-white shadow rounded-lg overflow-hidden">
                {list.map(user => (
                    <li key={user._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-lg font-bold text-gray-900">{user.fullName}</h4>
                                    <span className="text-sm text-gray-500">(@{user.username})</span>
                                </div>
                                
                                <div className="mt-2 text-sm text-gray-600 space-y-1">
                                    <p><span className="font-semibold">Expertise:</span> {user.expertiseArea} • {user.yearsOfExperience} Years Exp.</p>
                                    <p><span className="font-semibold">Workplace:</span> {user.workplace}</p>
                                    <p><span className="font-semibold">Email:</span> {user.email}</p>
                                </div>

                                {user.idProofURL && (
                                    <a 
                                        href={user.idProofURL} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        <FileText className="h-4 w-4 mr-1" /> View ID Proof
                                    </a>
                                )}
                            </div>

                            {/* Actions - Only show for Pending tab */}
                            {activeTab === 'pending' && (
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => handleVerification(user._id, 'approve')}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm transition-all"
                                    >
                                        <Check className="h-4 w-4 mr-2" /> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleVerification(user._id, 'reject')}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-sm transition-all"
                                    >
                                        <X className="h-4 w-4 mr-2" /> Reject
                                    </button>
                                </div>
                            )}

                            {/* Status Badges for other tabs */}
                            {activeTab === 'verified' && (
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                                    <UserCheck className="h-4 w-4 mr-1"/> Active Expert
                                </span>
                            )}
                            {activeTab === 'rejected' && (
                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center">
                                    <UserX className="h-4 w-4 mr-1"/> Rejected
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h2>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-800 font-semibold uppercase">Pending Requests</p>
                            <p className="text-3xl font-bold text-yellow-900">{expertData.pending.length}</p>
                        </div>
                        <Clock className="h-10 w-10 text-yellow-400" />
                    </div>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-800 font-semibold uppercase">Verified Experts</p>
                            <p className="text-3xl font-bold text-green-900">{expertData.verified.length}</p>
                        </div>
                        <UserCheck className="h-10 w-10 text-green-400" />
                    </div>
                </div>
                <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-800 font-semibold uppercase">Rejected</p>
                            <p className="text-3xl font-bold text-red-900">{expertData.rejected.length}</p>
                        </div>
                        <UserX className="h-10 w-10 text-red-400" />
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'pending'
                                ? 'border-yellow-500 text-yellow-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Pending Review
                    </button>
                    <button
                        onClick={() => setActiveTab('verified')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'verified'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Verified Experts
                    </button>
                    <button
                        onClick={() => setActiveTab('rejected')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'rejected'
                                ? 'border-red-500 text-red-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Rejected
                    </button>
                </nav>
            </div>

            {/* List Content */}
            <div className="min-h-[400px]">
                {renderList()}
            </div>
        </div>
    );
}

export default AdminDashboard;