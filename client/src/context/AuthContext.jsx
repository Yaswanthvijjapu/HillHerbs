// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            return null;
        }
        try {
            return JSON.parse(storedUser);
        } catch (error) {
            localStorage.removeItem('user');
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authService.getMe()
                .then(response => {
                    setUser(response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                })
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
            const { token } = response.data;
            
            // 3. Save to localStorage and update state
            localStorage.setItem('token', token);
            try {
                const profileResponse = await authService.getMe();
                localStorage.setItem('user', JSON.stringify(profileResponse.data));
                setUser(profileResponse.data);
            
                // 4. IMPORTANT: Return the user data so the LoginPage can use it
                return profileResponse.data; 
            } catch (profileError) {
                authService.logout();
                setUser(null);
                throw profileError;
            }
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

    const refreshUser = useCallback(async () => {
        try {
            const response = await authService.getMe();
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            throw error;
        }
    }, []);

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        setUser,
        loading,
        login,
        logout,
        loginWithToken,
        refreshUser,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};