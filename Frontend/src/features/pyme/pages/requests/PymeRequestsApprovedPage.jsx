export default function PymeRequestsApprovedPage() {
  return (
    <div className="overflow-x-auto text-text">
      <table className="min-w-full">
        <thead >
          <tr>
            <th className="px-4 py-3 text-left font-bold">N° Solicitud</th>
            <th className="px-4 py-3 text-left font-bold">Fecha de envío</th>
            <th className="px-4 py-3 text-left font-bold">Monto aprobado</th>
            <th className="px-4 py-3 text-left font-bold">Plazo</th>
            <th className="px-4 py-3 text-left font-bold">Próximo paso</th>
            <th className="px-4 py-3 text-left font-bold">Detalles</th>
          </tr>
        </thead>
        <tbody >
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-3 whitespace-nowrap">#001</td>
            <td className="px-4 py-3 whitespace-nowrap">08/04/2024</td>
            <td className="px-4 py-3 whitespace-nowrap">$13.500.000</td>
            <td className="px-4 py-3 whitespace-nowrap">24 meses</td>
            <td className="px-4 py-3 whitespace-nowrap">Firmar contrato</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <button className="text-primary underline text-sm">Ver detalles</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


