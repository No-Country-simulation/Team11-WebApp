import { api } from "../../../share/api/api";

/**
 * Registra un cliente en el sistema.
 * @param {{name: string, lastName: string, dni: string, email: string, password: string}} payload
 * @returns {Promise<any>} Respuesta del backend (response.data)
 */
export async function registerClient(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export default {
  registerClient,
};


