import api from './axiosInstance';

export const habitApi = {
    getAll: async () => {
        const response = await api.get('/habit');
        return response.data;
    },

    create: async (title, color) => { // color might be optional
        const response = await api.post('/habit', { title, color });
        return response.data;
    },

    mark: async (id) => {
        const response = await api.post(`/habit/${id}/mark`);
        return response.data;
    }
};
