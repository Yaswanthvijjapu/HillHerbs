import api from './api';

const getPending = () => {
    return api.get('/plants/pending');
};

const verify = (id, action, correctedName = '') => {
    return api.post(`/plants/verify/${id}`, { action, correctedName });
};

const plantService = {
    getPending,
    verify,
};

export default plantService;