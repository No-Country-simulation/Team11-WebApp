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
    description:
      payload.description ||
      `Solicitud de crédito para ${payload.creditPurpose}`,
    requestedAmount: parseFloat(payload.requestedAmount),
    termMonths: parseInt(payload.termMonths),
    monthlyRevenue: parseFloat(payload.monthlyRevenue),
    monthlyExpenses: parseFloat(payload.monthlyExpenses),
    companyYears: parseInt(payload.companyYears),
    applicationCheckbox: true, // Siempre true porque el usuario aceptó los términos
  };

  const response = await api.post("/api/credit-applications", backendPayload);
  return response.data;
}

/**
 * Adjunta firma digital y consentimiento a una solicitud de crédito
 * @param {string} applicationId - ID de la aplicación
 * @param {{
 *   consent: boolean,
 *   signatureDocument: string
 * }} payload - Datos del consentimiento digital
 * @returns {Promise<any>} Respuesta del backend
 */
export async function attachDigitalSignature(applicationId, payload) {
  const signaturePayload = {
    consent: true, // Siempre debe ser true según el DTO
    signatureDocument: payload.signatureDocument, // URL, base64, o mock de la firma
  };

  // 1. Primero llamar al endpoint de firma
  const response = await api.post(
    `/api/credit-applications/${applicationId}/signature`,
    signaturePayload
  );

  // 2. Usar la respuesta para llamar automáticamente al webhook
  if (response.data.envelopeId) {
    const webhookPayload = {
      envelopeId: response.data.envelopeId,
      documentRef: response.data.provider || "MOCK",
    };

    // Llamar al webhook (puede ser en segundo plano sin esperar respuesta si prefieres)
    await api.post("/webhooks/docusign", webhookPayload);
  }

  return response.data;
}

/**
 * Envía una solicitud de crédito (cambia estado SAVE → PENDING)
 * @param {string} applicationId - ID de la aplicación
 * @returns {Promise<any>} Respuesta del backend
 */
export async function submitCreditApplication(applicationId) {
  const response = await api.post(
    `/api/credit-applications/${applicationId}/submit`
  );
  return response.data;
}

/**
 * Obtiene todas las solicitudes de crédito de la compañía del usuario
 * @returns {Promise<any>} Lista de aplicaciones
 */
export async function getCompanyCreditApplications() {
  const response = await api.get("/api/credit-applications/company");
  return response.data;
}

/**
 * Obtiene una solicitud de crédito por su ID
 * @param {string} applicationId - ID de la aplicación
 * @returns {Promise<any>} Aplicación de crédito
 */
export async function getCreditApplicationById(applicationId) {
  const response = await api.get(`/api/credit-applications/${applicationId}`);
  return response.data;
}

/**
 * Actualiza parcialmente una solicitud de crédito
 * @param {string} applicationId - ID de la aplicación
 * @param {Object} payload - Campos a actualizar
 * @returns {Promise<any>} Respuesta del backend
 */
export async function updateCreditApplication(applicationId, payload) {
  const response = await api.patch(
    `/api/credit-applications/${applicationId}`,
    payload
  );
  return response.data;
}

/**
 * Elimina una solicitud de crédito
 * @param {string} applicationId - ID de la aplicación
 * @returns {Promise<any>} Respuesta del backend
 */
export async function deleteCreditApplication(applicationId) {
  const response = await api.delete(
    `/api/credit-applications/${applicationId}`
  );
  return response.data;
}

export default {
  createCreditApplication,
  attachDigitalSignature,
  submitCreditApplication,
  getCompanyCreditApplications,
  getCreditApplicationById,
  updateCreditApplication,
  deleteCreditApplication,
};
