// client/src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { FileUp, User, Lock, Mail, Phone, Briefcase, Award, Calendar, BookOpen, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function RegisterPage() {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
        email: '',
        phoneNumber: '',
        expertiseArea: '',
        workplace: '',
        yearsOfExperience: '',
        bio: '',
    });
    const [idProof, setIdProof] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isExpertRegistration, setIsExpertRegistration] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const expertParam = searchParams.get('expert');
        if (expertParam === 'true') {
            setIsExpertRegistration(true);
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIdProof(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (isExpertRegistration && !idProof) {
            setError('Proof of ID is required for expert registration.');
            return;
        }
        
        setLoading(true);

        const submissionData = new FormData();
        for (const key in formData) {
            submissionData.append(key, formData[key]);
        }
        if (idProof) {
            submissionData.append('idProof', idProof);
        }

        try {
            const response = await api.post('/auth/register', submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const { token, user } = response.data;
            loginWithToken(token, user);

            if (user.role === 'expert') {
                navigate('/expert-dashboard');
            } else if (user.role === 'expert_pending') {
                navigate('/pending-approval');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            
            <div className="max-w-4xl w-full">
                <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
                    {/* Left Side - Branding/Info */}
                    <div className="lg:w-2/5 bg-gradient-to-br from-emerald-600 to-teal-700 p-8 lg:p-12 text-white">
                        <div className="h-full flex flex-col justify-center">
                            <div className="mb-8">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                        <Shield className="h-8 w-8" />
                                    </div>
                                    <h1 className="text-3xl font-bold">PlantSage</h1>
                                </div>
                                <p className="text-emerald-100 text-lg">
                                    Join our community of plant enthusiasts and experts
                                </p>
                            </div>

                            <div className="space-y-6 mt-8">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Connect with Experts</h3>
                                        <p className="text-emerald-100 text-sm">Get guidance from certified professionals</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Share Knowledge</h3>
                                        <p className="text-emerald-100 text-sm">Contribute to our growing plant database</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Award className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Build Reputation</h3>
                                        <p className="text-emerald-100 text-sm">Earn recognition in our community</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/20">
                                <p className="text-emerald-100">
                                    Already have an account?{' '}
                                    <Link to="/login" className="font-semibold text-white hover:text-emerald-100 underline">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="lg:w-3/5 bg-white p-8 lg:p-12">
                        <div className="mb-8">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-4">
                                {isExpertRegistration ? '👨‍🔬 Expert Registration' : '👤 User Registration'}
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {isExpertRegistration ? "Join as an Expert" : "Create Your Account"}
                            </h2>
                            <p className="text-gray-600 mt-2">
                                {isExpertRegistration 
                                    ? "Share your expertise with our community"
                                    : "Start your plant care journey today"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Common Fields */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="inline h-4 w-4 mr-2" />
                                        Full Name
                                    </label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="inline h-4 w-4 mr-2" />
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
                                        placeholder="johndoe123"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Lock className="inline h-4 w-4 mr-2" />
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {/* Expert Only Fields */}
                                {isExpertRegistration && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Mail className="inline h-4 w-4 mr-2" />
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Phone className="inline h-4 w-4 mr-2" />
                                                Phone Number
                                            </label>
                                            <input
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                type="tel"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Award className="inline h-4 w-4 mr-2" />
                                                Area of Expertise
                                            </label>
                                            <input
                                                id="expertiseArea"
                                                name="expertiseArea"
                                                value={formData.expertiseArea}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
                                                placeholder="Ayurveda, Botany, Horticulture"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Briefcase className="inline h-4 w-4 mr-2" />
                                                Workplace / Organization
                                            </label>
                                            <input
                                                id="workplace"
                                                name="workplace"
                                                value={formData.workplace}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
                                                placeholder="University of Botany"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="inline h-4 w-4 mr-2" />
                                                Years of Experience
                                            </label>
                                            <input
                                                id="yearsOfExperience"
                                                name="yearsOfExperience"
                                                type="number"
                                                value={formData.yearsOfExperience}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
                                                placeholder="5"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <BookOpen className="inline h-4 w-4 mr-2" />
                                                Short Bio
                                            </label>
                                            <textarea
                                                id="bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                rows="3"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none resize-none"
                                                placeholder="Tell us about your expertise and passion..."
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FileUp className="inline h-4 w-4 mr-2" />
                                                Proof of ID (Required)
                                            </label>
                                            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-2xl p-6 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50">
                                                <div className="text-center">
                                                    {preview ? (
                                                        <div className="space-y-4">
                                                            <img 
                                                                src={preview} 
                                                                alt="ID Preview" 
                                                                className="mx-auto h-32 w-auto rounded-lg object-cover shadow-md"
                                                            />
                                                            <p className="text-sm text-gray-600">{idProof.name}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                                                <FileUp className="h-8 w-8 text-emerald-600" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label htmlFor="idProof" className="cursor-pointer">
                                                                    <span className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                                                                        Choose File
                                                                    </span>
                                                                    <input 
                                                                        id="idProof" 
                                                                        name="idProof" 
                                                                        type="file" 
                                                                        onChange={handleFileChange}
                                                                        className="sr-only" 
                                                                        accept="image/*,.pdf" 
                                                                    />
                                                                </label>
                                                                <p className="text-xs text-gray-500">
                                                                    PNG, JPG, PDF up to 5MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-red-600 text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </span>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <button
                                onClick={() => setIsExpertRegistration(!isExpertRegistration)}
                                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center"
                            >
                                {isExpertRegistration ? (
                                    <>
                                        <User className="h-4 w-4 mr-2" />
                                        Switch to User Registration
                                    </>
                                ) : (
                                    <>
                                        <Award className="h-4 w-4 mr-2" />
                                        Are you an Expert? Register as one
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;