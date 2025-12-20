// client/src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { FileUp } from 'lucide-react'; // For a nice upload icon
import { useAuth } from '../hooks/useAuth';


function RegisterPage() {
    const [searchParams] = useSearchParams();
    // State for the form fields
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
        expertCode: '',
    });
    const [idProof, setIdProof] = useState(null);
    const [preview, setPreview] = useState(null);

    // State for UI control
    const [isExpertRegistration, setIsExpertRegistration] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    // Check for expert parameter in URL
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
        // Append all text fields from formData state
        for (const key in formData) {
            submissionData.append(key, formData[key]);
        }
        // Append the file if it exists
        if (idProof) {
            submissionData.append('idProof', idProof);
        }

        try {
             const response = await api.post('/auth/register', submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const { token, user } = response.data;
            
            // Use our context function to log the user in
            loginWithToken(token, user);

            // Navigate to the correct dashboard based on role
            if (user.role === 'expert') {
                navigate('/expert-dashboard');
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isExpertRegistration ? "Expert Registration" : "Create your Account"}
                    </h2>
                </div>
                <form className="mt-8 space-y-6 bg-white p-8 shadow-lg rounded-lg" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* --- Common Fields --- */}
                        <div className="md:col-span-2">
                             <label htmlFor="fullName">Full Name</label>
                             <input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                             <label htmlFor="username">Username</label>
                             <input id="username" name="username" value={formData.username} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                             <label htmlFor="password">Password</label>
                             <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>

                        {/* --- EXPERT ONLY FIELDS --- */}
                        {isExpertRegistration && (
                            <>
                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber">Phone Number</label>
                                    <input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor="expertiseArea">Area of Expertise</label>
                                    <input id="expertiseArea" name="expertiseArea" value={formData.expertiseArea} onChange={handleChange} required placeholder="e.g., Ayurveda, Botany" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor="workplace">Workplace / Organization</label>
                                    <input id="workplace" name="workplace" value={formData.workplace} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="yearsOfExperience">Years of Experience</label>
                                    <input id="yearsOfExperience" name="yearsOfExperience" type="number" value={formData.yearsOfExperience} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="bio">Short Bio</label>
                                    <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label>Proof of ID (Required)</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            {preview ? <img src={preview} alt="ID Preview" className="mx-auto h-24 w-auto"/> : <FileUp className="mx-auto h-12 w-12 text-gray-400" />}
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="idProof" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500">
                                                    <span>Upload a file</span>
                                                    <input id="idProof" name="idProof" type="file" onChange={handleFileChange} className="sr-only" accept="image/*,.pdf" />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500">{idProof ? idProof.name : "PNG, JPG, PDF up to 5MB"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="expertCode">Expert Registration Code</label>
                                    <input id="expertCode" name="expertCode" type="password" value={formData.expertCode} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                            </>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                            {loading ? "Submitting..." : "Create Account"}
                        </button>
                    </div>
                </form>
                
                <p className="mt-2 text-center text-sm text-gray-600">
                    <button onClick={() => setIsExpertRegistration(!isExpertRegistration)} className="font-medium text-green-600 hover:text-green-500">
                       {isExpertRegistration ? "Switch to User Registration" : "Are you an Expert?"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;