// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // Use raw api to handle both registration types

function RegisterPage() {
    // State for the form fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [expertCode, setExpertCode] = useState('');

    // State for UI control
    const [isExpertRegistration, setIsExpertRegistration] = useState(false); // Controls expert field visibility
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Construct the payload to send to the backend
        const payload = {
            username,
            password,
            fullName,
        };

        // Only add the expertCode to the payload if it's an expert registration
        if (isExpertRegistration) {
            payload.expertCode = expertCode;
        }

        try {
            await api.post('/auth/register', payload);
            navigate('/login'); // Redirect to login after any successful registration
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isExpertRegistration ? "Expert Registration" : "Create your Account"}
                    </h2>
                </div>
                <form className="mt-8 space-y-6 bg-white p-8 shadow-lg rounded-lg" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm">
                        {/* --- Common Input Fields --- */}
                        <div className="mb-4">
                            <label htmlFor="fullName">Full Name</label>
                            <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Full Name" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="username">Username</label>
                            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Username" required />
                        </div>
                         <div className="mb-4">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="Password" required />
                        </div>

                        {/* --- Conditional Expert Code Field --- */}
                        {isExpertRegistration && (
                             <div className="mb-4">
                                <label htmlFor="expertCode">Expert Code</label>
                                <input id="expertCode" type="password" value={expertCode} onChange={(e) => setExpertCode(e.target.value)}
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="Enter your expert code" required />
                            </div>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button type="submit" disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300">
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>
                
                {/* --- TOGGLE LINK --- */}
                <p className="mt-2 text-center text-sm text-gray-600">
                    {isExpertRegistration ? (
                        <button onClick={() => setIsExpertRegistration(false)} className="font-medium text-green-600 hover:text-green-500">
                           Are you a local user? Register here.
                        </button>
                    ) : (
                         <button onClick={() => setIsExpertRegistration(true)} className="font-medium text-green-600 hover:text-green-500">
                           Are you an expert? Register here.
                        </button>
                    )}
                </p>

                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;