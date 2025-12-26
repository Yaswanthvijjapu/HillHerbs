// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Lock, Shield, Leaf, LogIn, Eye, EyeOff } from 'lucide-react';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const loggedInUser = await login(username, password);

            if (loggedInUser.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (loggedInUser.role === 'expert') {
                navigate('/expert-dashboard');
            } else if (loggedInUser.role === 'expert_pending') {
                navigate('/pending-approval');
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                                        <Leaf className="h-8 w-8" />
                                    </div>
                                    <h1 className="text-3xl font-bold">HillHerbs</h1>
                                </div>
                                <p className="text-emerald-100 text-lg">
                                    Welcome back to your Hill herbs community
                                </p>
                            </div>

                            <div className="space-y-6 mt-8">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Secure Access</h3>
                                        <p className="text-emerald-100 text-sm">Your data is protected with encryption</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Expert Community</h3>
                                        <p className="text-emerald-100 text-sm">Connect with certified plant specialists</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Leaf className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Plant Database</h3>
                                        <p className="text-emerald-100 text-sm">Access thousands of plant care guides</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/20">
                                <p className="text-emerald-100">
                                    New to Hill Herbs?{' '}
                                    <Link to="/register" className="font-semibold text-white hover:text-emerald-100 underline">
                                        Create an account
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="lg:w-3/5 bg-white p-8 lg:p-12">
                        <div className="mb-8">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-4">
                                <LogIn className="h-4 w-4 mr-2" />
                                Secure Login
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Welcome Back
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Sign in to continue your plant care journey
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="inline h-4 w-4 mr-2" />
                                        Username or Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input 
                                            id="username" 
                                            name="username" 
                                            type="text" 
                                            required 
                                            value={username} 
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full pl-12 px-4 py-3.5 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
                                            placeholder="Enter your username or email" 
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Lock className="inline h-4 w-4 mr-2" />
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input 
                                            id="password" 
                                            name="password" 
                                            type={showPassword ? "text" : "password"} 
                                            required 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-12 px-4 py-3.5 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
                                            placeholder="Enter your password" 
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
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
                                            Signing in...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center">
                                            <LogIn className="h-5 w-5 mr-2" />
                                            Sign In
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                        Join our community
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;