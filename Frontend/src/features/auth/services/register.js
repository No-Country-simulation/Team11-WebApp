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

/**
 * Registra un operador en el sistema.
 * @param {{name: string, lastName: string, dni: string, email: string, password: string}} payload
 * @returns {Promise<any>} Respuesta del backend (response.data)
 */
export async function registerOperator(payload) {
  const response = await api.post("/auth/operator/register", payload);
  return response.data;
}

export default {
  registerClient,
  registerOperator,
};


