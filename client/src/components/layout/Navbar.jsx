// client/src/components/layout/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User as UserIcon } from 'lucide-react'; // Import an icon for the avatar

function Navbar() {
    const { isAuthenticated, logout, user } = useAuth();

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to={isAuthenticated ? (user?.role === 'expert' ? "/expert-dashboard" : "/dashboard") : "/login"} className="text-2xl font-bold text-green-600">
                            HillHerbs
                        </Link>
                    </div>
                    {isAuthenticated && (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 hidden sm:block">Welcome, {user.fullName || user.username}!</span>
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                            >
                                Logout
                            </button>
                            {/* --- NEW PROFILE ICON LINK --- */}
                            <Link to="/profile" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                <UserIcon className="h-5 w-5 text-gray-600" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;