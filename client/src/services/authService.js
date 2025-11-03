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

const getMe = () => {
    return api.get('/auth/me');
};


const authService = {
    register,
    login,
    logout,
    getMe
};

export default authService;