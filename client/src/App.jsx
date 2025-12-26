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
import ProfilePage from './pages/ProfilePage'; 
import HeroPage from './pages/HeroPage'; 
import AdminDashboard from './pages/AdminDashboard';
import PendingApprovalPage from './pages/PendingApprovalPage';

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
                    {/* Public Hero Page */}
                    <Route path="/" element={<HeroPage />} />
                    
                    {/* Routes without Navbar for fullscreen feel */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Protected Routes with Navbar */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                            <Route path="/dashboard" element={<HillyUserDashboard />} />
                            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
                            <Route path="/explore" element={<KnowledgeHubPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Route>
                    </Route>

                     <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    </Route>

                    <Route path="/pending-approval" element={<PendingApprovalPage />} />



                    {/* Default route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;