import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getLearningContent = (data) =>
  API.post("/learning/content", data);

export const markTopicLearned = (data) =>
  API.post("/learning/complete", data);
