import { useState, useEffect } from "react";
import {
  getApplicationsForReview,
  updateApplicationStatus,
  getDocumentsByApplication,
} from "../services/credit-application";
import { X, FileText, Download } from "lucide-react";

export default function OperatorRequestsManagePage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewComments, setReviewComments] = useState("");
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await getApplicationsForReview();
      setApplications(data);
    } catch (error) {
      console.error("Error cargando aplicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (applicationId) => {
    try {
      setDocumentsLoading(true);
      const docs = await getDocumentsByApplication(applicationId);
      setDocuments(docs);
    } catch (error) {
      console.error("Error cargando documentos:", error);
      setDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedApplication) return;

    try {
      await updateApplicationStatus(selectedApplication.id, {
        newStatus,
        reviewComments:
          reviewComments.trim() ||
          `Solicitud ${
            newStatus === "APPROVED" ? "aprobada" : "rechazada"
          } por el revisor`,
      });
      await loadApplications(); // Recargar la lista
      setShowModal(false);
      setReviewComments("");
      setSelectedApplication(null);
      setDocuments([]);
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  const openReviewModal = async (application) => {
    setSelectedApplication(application);
    setReviewComments("");
    setShowModal(true);
    // Cargar documentos cuando se abre el modal
    await loadDocuments(application.id);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    setReviewComments("");
    setDocuments([]);
  };

  // Función para calcular el riesgo basado en los criterios establecidos
  const calculateRiskLevel = (application) => {
    const {
      monthlyProfit,
      companyYears,
      isProfitable,
      monthlyRevenue,
      monthlyExpenses,
      employeeCount,
    } = application;

    let score = 0;

    // 1. Rentabilidad (30% del score)
    if (!isProfitable) score += 30;
    else if (monthlyProfit < monthlyRevenue * 0.1) score += 20;
    else if (monthlyProfit < monthlyRevenue * 0.2) score += 10;

    // 2. Estabilidad de la empresa (25% del score)
    if (companyYears < 1) score += 25;
    else if (companyYears < 2) score += 15;
    else if (companyYears < 3) score += 5;

    // 3. Ratio gastos/ingresos (25% del score)
    const expenseRatio = monthlyExpenses / monthlyRevenue;
    if (expenseRatio > 0.8) score += 25;
    else if (expenseRatio > 0.6) score += 15;
    else if (expenseRatio > 0.4) score += 5;

    // 4. Tamaño de la empresa (20% del score)
    if (employeeCount < 5) score += 20;
    else if (employeeCount < 10) score += 10;
    else if (employeeCount < 20) score += 5;

    // Determinar nivel de riesgo según los rangos establecidos
    if (score >= 71) {
      return {
        level: "ALTO",
        color: "bg-DarkRed",
        textColor: "text-DarkRed",
        description: "Riesgo elevado, posible rechazo o revisión detallada",
      };
    } else if (score >= 41) {
      return {
        level: "MEDIO",
        color: "bg-amber-500",
        textColor: "text-amber-700",
        description: "Se recomienda revisión manual de documentación",
      };
    } else {
      return {
        level: "BAJO",
        color: "bg-green-500",
        textColor: "text-green-700",
        description: "Perfil confiable, sin incidencias detectadas",
      };
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      SAVE: { color: "bg-gray-100 text-gray-800", label: "BORRADOR" },
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "PENDIENTE" },
      UNDER_REVIEW: {
        color: "bg-blue-100 text-blue-800",
        label: "EN REVISIÓN",
      },
      APPROVED: { color: "bg-green-100 text-green-800", label: "APROBADO" },
      REJECTED: { color: "bg-red-100 text-red-800", label: "RECHAZADO" },
      CANCELLED: { color: "bg-gray-100 text-gray-800", label: "CANCELADO" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getCreditTypeLabel = (type) => {
    const types = {
      WORKING_CAPITAL: "Capital de Trabajo",
      INVESTMENT: "Inversión",
      EQUIPMENT: "Equipamiento",
      OTHER: "Otro",
    };
    return types[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDocumentTypeLabel = (type) => {
    const types = {
      ID_CARD: "Cédula de Identidad",
      FINANCIAL_STATEMENT: "Estado Financiero",
      BALANCE_SHEET: "Balance General",
      NOTARIAL_POWER: "Poder Notarial",
      TAX_RETURN: "Declaración de Impuestos",
      ADDRESS_PROOF: "Comprobante de Domicilio",
      BANK_REFERENCE: "Referencia Bancaria",
      // Mantener compatibilidad con tipos antiguos si existen
      IDENTIFICATION: "Cédula de Identidad",
      TAX_DECLARATION: "Declaración de Impuestos",
      BUSINESS_LICENSE: "Licencia Comercial",
      BANK_STATEMENT: "Referencia Bancaria",
      OTHER: "Otro",
    };
    return types[type] || type;
  };

  const handleViewDocument = async (documentId) => {
    try {
      // Aquí puedes implementar la lógica para ver el documento
      // Por ejemplo, abrir en nueva pestaña o descargar
      const document = await getDocumentById(documentId);
      if (document.fileUrl) {
        window.open(document.fileUrl, "_blank");
      }
    } catch (error) {
      console.error("Error abriendo documento:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-text">Gestión de solicitudes</h1>
        <p className="mt-2 text-text">Cargando aplicaciones...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text">Gestión de solicitudes</h1>
      <p className="mt-2 text-text">
        {applications.length} solicitudes pendientes de revisión
      </p>

      <div className="mt-6 bg-white overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                PIME
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                Tipo de Crédito
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                Fecha de Envío
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                Riesgo Estimado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => {
              const risk = calculateRiskLevel(application);
              return (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {application.companyName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {application.companyYears} años operando
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getCreditTypeLabel(application.creditType)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      ${application.requestedAmount?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {application.termMonths} meses
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(application.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(application.creditStatus)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${risk.color} mr-2`}
                      ></div>
                      <span
                        className={`text-sm font-semibold ${risk.textColor}`}
                      >
                        {risk.level}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => openReviewModal(application)}
                      className="bg-secondary hover:cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Revisar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {applications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">
              No hay solicitudes pendientes de revisión
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Todas las solicitudes han sido revisadas
            </p>
          </div>
        )}
      </div>

      {/* Modal de Revisión */}
      {showModal && selectedApplication && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Revisar Solicitud - {selectedApplication.companyName}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Información principal */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Información de la PIME
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre de la Empresa
                        </label>
                        <p className="text-sm text-gray-900 font-semibold">
                          {selectedApplication.companyName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Años de Operación
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedApplication.companyYears} años
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ingresos Mensuales
                        </label>
                        <p className="text-sm text-gray-900">
                          ${selectedApplication.monthlyRevenue?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gastos Mensuales
                        </label>
                        <p className="text-sm text-gray-900">
                          ${selectedApplication.monthlyExpenses?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rentabilidad Mensual
                        </label>
                        <p
                          className={`text-sm font-semibold ${
                            selectedApplication.isProfitable
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ${selectedApplication.monthlyProfit?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Empleados
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedApplication.employeeCount} personas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Detalles del Crédito
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <p className="text-sm text-gray-900">
                        {getCreditTypeLabel(selectedApplication.creditType)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monto Solicitado
                      </label>
                      <p className="text-lg font-bold text-gray-900">
                        ${selectedApplication.requestedAmount?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plazo
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedApplication.termMonths} meses
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Envío
                      </label>
                      <p className="text-sm text-gray-900">
                        {formatDate(selectedApplication.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Riesgo Estimado
                      </label>
                      <div className="flex items-center mt-1">
                        {(() => {
                          const risk = calculateRiskLevel(selectedApplication);
                          return (
                            <>
                              <div
                                className={`w-3 h-3 rounded-full ${risk.color} mr-2`}
                              ></div>
                              <span
                                className={`text-sm font-semibold ${risk.textColor}`}
                              >
                                {risk.level}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {calculateRiskLevel(selectedApplication).description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción de la solicitud
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px]">
                    <p className="text-sm text-gray-900">
                      {selectedApplication.description ||
                        "No se proporcionó descripción"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documentos */}
              <div className="mb-6 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentos adjuntos
                </h3>
                {documentsLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                  </div>
                ) : documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {getDocumentTypeLabel(document.documentType)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {document.fileName || "Documento sin nombre"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewDocument(document.id)}
                          className="text-primary hover:text-primary-dark flex items-center gap-1 px-3 py-1 rounded transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Ver
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500 text-sm">No hay documentos adjuntos</p>
                  </div>
                )}
              </div>

              {/* Comentarios de revisión */}
              <div className="mb-6 border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentarios de revisión *
                </label>
                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Ingresa los comentarios de la revisión..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                  rows="4"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Los comentarios son obligatorios para aprobar o rechazar la
                  solicitud
                </p>
              </div>

              {/* Acciones */}
              <div className="flex space-x-3 justify-end border-t pt-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleStatusUpdate("REJECTED")}
                  disabled={!reviewComments.trim()}
                  className="px-6 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  Rechazar Solicitud
                </button>
                <button
                  onClick={() => handleStatusUpdate("APPROVED")}
                  disabled={!reviewComments.trim()}
                  className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  Aprobar Solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
