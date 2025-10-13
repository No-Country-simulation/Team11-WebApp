import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,  
});

// TODO(Auth): agregar interceptores para adjuntar automáticamente el token de autenticación.
