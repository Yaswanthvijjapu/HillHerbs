import api from './api';

const getPending = () => {
    return api.get('/plants/pending');
};

const verify = (id, payload) => {
    return api.post(`/plants/verify/${id}`, payload);
};

// ... getPending and verify functions ...

const getHistory = () => {
    return api.get('/plants/history/expert');
};


const plantService = {
    getPending,
    verify,
    getHistory,
};

export default plantService;