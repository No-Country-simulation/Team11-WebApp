import { useState } from 'react';
import { useForm } from 'react-hook-form';

const CompanyProfile = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [bankAccounts, setBankAccounts] = useState([{ id: 1 }]);

  const onSubmit = (data) => {
    console.log(data);
  };

  const addBankAccount = () => {
    setBankAccounts([...bankAccounts, { id: bankAccounts.length + 1 }]);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl text-Green font-bold mb-6">Para poder operar, necesitamos que completes tu perfil</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="businessName" className="block text-Green font-medium mb-2">
            Razón Social
          </label>
          <input
            id="businessName"
            type="text"
            {...register('businessName')}
            className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-Green"
          />
        </div>

        <div>
          <label htmlFor="taxId" className="block text-Green font-medium mb-2">
            CUIT o RUT
          </label>
          <input
            id="taxId"
            type="text"
            {...register('taxId')}
            className="w-full px-4 py-2 border rounded-lg text-Green focus:outline-none focus:ring-2 focus:ring-Green"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-Green font-medium mb-2">
            Dirección
          </label>
          <input
            id="address"
            type="text"
            {...register('address')}
            className="w-full px-4 py-2 border rounded-lg text-Green focus:outline-none focus:ring-2 focus:ring-Green"
          />
        </div>

        <div>
          <label htmlFor="activity" className="block text-Green font-medium mb-2">
            Actividad
          </label>
          <select
            id="activity"
            {...register('activity')}
            className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-Green"
          >
            <option value="">Elige la opción que corresponda</option>
            <option value="Agropecuaria">Agropecuaria</option>
            <option value="Industrial / Manufactura">Industrial / Manufactura</option>
            <option value="Construcción">Construcción</option>
            <option value="Comercio">Comercio</option>
            <option value="Servicios">Servicios</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Energía / Minería">Energía / Minería</option>
            <option value="Transporte y Logística">Transporte y Logística</option>
            <option value="Educación y Salud">Educación y Salud</option>
            <option value="Turismo y Gastronomía">Turismo y Gastronomía</option>
            <option value="Finanzas">Finanzas</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        <div>
          <label htmlFor="seniority" className="block text-Green font-medium mb-2">
            Antigüedad
          </label>
          <input
            id="seniority"
            type="number"
            {...register('seniority')}
            className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-Green"
          />
        </div>

        <div>
          <label htmlFor="employeeCount" className="block text-Green font-medium mb-2">
            Cantidad de empleados
          </label>
          <input
            id="employeeCount"
            type="number"
            {...register('employeeCount')}
            className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-Green"
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-Green font-medium">Cuentas Bancarias</p>
          <button
            type="button"
            onClick={addBankAccount}
            className="px-4 py-2 border-0 text-Green cursor-pointer rounded-lg font-medium hover:text-GreenLogo transition-colors duration-300"
          >
            Agregar +
          </button>
        </div>

        {bankAccounts.map((account, index) => (
          <div key={account.id} className="grid grid-cols-4 gap-4">
            <div>
              <label htmlFor={`accountNumber-${index}`} className="block text-Green font-medium mb-2">
                Nro. de cuenta
              </label>
              <input
                id={`accountNumber-${index}`}
                type="number"
                {...register(`bankAccounts.${index}.accountNumber`)}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-Green"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor={`cbu-${index}`} className="block text-Green font-medium mb-2">
                CBU
              </label>
              <input
                id={`cbu-${index}`}
                type="number"
                {...register(`bankAccounts.${index}.cbu`)}
                className="w-full px-4 py-2 border rounded-lg text-Green focus:outline-none focus:ring-2 focus:ring-Green"
              />
            </div>

            <div>
              <label htmlFor={`bank-${index}`} className="block text-Green font-medium mb-2">
                Banco
              </label>
              <input
                id={`bank-${index}`}
                type="text"
                {...register(`bankAccounts.${index}.bank`)}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-Green"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            className="px-6 py-2 border-0 cursor-pointer rounded-lg text-Green font-medium hover:text-GreenLogo transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-DarkViolet cursor-pointer text-white rounded-lg font-medium hover:bg-Violet transition-opacity"
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;
