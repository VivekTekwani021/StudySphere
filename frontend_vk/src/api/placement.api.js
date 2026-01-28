import api from './axiosInstance';

export const placementApi = {
    getAll: async () => {
        const response = await api.get('/placement');
        return response.data;
    },

    apply: async (id) => {
        const response = await api.post(`/placement/${id}/apply`);
        return response.data;
    }
};
