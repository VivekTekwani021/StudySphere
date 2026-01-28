import api from './axiosInstance';

export const pdfApi = {
    downloadNotes: async (topic) => {
        const response = await api.post('/pdf/notes', { topic }, {
            responseType: 'blob', // Important for PDF download
        });
        return response.data; // Blob
    }
};
