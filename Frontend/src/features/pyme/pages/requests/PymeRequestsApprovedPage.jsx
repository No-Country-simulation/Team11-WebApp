import { useState } from "react";
import { useCreditApplicationsStore } from "../../store/useCreditApplicationsStore";
import { getApplicationDocuments } from "../../services/documents";
import { X, FileText, Download } from "lucide-react";
import { getDocumentTypeLabel } from "../../helpers/DocumentType";

export default function PymeRequestsApprovedPage() {
  const { getApplicationsByStatus, loading, error } =
    useCreditApplicationsStore();

  // Obtener solo las aplicaciones aprobadas
  const applications = getApplicationsByStatus("APPROVED");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const getCreditTypeLabel = (type) => {
    const typeLabels = {
      WORKING_CAPITAL: "Capital de trabajo",
      INVESTMENT: "Inversión",
      EQUIPMENT: "Equipamiento",
      OTHER: "Otro",
    };
    return typeLabels[type] || type;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  // Función para determinar el próximo paso (puedes personalizar según tu lógica de negocio)
  const getNextStep = (application) => {
    // Aquí puedes agregar lógica basada en el estado de la aplicación
    // Por ejemplo, si ya firmó documentos, etc.
    return "Firmar contrato";
  };

  const handleViewDetails = async (applicationId) => {
    const application = applications.find((app) => app.id === applicationId);
    if (!application) return;

    setSelectedApplication(application);
    setShowDetailsModal(true);
    setLoadingDocuments(true);
    setDocuments([]);

    try {
      const docs = await getApplicationDocuments(applicationId);
      setDocuments(docs || []);
    } catch (error) {
      console.error("Error al cargar documentos:", error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedApplication(null);
    setDocuments([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Error al cargar las solicitudes: {error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto text-text">
      {applications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No hay solicitudes aprobadas</p>
        </div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left font-bold">N° Solicitud</th>
              <th className="px-4 py-3 text-left font-bold">Fecha de envío</th>
              <th className="px-4 py-3 text-left font-bold">Monto aprobado</th>
              <th className="px-4 py-3 text-left font-bold">Plazo</th>
              <th className="px-4 py-3 text-left font-bold">Próximo paso</th>
              <th className="px-4 py-3 text-left font-bold">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  #{application.id.slice(-6)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(application.createdAt || application.submittedAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatCurrency(application.requestedAmount)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {application.termMonths} meses
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {getNextStep(application)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button 
                    onClick={() => handleViewDetails(application.id)}
                    className="text-primary underline text-sm hover:text-primary-dark"
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de detalles de solicitud */}
      {showDetailsModal && selectedApplication && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40 overflow-y-auto"
          onClick={closeDetailsModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Detalles de la Solicitud #{selectedApplication.id.slice(-6)}
                </h2>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de crédito
                  </label>
                  <p className="text-gray-900">
                    {getCreditTypeLabel(selectedApplication.creditType)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto aprobado
                  </label>
                  <p className="text-gray-900">
                    {formatCurrency(selectedApplication.requestedAmount)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plazo en meses
                  </label>
                  <p className="text-gray-900">
                    {selectedApplication.termMonths} meses
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de envío
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedApplication.createdAt || selectedApplication.submittedAt)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facturación mensual
                  </label>
                  <p className="text-gray-900">
                    {formatCurrency(selectedApplication.monthlyRevenue)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gastos mensuales
                  </label>
                  <p className="text-gray-900">
                    {formatCurrency(selectedApplication.monthlyExpenses)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Años de operación
                  </label>
                  <p className="text-gray-900">
                    {selectedApplication.companyYears} años
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <p className="text-green-600 font-medium">
                    Aprobado
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedApplication.description || "Sin descripción"}
                </p>
              </div>

              {/* Sección de documentos */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentos adjuntos
                </h3>
                {loadingDocuments ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                  </div>
                ) : documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {doc.fileName || doc.name || `Documento ${doc.id}`}
                            </p>
                            {doc.documentType && (
                              <p className="text-xs text-gray-500">
                                Tipo: {getDocumentTypeLabel(doc.documentType)}
                              </p>
                            )}
                          </div>
                        </div>
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-dark flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            Ver
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No hay documentos adjuntos
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-6 border-t pt-4">
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
