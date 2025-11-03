// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authService.getMe()
                .then(response => { setUser(response.data); })
                .catch(() => {
                    authService.logout();
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            // 1. Call the API service
            const response = await authService.login(username, password);

            // 2. Extract data from the successful response
            const { token, user: userData } = response.data;
            
            // 3. Save to localStorage and update state
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            
            // 4. IMPORTANT: Return the user data so the LoginPage can use it
            return userData; 
        } catch (error) {
            // If an error occurs, throw it again so the LoginPage's catch block can handle it
            throw error;
        }
    };
    
    const loginWithToken = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = { user, login, logout, loginWithToken, isAuthenticated: !!user };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};