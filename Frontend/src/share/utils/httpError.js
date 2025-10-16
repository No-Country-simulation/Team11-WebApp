/**
 * Extrae un mensaje de error de una respuesta de Axios o de un objeto Error común.
 * @param {any} error - Error lanzado (AxiosError u otro)
 * @param {string} [fallbackMessage] - Mensaje por defecto si no se encuentra uno específico
 * @returns {string}
 */
export function extractApiErrorMessage(error, fallbackMessage = 'Ocurrió un error') {
  const data = error?.response?.data;
  if (typeof data === 'string') return data;
  if (data?.error) return data.error;
  if (data?.message) return data.message;
  if (error?.message) return error.message;
  return fallbackMessage;
}

/**
 * Retorna el status HTTP si está disponible.
 * @param {any} error
 * @returns {number | undefined}
 */
export function getApiErrorStatus(error) {
  return error?.response?.status;
}

export default {
  extractApiErrorMessage,
  getApiErrorStatus,
};


