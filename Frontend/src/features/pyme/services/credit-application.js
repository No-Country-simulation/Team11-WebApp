import { api } from "../../../share/api/api";

/**
 * Crea una nueva solicitud de crédito
 * @param {{
 *   creditType: string,
 *   requestedAmount: number,
 *   termMonths: number,
 *   description: string,
 *   monthlyRevenue: number,
 *   monthlyExpenses: number,
 *   companyYears: number,
 *   applicationCheckbox: boolean
 * }} payload
 * @returns {Promise<any>} Respuesta del backend
 */
export async function createCreditApplication(payload) {
  // Mapear los datos del formulario al formato que espera el backend
  const backendPayload = {
    creditType: payload.creditType,
    description: payload.description || `Solicitud de crédito para ${payload.creditPurpose}`,
    requestedAmount: parseFloat(payload.requestedAmount),
    termMonths: parseInt(payload.termMonths),
    monthlyRevenue: parseFloat(payload.monthlyRevenue),
    monthlyExpenses: parseFloat(payload.monthlyExpenses),
    companyYears: parseInt(payload.companyYears),
    applicationCheckbox: true // Siempre true porque el usuario aceptó los términos
  };

  const response = await api.post('/api/credit-applications', backendPayload);
  return response.data;
}

/**
 * Envía una solicitud de crédito (cambia estado SAVE → PENDING)
 * @param {string} applicationId - ID de la aplicación
 * @returns {Promise<any>} Respuesta del backend
 */
export async function submitCreditApplication(applicationId) {
  const response = await api.post(`/api/credit-applications/${applicationId}/submit`);
  return response.data;
}

/**
 * Obtiene todas las solicitudes de crédito de la compañía del usuario
 * @returns {Promise<any>} Lista de aplicaciones
 */
export async function getCompanyCreditApplications() {
  const response = await api.get('/api/credit-applications/company');
  return response.data;
}

export default {
  createCreditApplication,
  submitCreditApplication,
  getCompanyCreditApplications,
};