import api from './api';

const register = (username, password, fullName, role = 'hilly_user') => {
    return api.post('/auth/register', { username, password, fullName, role });
};

const login = (username, password) => {
    return api.post('/auth/login', { username, password });
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;