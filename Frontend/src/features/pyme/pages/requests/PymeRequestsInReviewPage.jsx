export default function PymeRequestsInReviewPage() {
  return (
    <div className="overflow-x-auto text-text">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left font-bold">N° Solicitud</th>
            <th className="px-4 py-3 text-left font-bold">Fecha de envío</th>
            <th className="px-4 py-3 text-left font-bold">Monto solicitado</th>
            <th className="px-4 py-3 text-left font-bold">Tipo de crédito</th>
            <th className="px-4 py-3 text-left font-bold">Estado</th>
            <th className="px-4 py-3 text-left font-bold">Detalles</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-3 whitespace-nowrap">#003</td>
            <td className="px-4 py-3 whitespace-nowrap">15/09/2025</td>
            <td className="px-4 py-3 whitespace-nowrap">$20.000.000</td>
            <td className="px-4 py-3 whitespace-nowrap">Capital de trabajo</td>
            <td className="px-4 py-3 whitespace-nowrap">En revisión</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <button className="text-primary underline text-sm">Ver detalles</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


