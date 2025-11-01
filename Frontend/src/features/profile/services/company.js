import { api } from "../../../share/api/api";

/**
 * Crea o actualiza el perfil de una empresa en el sistema.
 * @param {{
 *   id?: string,
 *   legalName: string,
 *   taxIdentification: string,
 *   address: string,
 *   companyEmail: string,
 *   businessSector: string,
 *   employeeCount: number
 * }} payload
 * @returns {Promise<any>} Respuesta del backend (response.data)
 */
export async function createOrUpdateCompany(payload) {
  // Si el payload tiene ID, es una actualización
  if (payload.id) {
    const { id, ...payloadWithoutId } = payload;
    console.log(payloadWithoutId);
    const response = await api.put(`/api/companies`, payloadWithoutId);
    return response.data;
  } else {
    // Si no tiene ID, es una creación
    const response = await api.post("/api/companies", payload);
    return response.data;
  }
}

/**
 * Obtiene el perfil de la empresa del usuario autenticado.
 * @returns {Promise<any>} Respuesta del backend (response.data)
 */
export async function getCompanyProfile() {
  const response = await api.get("/api/companies/my-company");
  return response.data;
}

/**
 * Elimina el perfil de la empresa del usuario autenticado.
 * @returns {Promise<any>} Respuesta del backend (response.data)
 */
export async function deleteCompany() {
  const response = await api.delete("/api/companies");
  return response.data;
}

export default {
  createOrUpdateCompany,
  getCompanyProfile,
  deleteCompany,
};
