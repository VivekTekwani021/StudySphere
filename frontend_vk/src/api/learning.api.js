// import api from './axiosInstance';

// export const learningApi = {
//     // Get AI content for a topic
//     getContent: async (topic) => {
//         const response = await api.post('/learning/content', { topic });
//         return response.data;
//     },

//     // Mark topic as learned
//     markLearned: async (topicId) => {
//         const response = await api.post('/learning/complete', { topicId });
//         return response.data;
//     },

    // Generate quiz
    // generateQuiz: async (topic) => {
    //     const response = await api.post('/quiz/generate', { topic });
    //     return response.data;
    // },

    // // Submit quiz
    // submitQuiz: async (quizId, answers) => { // answers: { [questionId]: answerIndex }
    //     const response = await api.post('/quiz/submit', { quizId, answers });
    //     return response.data;
    // }
//};
// import api from './axiosInstance';

// export const learningApi = {
//   /**
//    * Used ONLY for YouTube Learning
//    * We ignore explanation completely here
//    */
//   getVideos: async (topic) => {
//     const response = await api.post('/learning/content', {
//       topic
//     });

//     return response.data.videos; // 👈 ONLY VIDEOS
//   }
// };
import api from './axiosInstance';

export const learningApi = {
  getContent: async ({ topic, prompt = "" }) => {
    const res = await api.post('/learning/content', {
      topic,
      prompt
    });

    return res.data;   // must return full object
  }
};


