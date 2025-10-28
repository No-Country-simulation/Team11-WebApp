import { useCreditApplicationsStore } from "../../store/useCreditApplicationsStore";

export default function PymeRequestsApprovedPage() {
  const { getApplicationsByStatus, loading, error } =
    useCreditApplicationsStore();

  // Obtener solo las aplicaciones aprobadas
  const applications = getApplicationsByStatus("APPROVED");

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
                  <button className="text-primary underline text-sm">
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
