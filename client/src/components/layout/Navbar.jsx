import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
    const { isAuthenticated, logout, user } = useAuth();

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-2xl font-bold text-green-600">
                            HillHerbs
                        </Link>
                    </div>
                    {isAuthenticated && (
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4">Welcome, {user.username}!</span>
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;