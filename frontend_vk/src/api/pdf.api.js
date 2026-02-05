// import api from './axiosInstance';

// export const pdfApi = {
//     downloadNotes: async (topic) => {
//         const response = await api.post('/pdf/notes', { topic }, {
//             responseType: 'blob', // Important for PDF download
//         });
//         return response.data; // Blob
//     }
// };
// import api from './axiosInstance';

// export const pdfApi = {
//   /**
//    * Generates PDF notes for a topic
//    * Backend decides how notes are generated
//    */
//   downloadNotes: async (topic, prompt = '') => {
//     const response = await api.post(
//       '/pdf/download',
//       { topic, prompt },
//       { responseType: 'blob' }
//     );

//     return response.data; // 👈 PDF blob
//   }
// };

import api from "./axiosInstance";

export const pdfApi = {
  downloadNotes: async (topic, prompt = "") => {
    const res = await api.post(
      "/pdf/notes",   // 🔥 CORRECT ROUTE
      { topic, prompt },
      { responseType: "blob" }
    );

    return res.data;
  }
};
