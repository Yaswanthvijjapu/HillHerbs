// client/src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  Leaf,
  Shield,
  Home
} from 'lucide-react';

function Navbar() {
    const { isAuthenticated, logout, user } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Determine user dashboard link based on role
    const getDashboardLink = () => {
        if (!isAuthenticated) return "/login";
        if (user?.role === 'admin') return "/admin-dashboard";
        if (user?.role === 'expert') return "/expert-dashboard";
        if (user?.role === 'expert_pending') return "/pending-approval";
        return "/dashboard";
    };

    const getUserRoleIcon = () => {
        if (user?.role === 'admin') return <Shield className="h-4 w-4 text-purple-600" />;
        if (user?.role === 'expert') return <Leaf className="h-4 w-4 text-emerald-600" />;
        return <UserIcon className="h-4 w-4 text-blue-600" />;
    };

    const getUserRoleText = () => {
        if (user?.role === 'admin') return 'Admin';
        if (user?.role === 'expert') return 'Expert';
        if (user?.role === 'expert_pending') return 'Expert (Pending)';
        return 'User';
    };

    return (
        <>
            <nav className="bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo/Brand */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                            
                            <Link to={getDashboardLink()} className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Leaf className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                        HillHerbs
                                    </h1>
                                    <p className="text-xs text-emerald-600 font-medium">Medicinal Plant Database</p>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-2">
                            {isAuthenticated ? (
                                <>
                                    <Link 
                                        to={getDashboardLink()} 
                                        className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${location.pathname === getDashboardLink() ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
                                    >
                                        <Home className="h-4 w-4" />
                                        <span className="font-medium">Dashboard</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        className={`px-4 py-2 rounded-lg transition-all ${location.pathname === '/login' ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transform hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-3">
                            {isAuthenticated ? (
                                <>
                                    {/* User Profile Dropdown */}
                                    <div className="relative">
                                        <button 
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-emerald-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl border border-emerald-200">
                                                {getUserRoleIcon()}
                                            </div>
                                            <div className="hidden lg:block text-left">
                                                <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                                                    {user.fullName || user.username}
                                                </p>
                                                <span className="text-xs text-emerald-600 font-medium">
                                                    {getUserRoleText()}
                                                </span>
                                            </div>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {userMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <p className="text-sm font-semibold text-gray-900">{user.fullName || user.username}</p>
                                                    <div className="mt-2">
                                                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium">
                                                            {getUserRoleText()}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <Link 
                                                    to="/profile" 
                                                    className="flex items-center space-x-3 px-4 py-3 hover:bg-emerald-50 text-gray-700"
                                                    onClick={() => setUserMenuOpen(false)}
                                                >
                                                    <UserIcon className="h-5 w-5 text-gray-500" />
                                                    <span>My Profile</span>
                                                </Link>
                                                
                                                <div className="border-t border-gray-100 mt-2 pt-2">
                                                    <button 
                                                        onClick={() => {
                                                            logout();
                                                            setUserMenuOpen(false);
                                                        }}
                                                        className="flex items-center space-x-3 px-4 py-3 w-full text-left hover:bg-red-50 text-red-600"
                                                    >
                                                        <LogOut className="h-5 w-5" />
                                                        <span>Sign Out</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <div className="lg:hidden">
                                        <Link 
                                            to="/register" 
                                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium text-sm"
                                        >
                                            Join
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-emerald-100 shadow-lg">
                        <div className="px-4 py-3 space-y-1">
                            {isAuthenticated ? (
                                <>
                                    <Link 
                                        to={getDashboardLink()} 
                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-emerald-50 text-gray-700"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Home className="h-5 w-5" />
                                        <span>Dashboard</span>
                                    </Link>
                                    
                                    <Link 
                                        to="/profile" 
                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-emerald-50 text-gray-700"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <UserIcon className="h-5 w-5" />
                                        <span>My Profile</span>
                                    </Link>
                                    
                                    <button 
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg hover:bg-red-50 text-red-600"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-emerald-50 text-gray-700"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span>Sign In</span>
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white justify-center"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span>Create Account</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Backdrop for mobile menu */}
            {mobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Backdrop for user dropdown */}
            {userMenuOpen && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                />
            )}
        </>
    );
}

export default Navbar;