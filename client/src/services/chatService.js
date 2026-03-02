import api from './api';

const sendMessage = (message) => {
    return api.post('/chat/ask', { message }); 
};

const chatService = {
    sendMessage
};

export default chatService;