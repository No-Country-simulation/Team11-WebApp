import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createOrUpdateCompany } from "../services/company";
import { toast } from "sonner";
import { extractApiErrorMessage } from "../../../share/utils/httpError";
import { useCompanyStore } from "../store/useCompanyStore";

const CompanyProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();
  const [bankAccounts, setBankAccounts] = useState([{ id: 1 }]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { company } = useCompanyStore();

  useEffect(() => {
    if (company) {
      setValue("businessName", company.legalName);
      setValue("taxId", company.taxIdentification);
      setValue("address", company.address);
      setValue("companyEmail", company.companyEmail);
      setValue("activity", company.businessSector);
      setValue("employeeCount", company.employeeCount);
      setValue("monthlyRevenue", company.monthlyRevenue);
      setValue("monthlyExpenses", company.monthlyExpenses);
      setValue("seniority", company.companyYears);

      if (company.bankAccounts && company.bankAccounts.length > 0) {
        setValue("bankAccounts", company.bankAccounts);
      }
    }
  }, [company, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setSuccessMessage("");

      // Mapear los datos del formulario al formato del endpoint
      const companyData = {
        legalName: data.businessName,
        taxIdentification: data.taxId,
        address: data.address,
        companyEmail: data.companyEmail || "", // Agregar campo si no existe
        businessSector: data.activity,
        employeeCount: parseInt(data.employeeCount) || 0,
        monthlyRevenue: parseFloat(data.monthlyRevenue) || 0,
        monthlyExpenses: parseFloat(data.monthlyExpenses) || 0,
        companyYears: parseInt(data.seniority) || 0,
      };

      const response = await createOrUpdateCompany(companyData);
      setSuccessMessage("Perfil de empresa guardado exitosamente");
      toast.success(response?.message || "Perfil guardado");
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      const errorText = extractApiErrorMessage(
        error,
        "Error al guardar el perfil"
      );
      toast.error(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  const addBankAccount = () => {
    setBankAccounts([...bankAccounts, { id: bankAccounts.length + 1 }]);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl text-Green font-bold mb-6">
        Para poder operar, necesitamos que completes tu perfil
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="businessName"
            className="block text-Green font-medium mb-2"
          >
            Razón Social
          </label>
          <input
            id="businessName"
            type="text"
            {...register("businessName", {
              required: "La razón social es obligatoria",
              minLength: {
                value: 2,
                message: "La razón social debe tener al menos 2 caracteres",
              },
              maxLength: {
                value: 100,
                message: "La razón social no puede exceder 100 caracteres",
              },
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-Green ${
              errors.businessName ? "border-red-500" : "text-Green"
            }`}
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.businessName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="taxId" className="block text-Green font-medium mb-2">
            CUIT o RUT
          </label>
          <input
            id="taxId"
            type="text"
            {...register("taxId", {
              required: "El CUIT o RUT es obligatorio",
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-Green ${
              errors.taxId ? "border-red-500" : "text-Green"
            }`}
          />
          {errors.taxId && (
            <p className="text-red-500 text-sm mt-1">{errors.taxId.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-Green font-medium mb-2"
          >
            Dirección
          </label>
          <input
            id="address"
            type="text"
            {...register("address", {
              required: "La dirección es obligatoria",
              maxLength: {
                value: 200,
                message: "La dirección no puede exceder 200 caracteres",
              },
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-Green ${
              errors.address ? "border-red-500" : "text-Green"
            }`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="activity"
            className="block text-Green font-medium mb-2"
          >
            Actividad
          </label>
          <select
            id="activity"
            {...register("activity", {
              required: "Debe seleccionar una actividad",
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-Green ${
              errors.activity ? "border-red-500" : "text-Green"
            }`}
          >
            <option value="">Elige la opción que corresponda</option>
            <option value="Agropecuaria">Agropecuaria</option>
            <option value="Industrial / Manufactura">
              Industrial / Manufactura
            </option>
            <option value="Construcción">Construcción</option>
            <option value="Comercio">Comercio</option>
            <option value="Servicios">Servicios</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Energía / Minería">Energía / Minería</option>
            <option value="Transporte y Logística">
              Transporte y Logística
            </option>
            <option value="Educación y Salud">Educación y Salud</option>
            <option value="Turismo y Gastronomía">Turismo y Gastronomía</option>
            <option value="Finanzas">Finanzas</option>
            <option value="Otros">Otros</option>
          </select>
          {errors.activity && (
            <p className="text-red-500 text-sm mt-1">
              {errors.activity.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="seniority"
            className="block text-Green font-medium mb-2"
          >
            Antigüedad (años)
          </label>
          <input
            id="seniority"
            type="number"
            {...register("seniority", {
              required: "La antigüedad es obligatoria",
              min: {
                value: 0,
                message: "La antigüedad no puede ser negativa",
              },
              max: {
                value: 100,
                message: "La antigüedad no puede exceder 100 años",
              },
            })}
            min="0"
            max="100"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-Green ${
              errors.seniority ? "border-red-500" : "text-Green"
            }`}
          />
          {errors.seniority && (
            <p className="text-red-500 text-sm mt-1">
              {errors.seniority.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="companyEmail"
            className="block text-Green font-medium mb-2"
          >
            Email de la empresa
          </label>
          <input
            id="companyEmail"
            type="email"
            {...register("companyEmail", {
              required: "El email de la empresa es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Formato de email inválido",
              },
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-Green ${
              errors.companyEmail ? "border-red-500" : "text-Green"
            }`}
          />
          {errors.companyEmail && (
            <p className="text-red-500 text-sm mt-1">
              {errors.companyEmail.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="monthlyRevenue"
            className="block text-Green font-medium mb-2"
          >
            Ingresos mensuales
          </label>
          <input
            id="monthlyRevenue"
            type="number"
            step="0.01"
            {...register("monthlyRevenue", {
              required: "Los ingresos mensuales son obligatorios",
              min: {
                value: 0,
                message: "Los ingresos no pueden ser negativos",
              },
              max: {
                value: 999999999999,
                message: "Los ingresos exceden el límite permitido",
              },
            })}
            min="0"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-Green ${
              errors.monthlyRevenue ? "border-red-500" : "text-Green"
            }`}
          />
          {errors.monthlyRevenue && (
            <p className="text-red-500 text-sm mt-1">
              {errors.monthlyRevenue.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="monthlyExpenses"
            className="block text-Green font-medium mb-2"
          >
            Gastos mensuales
          </label>
          <input
            id="monthlyExpenses"
            type="number"
            step="0.01"
            {...register("monthlyExpenses", {
              required: "Los gastos mensuales son obligatorios",
              min: {
                value: 0,
                message: "Los gastos no pueden ser negativos",
              },
              max: {
                value: 999999999999,
                message: "Los gastos exceden el límite permitido",
              },
            })}
            min="0"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-Green ${
              errors.monthlyExpenses ? "border-red-500" : "text-Green"
            }`}
          />
          {errors.monthlyExpenses && (
            <p className="text-red-500 text-sm mt-1">
              {errors.monthlyExpenses.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="employeeCount"
            className="block text-Green font-medium mb-2"
          >
            Cantidad de empleados
          </label>
          <input
            id="employeeCount"
            type="number"
            {...register("employeeCount", {
              required: "La cantidad de empleados es obligatoria",
              min: {
                value: 1,
                message: "Debe tener al menos 1 empleado",
              },
              max: {
                value: 10000,
                message: "La cantidad de empleados no puede exceder 10,000",
              },
            })}
            min="1"
            max="10000"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-Green ${
              errors.employeeCount ? "border-red-500" : "text-Green"
            }`}
          />
          {errors.employeeCount && (
            <p className="text-red-500 text-sm mt-1">
              {errors.employeeCount.message}
            </p>
          )}
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
              <label
                htmlFor={`accountNumber-${index}`}
                className="block text-Green font-medium mb-2"
              >
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
              <label
                htmlFor={`cbu-${index}`}
                className="block text-Green font-medium mb-2"
              >
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
              <label
                htmlFor={`bank-${index}`}
                className="block text-Green font-medium mb-2"
              >
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

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            className="px-6 py-2 border-0 cursor-pointer rounded-lg text-Green font-medium hover:text-GreenLogo transition-colors"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || company}
            className="px-6 py-2 bg-DarkViolet cursor-pointer text-white rounded-lg font-medium hover:bg-Violet transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Guardando..." : "Confirmar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;
