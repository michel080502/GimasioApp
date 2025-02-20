import axios from "axios";

const clienteAxios = axios.create({
  baseURL: `http:${import.meta.env.VITE_BACKEND_URL}/api`,
});

export default clienteAxios;
