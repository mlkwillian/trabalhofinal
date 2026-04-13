import { api } from "./api";

export const getSalas = () => api.get("/salas");
export const createSala = (data) => api.post("/salas", data);