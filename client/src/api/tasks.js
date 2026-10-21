import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const fetchTasks = (params) =>
  api.get("/tasks", { params }).then((res) => res.data);

export const createTask = (data) =>
  api.post("/tasks", data).then((res) => res.data);

export const updateTask = (id, data) =>
  api.put(`/tasks/${id}`, data).then((res) => res.data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`).then((res) => res.data);