import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Check, X, FileText, UserCheck, UserX, Clock, Shield, Users, AlertCircle, Download, Eye, Mail, Briefcase, Award, Phone } from 'lucide-react';

function AdminDashboard() {
    const [expertData, setExpertData] = useState({
        pending: [],
        verified: [],
        rejected: []
    });
    const [activeTab, setActiveTab] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

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
        const actionText = action === 'approve' ? 'approve' : 'reject';
        if(!window.confirm(`Are you sure you want to ${actionText} this expert?`)) return;
        try {
            await api.post('/admin/verify-expert', { userId, action });
            fetchData();
        } catch (error) {
            alert('Action failed');
        }
    };

    const openUserModal = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const closeUserModal = () => {
        setSelectedUser(null);
        setShowUserModal(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-lg animate-pulse">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">Loading Admin Dashboard...</p>
                    <p className="text-sm text-gray-500 mt-2">Fetching expert verification data</p>
                </div>
            </div>
        );
    }

    const renderList = () => {
        const list = expertData[activeTab];

        if (list.length === 0) {
            return (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                        {activeTab === 'pending' ? <Clock className="h-10 w-10 text-gray-400" /> :
                         activeTab === 'verified' ? <UserCheck className="h-10 w-10 text-gray-400" /> :
                         <UserX className="h-10 w-10 text-gray-400" />}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">No {activeTab} experts</h3>
                    <p className="text-gray-600 mt-3 max-w-md mx-auto">
                        {activeTab === 'pending' ? 'All expert requests have been reviewed.' :
                         activeTab === 'verified' ? 'No experts have been verified yet.' :
                         'No experts have been rejected yet.'}
                    </p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {list.map(user => (
                    <div key={user._id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        {/* Header */}
                        <div className={`px-6 py-4 ${activeTab === 'pending' ? 'bg-gradient-to-r from-amber-50 to-yellow-50' : 
                                          activeTab === 'verified' ? 'bg-gradient-to-r from-emerald-50 to-green-50' : 
                                          'bg-gradient-to-r from-red-50 to-pink-50'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-xl ${activeTab === 'pending' ? 'bg-amber-100' : 
                                                     activeTab === 'verified' ? 'bg-emerald-100' : 
                                                     'bg-red-100'}`}>
                                        {activeTab === 'pending' ? <Clock className="h-5 w-5 text-amber-600" /> :
                                         activeTab === 'verified' ? <UserCheck className="h-5 w-5 text-emerald-600" /> :
                                         <UserX className="h-5 w-5 text-red-600" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{user.fullName}</h4>
                                        <p className="text-sm text-gray-600">@{user.username}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${activeTab === 'pending' ? 'bg-amber-100 text-amber-800' : 
                                                   activeTab === 'verified' ? 'bg-emerald-100 text-emerald-800' : 
                                                   'bg-red-100 text-red-800'}`}>
                                    {activeTab === 'pending' ? 'Pending Review' :
                                     activeTab === 'verified' ? 'Verified Expert' : 'Rejected'}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center text-gray-600">
                                        <Briefcase className="h-4 w-4 mr-2 text-emerald-500" />
                                        <span className="text-sm truncate">{user.workplace}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Award className="h-4 w-4 mr-2 text-amber-500" />
                                        <span className="text-sm">{user.yearsOfExperience} years</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center text-gray-600">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                        {user.expertiseArea}
                                    </span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                    <span className="text-sm truncate">{user.email}</span>
                                </div>

                                {user.phoneNumber && (
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                                        <span className="text-sm">{user.phoneNumber}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <button
                                    onClick={() => openUserModal(user)}
                                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Full Details
                                </button>
                                
                                {activeTab === 'pending' && (
                                    <div className="flex space-x-3">
                                        <button 
                                            onClick={() => handleVerification(user._id, 'approve')}
                                            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all"
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleVerification(user._id, 'reject')}
                                            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Reject
                                        </button>
                                    </div>
                                )}

                                {user.idProofURL && activeTab === 'pending' && (
                                    <a 
                                        href={user.idProofURL} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 font-medium"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        View ID Proof
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-lg">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-lg text-gray-600 mt-2">Manage expert registrations and verifications</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Pending Review</p>
                                    <p className="text-3xl font-bold text-amber-900 mt-2">{expertData.pending.length}</p>
                                </div>
                                <div className="p-3 bg-amber-100 rounded-xl">
                                    <Clock className="h-8 w-8 text-amber-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-800">Verified Experts</p>
                                    <p className="text-3xl font-bold text-emerald-900 mt-2">{expertData.verified.length}</p>
                                </div>
                                <div className="p-3 bg-emerald-100 rounded-xl">
                                    <UserCheck className="h-8 w-8 text-emerald-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-red-50 to-pink-100 border border-red-200 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-800">Rejected</p>
                                    <p className="text-3xl font-bold text-red-900 mt-2">{expertData.rejected.length}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-xl">
                                    <UserX className="h-8 w-8 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                                    activeTab === 'pending'
                                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md'
                                        : 'text-gray-600 hover:text-amber-700 hover:bg-amber-50'
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    <Clock className={`h-4 w-4 ${activeTab === 'pending' ? 'mr-2' : 'mr-0'}`} />
                                    {activeTab === 'pending' && <span>Pending</span>}
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('verified')}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                                    activeTab === 'verified'
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                                        : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    <UserCheck className={`h-4 w-4 ${activeTab === 'verified' ? 'mr-2' : 'mr-0'}`} />
                                    {activeTab === 'verified' && <span>Verified</span>}
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('rejected')}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                                    activeTab === 'rejected'
                                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md'
                                        : 'text-gray-600 hover:text-red-700 hover:bg-red-50'
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    <UserX className={`h-4 w-4 ${activeTab === 'rejected' ? 'mr-2' : 'mr-0'}`} />
                                    {activeTab === 'rejected' && <span>Rejected</span>}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* List Content */}
                <div className="min-h-[400px]">
                    {renderList()}
                </div>

                {/* Quick Stats */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                        <div className="flex items-center mb-4">
                            <Users className="h-6 w-6 text-gray-600 mr-3" />
                            <h3 className="text-xl font-bold text-gray-900">Quick Summary</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl">
                                <p className="text-sm text-gray-500">Total Applications</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {expertData.pending.length + expertData.verified.length + expertData.rejected.length}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl">
                                <p className="text-sm text-gray-500">Approval Rate</p>
                                <p className="text-2xl font-bold text-emerald-900">
                                    {expertData.verified.length > 0 
                                        ? `${Math.round((expertData.verified.length / (expertData.verified.length + expertData.rejected.length)) * 100)}%`
                                        : '0%'}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl">
                                <p className="text-sm text-gray-500">Requires Attention</p>
                                <p className="text-2xl font-bold text-amber-900">{expertData.pending.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Details Modal */}
            {showUserModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-emerald-100 rounded-xl">
                                        <Users className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{selectedUser.fullName}</h3>
                                        <p className="text-gray-600">@{selectedUser.username}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeUserModal}
                                    className="p-2 hover:bg-gray-100 rounded-xl"
                                >
                                    <X className="h-6 w-6 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{selectedUser.email}</p>
                                    </div>
                                    {selectedUser.phoneNumber && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{selectedUser.phoneNumber}</p>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Expertise Area</p>
                                        <p className="font-medium">{selectedUser.expertiseArea}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Years of Experience</p>
                                        <p className="font-medium">{selectedUser.yearsOfExperience} years</p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Workplace/Organization</p>
                                    <p className="font-medium">{selectedUser.workplace}</p>
                                </div>

                                {selectedUser.bio && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Bio</p>
                                        <p className="font-medium">{selectedUser.bio}</p>
                                    </div>
                                )}

                                {selectedUser.idProofURL && (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-500">ID Proof</p>
                                        <a 
                                            href={selectedUser.idProofURL} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download ID Proof
                                        </a>
                                    </div>
                                )}

                                {activeTab === 'pending' && (
                                    <div className="flex space-x-3 pt-6 border-t border-gray-200">
                                        <button 
                                            onClick={() => {
                                                handleVerification(selectedUser._id, 'approve');
                                                closeUserModal();
                                            }}
                                            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 font-semibold"
                                        >
                                            <Check className="h-5 w-5 mr-2" />
                                            Approve Expert
                                        </button>
                                        <button 
                                            onClick={() => {
                                                handleVerification(selectedUser._id, 'reject');
                                                closeUserModal();
                                            }}
                                            className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 font-semibold"
                                        >
                                            <X className="h-5 w-5 mr-2" />
                                            Reject Expert
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;