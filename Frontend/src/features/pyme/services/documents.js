import { api } from "../../../share/api/api";

/**
 * Sube documentos para una solicitud de crédito
 * @param {string} applicationId - ID de la aplicación
 * @param {File[]} files - Array de archivos
 * @param {string[]} types - Array de tipos de documento como strings
 * @returns {Promise<any>} Respuesta del backend
 */
export async function uploadDocuments(applicationId, files, types) {
  const formData = new FormData();
  
  // Agregar cada archivo
  files.forEach((file) => {
    formData.append('files', file);
  });

  // Agregar tipos como array (cada tipo por separado)
  types.forEach((type) => {
    formData.append('types', type);
  });

  const response = await api.post(
    `/api/documents/application/${applicationId}/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

/**
 * Obtiene documentos de una solicitud
 * @param {string} applicationId - ID de la aplicación
 * @returns {Promise<any>} Lista de documentos
 */
export async function getApplicationDocuments(applicationId) {
  const response = await api.get(`/api/documents/application/${applicationId}`);
  return response.data;
}

/**
 * Elimina un documento
 * @param {string} documentId - ID del documento
 * @returns {Promise<any>} Respuesta del backend
 */
export async function deleteDocument(documentId) {
  const response = await api.delete(`/api/documents/${documentId}`);
  return response.data;
}

export default {
  uploadDocuments,
  getApplicationDocuments,
  deleteDocument,
};