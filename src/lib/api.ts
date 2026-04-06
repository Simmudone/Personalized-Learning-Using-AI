import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

export const generateAssignment = (topic: string, difficulty: string) =>
  API.post("/generate-assignment", { topic, difficulty });

export const submitAssignment = (data: any) =>
  API.post("/submit-assignment", data);

export const addCourse = (data: any) =>
  API.post("/add-course", data);

export default API;