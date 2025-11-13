import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Spinner from '../components/shared/Spinner';
import { User, Mail, Phone, Award, Briefcase, Clock, BookText, Leaf } from 'lucide-react';

// A helper component for displaying each detail item to avoid repetition
const ProfileDetail = ({ icon, label, value, fullWidth = false }) => {
    if (!value) return null; // Don't render if there's no value

    return (
        <div className={fullWidth ? 'sm:col-span-2' : ''}>
            <dl>
                <dt className="text-sm font-medium text-gray-500 flex items-center">{icon} {label}</dt>
                <dd className="mt-1 text-sm text-gray-900 ml-7 whitespace-pre-wrap">{value}</dd>
            </dl>
        </div>
    );
};

// Main Profile Page Component
function ProfilePage() {
    const { user, setUser, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    // State for UI control
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // Pre-fill the form with the user's current data when the component loads
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
            setUser(response.data); // Update the global user state with fresh data
            localStorage.setItem('user', JSON.stringify(response.data));
            setSuccess('Profile updated successfully!');
            setTimeout(() => {
                setIsEditing(false); // Switch back to view mode after a short delay
                setSuccess('');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setEditLoading(false);
        }
    };

    if (authLoading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    if (!user) return <div className="text-center py-20">Error: Could not load user profile.</div>;
    
    const isExpert = user.role === 'expert';

    return (
        <div className="bg-gray-50 min-h-screen-minus-navbar">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* --- Header --- */}
                <div className="text-center mb-10">
                    <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                        {isExpert ? <Award className="h-12 w-12 text-green-600" /> : <Leaf className="h-12 w-12 text-green-600" />}
                    </div>
                    <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
                        {user.fullName}
                    </h1>
                    <p className="mt-1 text-lg text-green-600 font-semibold capitalize">
                        {isExpert ? 'Expert Contributor' : 'Community Member'}
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate(isExpert ? '/expert-dashboard' : '/dashboard')}
                        className="mt-6 inline-flex items-center px-4 py-2 border border-green-600 text-green-700 font-semibold rounded-md hover:bg-green-50 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {/* --- Details/Edit Card --- */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Account Information
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    {isEditing ? 'Update your details below.' : 'Your personal and professional details.'}
                                </p>
                            </div>
                            {isExpert && !isEditing && (
                                <button type="button" onClick={() => setIsEditing(true)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                    Edit Profile
                                </button>
                            )}
                        </div>
                        
                        <div className="px-4 py-5 sm:p-6">
                            {!isEditing ? (
                                // --- VIEW MODE ---
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                    <ProfileDetail icon={<User className="text-green-500"/>} label="Username" value={user.username} />
                                    {isExpert ? (
                                        <>
                                            <ProfileDetail icon={<Mail className="text-green-500"/>} label="Email Address" value={user.email} />
                                            <ProfileDetail icon={<Phone className="text-green-500"/>} label="Phone Number" value={user.phoneNumber} />
                                            <ProfileDetail icon={<Award className="text-green-500"/>} label="Area of Expertise" value={user.expertiseArea} />
                                            <ProfileDetail icon={<Briefcase className="text-green-500"/>} label="Workplace" value={user.workplace} />
                                            <ProfileDetail icon={<Clock className="text-green-500"/>} label="Years of Experience" value={user.yearsOfExperience ? `${user.yearsOfExperience} years` : null} />
                                            <ProfileDetail icon={<BookText className="text-green-500"/>} label="Bio" value={user.bio} fullWidth={true} />
                                        </>
                                    ) : (
                                        <div className="sm:col-span-2 bg-green-50 p-4 rounded-lg border border-green-200">
                                            <p className="text-center text-green-800">
                                                Thank you for contributing to the preservation of medicinal plant knowledge!
                                            </p>
                                        </div>
                                    )}
                                </dl>
                            ) : (
                                // --- EDIT MODE (THE FORM) ---
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                                    </div>
                                    <div className="sm:col-span-3">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                                    </div>
                                    <div className="sm:col-span-3">
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                        <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                                    </div>
                                     <div className="sm:col-span-3">
                                        <label htmlFor="expertiseArea" className="block text-sm font-medium text-gray-700">Area of Expertise</label>
                                        <input type="text" name="expertiseArea" id="expertiseArea" value={formData.expertiseArea} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                                    </div>
                                     <div className="sm:col-span-3">
                                        <label htmlFor="workplace" className="block text-sm font-medium text-gray-700">Workplace</label>
                                        <input type="text" name="workplace" id="workplace" value={formData.workplace} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required />
                                    </div>
                                     <div className="sm:col-span-2">
                                        <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
                                        <input type="number" name="yearsOfExperience" id="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
                                    </div>
                                    <div className="sm:col-span-6">
                                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                                        <textarea name="bio" id="bio" value={formData.bio} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"></textarea>
                                    </div>
                                </div>
                            )}
                            {isEditing && (
                                <div className="mt-6 text-center">
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                    {success && <p className="text-green-500 text-sm">{success}</p>}
                                </div>
                            )}
                        </div>
                        
                        {isEditing && (
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <div className="flex justify-end space-x-3">
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" disabled={editLoading}>
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={editLoading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400">
                                        {editLoading && <Spinner />}
                                        {editLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;