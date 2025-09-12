import api from './api';

const getPending = () => {
    return api.get('/plants/pending');
};

const verify = (id, payload) => {
    return api.post(`/plants/verify/${id}`, payload);
};


const plantService = {
    getPending,
    verify,
};

export default plantService;