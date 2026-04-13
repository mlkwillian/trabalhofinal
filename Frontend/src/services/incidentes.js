import { api } from "./api";

export const getIncidentes = () => api.get("/incidentes");
export const createIncidente = (data) => api.post("/incidentes", data);