import { api } from "../../../share/api/api";

/**
 * Inicia sesión de un cliente.
 * @param {{email: string, password: string}} payload
 * @returns {Promise<any>} Respuesta del backend (response.data)
 */
export async function login(payload) {
  const response = await api.post("/auth/login", payload);
  return response.data;
}

export default {
  login,
};


