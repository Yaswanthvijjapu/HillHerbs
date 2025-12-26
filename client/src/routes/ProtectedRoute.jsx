import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If roles are specified, check if user has one of them
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect logic based on what they ARE to avoid loops
        if (user.role === 'expert_pending') return <Navigate to="/pending-approval" replace />;
        if (user.role === 'hilly_user') return <Navigate to="/dashboard" replace />;
        // Default fallback
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;