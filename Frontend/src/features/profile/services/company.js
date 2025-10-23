import { api } from "../../../share/api/api";

/**
 * Crea o actualiza el perfil de una empresa en el sistema.
 * @param {{
 *   legalName: string,
 *   taxIdentification: string,
 *   address: string,
 *   companyEmail: string,
 *   businessSector: string,
 *   employeeCount: number,
 *   monthlyRevenue: number,
 *   monthlyExpenses: number,
 *   companyYears: number
 * }} payload
 * @returns {Promise<any>} Respuesta del backend (response.data)
 */
export async function createOrUpdateCompany(payload) {
  const response = await api.post("/api/companies", payload);
  return response.data;
}

/**
 * Obtiene el perfil de la empresa del usuario autenticado.
 * @returns {Promise<any>} Respuesta del backend (response.data)
 */
export async function getCompanyProfile() {
  const response = await api.get("/api/companies/my-companies");
  return response.data;
}

export default {
  createOrUpdateCompany,
  getCompanyProfile,
};
