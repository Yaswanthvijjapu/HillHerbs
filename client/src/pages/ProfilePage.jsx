import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { 
  User, Mail, Phone, Award, Briefcase, Clock, 
  BookText, Leaf, Shield, Edit, Save, X, 
  CheckCircle, Home, Star, Users, Globe, FileText 
} from 'lucide-react';

function ProfilePage() {
    const { user, setUser, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                expertiseArea: user.expertiseArea || '',
                workplace: user.workplace || '',
                yearsOfExperience: user.yearsOfExperience ?? '',
                bio: user.bio || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await api.put('/auth/profile', formData);
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setSuccess('Profile updated successfully!');
            setTimeout(() => {
                setIsEditing(false);
                setSuccess('');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setEditLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-lg animate-pulse">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">Loading Profile...</p>
                </div>
            </div>
        );
    }

    if (!user) return <div className="text-center py-20">Error: Could not load user profile.</div>;
    
    const isExpert = user.role === 'expert';

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
                    <div className="flex-1">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-semibold mb-4 shadow-lg">
                            <Shield className="h-4 w-4 mr-2" />
                            My Profile
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {user.fullName}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 rounded-full text-sm font-semibold">
                                {isExpert ? (
                                    <>
                                        <Award className="h-3 w-3 mr-1.5" />
                                        Expert Contributor
                                    </>
                                ) : (
                                    <>
                                        <Users className="h-3 w-3 mr-1.5" />
                                        Community Member
                                    </>
                                )}
                            </span>
                            {user.expertiseArea && (
                                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-semibold">
                                    <Star className="h-3 w-3 mr-1.5" />
                                    {user.expertiseArea}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(isExpert ? '/expert-dashboard' : '/dashboard')}
                            className="inline-flex items-center px-5 py-2.5 bg-white border border-emerald-300 text-emerald-700 font-medium rounded-xl hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg"
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </button>
                        {isExpert && !isEditing && (
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-6 mb-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                                    {isExpert ? (
                                        <Award className="h-16 w-16 text-white" />
                                    ) : (
                                        <User className="h-16 w-16 text-white" />
                                    )}
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{user.fullName}</h3>
                                <p className="text-gray-600 mb-1">@{user.username}</p>
                                
                                <div className="mt-4 space-y-3 w-full">
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="h-4 w-4 mr-3 text-gray-400" />
                                        <span className="text-sm truncate">{user.email || 'No email provided'}</span>
                                    </div>
                                    
                                    {user.phoneNumber && (
                                        <div className="flex items-center text-gray-600">
                                            <Phone className="h-4 w-4 mr-3 text-gray-400" />
                                            <span className="text-sm">{user.phoneNumber}</span>
                                        </div>
                                    )}
                                    
                                    {user.yearsOfExperience && (
                                        <div className="flex items-center text-gray-600">
                                            <Clock className="h-4 w-4 mr-3 text-gray-400" />
                                            <span className="text-sm">{user.yearsOfExperience} years experience</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                <CheckCircle className="h-5 w-5 mr-2 text-emerald-600" />
                                Profile Status
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Verification</span>
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                                        {isExpert ? 'Expert Verified' : 'Member'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Account Type</span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                                    </span>
                                </div>
                                <div className="pt-4 border-t border-emerald-200">
                                    <p className="text-xs text-gray-500">
                                        Member since {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details/Edit Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
                            {/* Card Header */}
                            <div className={`px-6 py-4 ${isEditing ? 'bg-gradient-to-r from-amber-50 to-yellow-50' : 'bg-gradient-to-r from-emerald-50 to-teal-50'} border-b border-emerald-200`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-white rounded-xl mr-4 shadow-sm">
                                            {isEditing ? (
                                                <Edit className="h-5 w-5 text-amber-600" />
                                            ) : (
                                                <FileText className="h-5 w-5 text-emerald-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {isEditing ? 'Edit Profile Information' : 'Professional Details'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {isEditing ? 'Update your professional information below' : 'Your verified expertise and background'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                {!isEditing ? (
                                    // View Mode
                                    <div className="space-y-8">
                                        {isExpert ? (
                                            <>
                                                {/* Expertise Section */}
                                                <div>
                                                    <div className="flex items-center text-emerald-700 mb-4">
                                                        <Award className="h-5 w-5 mr-2" />
                                                        <h4 className="font-bold text-sm uppercase tracking-wide">Expertise & Background</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-100">
                                                            <p className="text-sm text-gray-500 mb-1">Area of Expertise</p>
                                                            <p className="font-medium text-gray-900">{user.expertiseArea || 'Not specified'}</p>
                                                        </div>
                                                        <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                                                            <p className="text-sm text-gray-500 mb-1">Workplace / Organization</p>
                                                            <p className="font-medium text-gray-900">{user.workplace || 'Not specified'}</p>
                                                        </div>
                                                        <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100">
                                                            <p className="text-sm text-gray-500 mb-1">Years of Experience</p>
                                                            <p className="font-medium text-gray-900">{user.yearsOfExperience ? `${user.yearsOfExperience} years` : 'Not specified'}</p>
                                                        </div>
                                                        <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100">
                                                            <p className="text-sm text-gray-500 mb-1">Verification Status</p>
                                                            <p className="font-medium text-emerald-700">Certified Expert</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bio Section */}
                                                {user.bio && (
                                                    <div>
                                                        <div className="flex items-center text-blue-700 mb-4">
                                                            <BookText className="h-5 w-5 mr-2" />
                                                            <h4 className="font-bold text-sm uppercase tracking-wide">Professional Bio</h4>
                                                        </div>
                                                        <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100">
                                                            <p className="text-gray-800 leading-relaxed">{user.bio}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200 text-center">
                                                <Leaf className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                                                <h4 className="text-xl font-bold text-emerald-800 mb-3">Community Contributor</h4>
                                                <p className="text-gray-700">
                                                    Thank you for contributing to the preservation of medicinal plant knowledge! 
                                                    Your submissions help build our verified database and support biodiversity conservation.
                                                </p>
                                                <button
                                                    onClick={() => navigate('/register?expert=true')}
                                                    className="mt-6 inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
                                                >
                                                    <Globe className="h-4 w-4 mr-2" />
                                                    Become an Expert
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Edit Mode
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <User className="inline h-4 w-4 mr-2 text-emerald-600" />
                                                    Full Name
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="fullName" 
                                                    value={formData.fullName} 
                                                    onChange={handleChange} 
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                                    required 
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Mail className="inline h-4 w-4 mr-2 text-emerald-600" />
                                                    Email Address
                                                </label>
                                                <input 
                                                    type="email" 
                                                    name="email" 
                                                    value={formData.email} 
                                                    onChange={handleChange} 
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                                    required 
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Phone className="inline h-4 w-4 mr-2 text-emerald-600" />
                                                    Phone Number
                                                </label>
                                                <input 
                                                    type="tel" 
                                                    name="phoneNumber" 
                                                    value={formData.phoneNumber} 
                                                    onChange={handleChange} 
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Award className="inline h-4 w-4 mr-2 text-emerald-600" />
                                                    Area of Expertise
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="expertiseArea" 
                                                    value={formData.expertiseArea} 
                                                    onChange={handleChange} 
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                                    required 
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Briefcase className="inline h-4 w-4 mr-2 text-emerald-600" />
                                                    Workplace / Organization
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="workplace" 
                                                    value={formData.workplace} 
                                                    onChange={handleChange} 
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                                    required 
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Clock className="inline h-4 w-4 mr-2 text-emerald-600" />
                                                    Years of Experience
                                                </label>
                                                <input 
                                                    type="number" 
                                                    name="yearsOfExperience" 
                                                    value={formData.yearsOfExperience} 
                                                    onChange={handleChange} 
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <BookText className="inline h-4 w-4 mr-2 text-emerald-600" />
                                                Professional Bio
                                            </label>
                                            <textarea 
                                                name="bio" 
                                                value={formData.bio} 
                                                onChange={handleChange} 
                                                rows="4" 
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                                            />
                                        </div>

                                        {/* Messages */}
                                        {error && (
                                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                                <p className="text-red-600 text-sm font-medium">{error}</p>
                                            </div>
                                        )}
                                        
                                        {success && (
                                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                                <p className="text-emerald-600 text-sm font-medium">{success}</p>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                            <button 
                                                type="button" 
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center"
                                            >
                                                <X className="h-5 w-5 mr-2" />
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit" 
                                                disabled={editLoading}
                                                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-600 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center"
                                            >
                                                <Save className="h-5 w-5 mr-2" />
                                                {editLoading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;