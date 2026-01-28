import api from './axiosInstance';

export const roadmapApi = {
    // Generate roadmap
    generate: async () => {
        const response = await api.post('/roadmap');
        return response.data;
    },

    // Complete a task
    completeTask: async (taskId) => {
        // README says POST /complete with body likely containing taskId
        // or /complete might be specific to current day's task
        // "Complete a daily roadmap task."
        // I'll assume it needs a taskId or topic.
        const response = await api.post('/roadmap/complete', { taskId });
        return response.data;
    },

    // Clear backlog
    clearBacklog: async () => {
        const response = await api.post('/roadmap/backlog/clear');
        return response.data;
    }
};
