import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HillyUserDashboard from './pages/HillyUserDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import ExpertDashboard from './pages/ExpertDashboard';
import KnowledgeHubPage from './pages/KnowledgeHubPage';

// Layout component to wrap pages with the Navbar
const AppLayout = () => (
    <>
        <Navbar />
        <main>
            <Outlet /> {/* Child routes will render here */}
        </main>
    </>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Routes without Navbar for fullscreen feel */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Protected Routes with Navbar */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                            <Route path="/dashboard" element={<HillyUserDashboard />} />
                            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
                              <Route path="/explore" element={<KnowledgeHubPage />} />
                        </Route>
                    </Route>



                    {/* Default route */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;