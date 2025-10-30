import { api } from "../../../share/api/api";

/**
 * Actualiza el estado de una aplicación de crédito
 * @param {string} applicationId - ID de la aplicación
 * @param {{
 *   status: string,
 *   reviewComments?: string
 * }} payload - Datos para actualizar el estado
 * @returns {Promise<any>} Respuesta del backend
 */
export async function updateApplicationStatus(applicationId, payload) {
  const response = await api.put(
    `/operator/${applicationId}/status`,
    payload
  );
  return response.data;
}

/**
 * Obtiene todas las aplicaciones para revisión
 * @returns {Promise<any[]>} Lista de aplicaciones pendientes de revisión
 */
export async function getApplicationsForReview() {
  const response = await api.get("/operator/applications/for-review");
  return response.data;
}

/**
 * Obtiene un documento por su ID
 * @param {string} documentId - ID del documento
 * @returns {Promise<any>} Documento
 */
export async function getDocumentById(documentId) {
  const response = await api.get(`/api/documents/${documentId}`);
  return response.data;
}

/**
 * Obtiene todos los documentos de una aplicación
 * @param {string} applicationId - ID de la aplicación
 * @returns {Promise<any[]>} Lista de documentos
 */
export async function getDocumentsByApplication(applicationId) {
  const response = await api.get(`/api/documents/application/${applicationId}`);
  return response.data;
}

export default {
  updateApplicationStatus,
  getApplicationsForReview,
  getDocumentById,
  getDocumentsByApplication
};