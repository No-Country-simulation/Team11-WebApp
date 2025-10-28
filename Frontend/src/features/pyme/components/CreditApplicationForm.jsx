import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FileText, ArrowLeft, SquarePen } from "lucide-react";
import {
  createCreditApplication,
  submitCreditApplication,
} from "../services/credit-application";
import { uploadDocuments } from "../services/documents";
import { toast } from "sonner";
import { getDocumentTypeFromFile } from "../helpers/DocumentType";

const CreditApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm({
    defaultValues: formData,
  });

  const onSubmit = async (data) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(4);
      setTimer(120);
      return;
    }

    // === Paso final (firma digital) ===
    if (!updatedData.digitalSignature) {
      setError("digitalSignature", {
        type: "manual",
        message: "Debe ingresar su contraseña de firma digital",
      });
      return;
    }

    // Enviar solicitud al backend
    await handleSubmitApplication(updatedData);
  };

  const handleSubmitApplication = async (applicationData) => {
    try {
      setIsSubmitting(true);

      // Preparar datos para el backend según el DTO
      const submitData = {
        creditType: applicationData.creditType,
        requestedAmount: parseFloat(applicationData.requestedAmount),
        termMonths: parseInt(applicationData.termMonths),
        description:
          applicationData.description ||
          `Solicitud de crédito para ${applicationData.creditPurpose}`,
        monthlyRevenue: parseFloat(applicationData.monthlyRevenue),
        monthlyExpenses: parseFloat(applicationData.monthlyExpenses),
        companyYears: parseInt(applicationData.companyYears),
        applicationCheckbox: true,
      };

      // 1. Crear la aplicación de crédito
      toast.loading("Creando solicitud de crédito...");
      const response = await createCreditApplication(submitData);
      toast.dismiss();
      toast.success("✅ Solicitud de crédito creada exitosamente");

      if (response.id) {
        const applicationId = response.id;

        // 2. Subir documentos si existen
        if (applicationData.documents && applicationData.documents.length > 0) {
          try {
            toast.loading("Subiendo documentos...");
          
            // Convertir FileList a Array y mapear tipos
            const filesArray = Array.from(applicationData.documents);
            const documentTypes = filesArray.map(file => 
              getDocumentTypeFromFile(file)
            );
  
            console.log("Subiendo documentos:", {
              files: filesArray.map(f => f.name),
              types: documentTypes
            });
  
            await uploadDocuments(applicationId, filesArray, documentTypes);
            
            toast.dismiss();
            toast.success(`✅ ${filesArray.length} documento(s) subido(s) exitosamente`);
          } catch (uploadError) {
            console.error("Error al subir documentos:", uploadError);
            toast.error("⚠️ Solicitud creada pero hubo un error al subir algunos documentos");
            // Continuamos aunque falle la subida de documentos
          }
        }

        // 3. Enviar la aplicación (cambiar estado a PENDING)
        toast.loading("Enviando solicitud...");
        await submitCreditApplication(applicationId);
        toast.dismiss();
        toast.success("🎉 Solicitud de crédito enviada exitosamente");

        console.log("✅ Solicitud completa enviada:", response);

        // Resetear el formulario
        setFormData({});
        setCurrentStep(1);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.dismiss();
      toast.error(
        "❌ Error al enviar la solicitud. Por favor, intente nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Información del crédito";
      case 2:
        return "Información Financiera";
      case 3:
        return "Resumen y confirmación";
      case 4:
        return "Firma Digital";
      default:
        return "";
    }
  };

  useEffect(() => {
    let countdown;

    if (currentStep === 4 && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (currentStep === 4 && timer === 0) {
      setCurrentStep(3);
    }

    return () => clearInterval(countdown);
  }, [currentStep, timer]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl text-Green font-bold mb-6">
        Formulario Para Solicitar Crédito
      </h1>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-Green" />
          <h2 className="text-xl text-Green font-semibold">
            Paso {currentStep} de 4: {getStepTitle()}
          </h2>
        </div>
        {currentStep === 3 && <SquarePen className="h-6 w-6 text-Green" />}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <>
            <div>
              <label
                htmlFor="creditType"
                className="block text-Green font-medium mb-2"
              >
                Tipo de Crédito *
              </label>
              <select
                id="creditType"
                {...register("creditType", {
                  required: "Este campo es obligatorio",
                })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="" className="text-Green">
                  Seleccione una opción
                </option>
                <option value="WORKING_CAPITAL" className="text-Green">
                  Capital de Trabajo
                </option>
                <option value="INVESTMENT" className="text-Green">
                  Inversión
                </option>
                <option value="EQUIPMENT" className="text-Green">
                  Equipamiento
                </option>
                <option value="OTHER" className="text-Green">
                  Otro
                </option>
              </select>
              {errors.creditType && (
                <span className="text-red-500 text-sm">
                  {errors.creditType.message}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="requestedAmount"
                className="block text-Green font-medium mb-2"
              >
                Monto solicitado *
              </label>
              <input
                id="requestedAmount"
                type="number"
                {...register("requestedAmount", {
                  required: "Este campo es obligatorio",
                  min: { value: 1, message: "El monto debe ser mayor a 0" },
                })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.requestedAmount && (
                <span className="text-red-500 text-sm block">
                  {errors.requestedAmount.message}
                </span>
              )}
              <p className="text-sm text-gray-600 mt-1">* Ejemplo: $20000000</p>
            </div>

            <div>
              <label
                htmlFor="termMonths"
                className="block text-Green font-medium mb-2"
              >
                Plazo en meses *
              </label>
              <select
                id="termMonths"
                {...register("termMonths", {
                  required: "Este campo es obligatorio",
                  validate: (value) =>
                    value > 0 || "El plazo debe ser mayor a 0 meses",
                })}
                className="w-full px-4 py-2 text-Green border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="" className="text-Green">
                  Seleccione una opción
                </option>
                <option value="3" className="text-Green">
                  3 Meses
                </option>
                <option value="6" className="text-Green">
                  6 Meses
                </option>
                <option value="12" className="text-Green">
                  12 Meses
                </option>
                <option value="18" className="text-Green">
                  18 Meses
                </option>
                <option value="24" className="text-Green">
                  24 Meses
                </option>
                <option value="36" className="text-Green">
                  36 Meses
                </option>
              </select>
              {errors.termMonths && (
                <span className="text-red-500 text-sm block">
                  {errors.termMonths.message}
                </span>
              )}
              <p className="text-sm text-gray-600 mt-1">* Ejemplo: 18 meses</p>
            </div>

            <div>
              <label
                htmlFor="creditPurpose"
                className="block text-Green font-medium mb-2"
              >
                Destino del crédito *
              </label>
              <select
                id="creditPurpose"
                {...register("creditPurpose", {
                  required: "Este campo es obligatorio",
                })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="">Seleccione una opción</option>
                <option value="Compra de insumos" className="text-Green">
                  Compra de insumos
                </option>
                <option value="Pago a proveedores" className="text-Green">
                  Pago a proveedores
                </option>
                <option value="Expansión" className="text-Green">
                  Expansión
                </option>
                <option value="Otro" className="text-Green">
                  Otro
                </option>
              </select>
              {errors.creditPurpose && (
                <span className="text-red-500 text-sm">
                  {errors.creditPurpose.message}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-Green font-medium mb-2"
              >
                Descripción adicional *
              </label>
              <textarea
                id="description"
                rows={3}
                {...register("description", {
                  required: "Este campo es obligatorio",
                  maxLength: {
                    value: 500,
                    message: "La descripción no puede exceder 500 caracteres",
                  },
                })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Describa en detalle el propósito del crédito..."
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Máximo 500 caracteres
              </p>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div>
              <label
                htmlFor="monthlyRevenue"
                className="block text-Green font-medium mb-2"
              >
                Facturación mensual promedio *
              </label>
              <input
                id="monthlyRevenue"
                type="number"
                step="0.01"
                {...register("monthlyRevenue", {
                  required: "Este campo es obligatorio",
                  min: {
                    value: 0,
                    message: "Los ingresos no pueden ser negativos",
                  },
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.monthlyRevenue && (
                <span className="text-red-500 text-sm block">
                  {errors.monthlyRevenue.message}
                </span>
              )}
              <p className="text-sm text-Green mt-1">Ejemplo: $ 40000000</p>
            </div>

            <div>
              <label
                htmlFor="monthlyExpenses"
                className="block text-Green font-medium mb-2"
              >
                Gasto Mensual Promedio *
              </label>
              <input
                id="monthlyExpenses"
                type="number"
                step="0.01"
                {...register("monthlyExpenses", {
                  required: "Este campo es obligatorio",
                  min: {
                    value: 0,
                    message: "Los gastos no pueden ser negativos",
                  },
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.monthlyExpenses && (
                <span className="text-red-500 text-sm block">
                  {errors.monthlyExpenses.message}
                </span>
              )}
              <p className="text-sm text-gray-600 mt-1">Ejemplo: $ 40000000</p>
            </div>

            <div>
              <label
                htmlFor="companyYears"
                className="block text-Green font-medium mb-2"
              >
                Años de operación de la empresa *
              </label>
              <input
                id="companyYears"
                type="number"
                {...register("companyYears", {
                  required: "Este campo es obligatorio",
                  min: {
                    value: 0,
                    message: "Los años no pueden ser negativos",
                  },
                  max: {
                    value: 200,
                    message: "Los años no pueden exceder 200",
                  },
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.companyYears && (
                <span className="text-red-500 text-sm block">
                  {errors.companyYears.message}
                </span>
              )}
              <p className="text-sm text-gray-600 mt-1">Ejemplo: 5 años</p>
            </div>

            {/* Campo de documentación */}
            <div>
              <label
                htmlFor="documents"
                className="block text-Green font-medium mb-2"
              >
                Adjuntar Documentación (Opcional)
              </label>
              <input
                id="documents"
                type="file"
                accept=".pdf"
                multiple
                {...register("documents")}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <p className="text-sm text-gray-600 mt-1">
                Formatos aceptados: .PDF 
              </p>             
            </div>

            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
              Nota: la información financiera y documentación respaldatoria son fundamentales para evaluar tu solicitud. Cuantos más comprobantes proporciones más ágil será el proceso de análisis.
            </p>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-Green font-medium mb-2">
                  Tipo de crédito
                </label>
                <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  {formData.creditType === "WORKING_CAPITAL"
                    ? "Capital de Trabajo"
                    : formData.creditType === "INVESTMENT"
                    ? "Inversión"
                    : formData.creditType === "EQUIPMENT"
                    ? "Equipamiento"
                    : formData.creditType === "OTHER"
                    ? "Otro"
                    : formData.creditType}
                </p>
              </div>

              <div>
                <label className="block text-Green font-medium mb-2">
                  Monto solicitado
                </label>
                <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  ${formData.requestedAmount?.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-Green font-medium mb-2">
                  Plazo en meses
                </label>
                <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  {formData.termMonths} meses
                </p>
              </div>

              <div>
                <label className="block text-Green font-medium mb-2">
                  Destino del crédito
                </label>
                <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  {formData.creditPurpose}
                </p>
              </div>

              <div>
                <label className="block text-Green font-medium mb-2">
                  Facturación mensual
                </label>
                <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  ${formData.monthlyRevenue?.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-Green font-medium mb-2">
                  Gastos mensuales
                </label>
                <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  ${formData.monthlyExpenses?.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-Green font-medium mb-2">
                  Años de operación
                </label>
                <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  {formData.companyYears} años
                </p>
              </div>

              <div className="col-span-2">
                <label className="block text-Green font-medium mb-2">
                  Descripción
                </label>
                <p className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[60px]">
                  {formData.description}
                </p>
              </div>

              {/* Mostrar documentos cargados */}
              {formData.documents && formData.documents.length > 0 && (
                <div className="col-span-2">
                  <label className="block text-Green font-medium mb-2">
                    Documentos adjuntos
                  </label>
                  <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {Array.from(formData.documents).map((file, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        📎 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <input
                  id="confirmInfo"
                  type="checkbox"
                  {...register("confirmInfo", {
                    required: "Debe confirmar que la información es correcta",
                  })}
                  className="mt-1"
                />
                <label htmlFor="confirmInfo" className="text-sm">
                  Declaro que la información es correcta
                </label>
              </div>
              {errors.confirmInfo && (
                <span className="text-red-500 text-sm block">
                  {errors.confirmInfo.message}
                </span>
              )}

              <div className="flex items-start gap-2">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  {...register("acceptTerms", {
                    required: "Debe aceptar los términos y condiciones",
                  })}
                  className="mt-1"
                />
                <label htmlFor="acceptTerms" className="text-sm">
                  He leído y acepto los{" "}
                  <a href="#" className="underline">
                    Términos y condiciones
                  </a>
                </label>
              </div>
              {errors.acceptTerms && (
                <span className="text-red-500 text-sm block">
                  {errors.acceptTerms.message}
                </span>
              )}
            </div>
          </>
        )}

        {currentStep === 4 && (
          <>
            <div>
              <label
                htmlFor="digitalSignature"
                className="block text-Green font-medium mb-2"
              >
                Ingrese su Contraseña *
              </label>
              <input
                id="digitalSignature"
                type="password"
                {...register("digitalSignature", {
                  required: "Este campo es obligatorio",
                })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.digitalSignature && (
                <span className="text-red-500 text-sm block">
                  {errors.digitalSignature.message}
                </span>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Ingrese su contraseña (Tiene {timer} segundos).
              </p>
            </div>
          </>
        )}

        <div className="flex justify-between pt-4">
          {currentStep === 1 ? (
            <button
              type="button"
              className="px-6 py-2 border-0 text-Green rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 border-0 rounded-lg text-Green font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5 text-Green" />
              Atrás
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-Violet text-white rounded-lg font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {isSubmitting
              ? "Enviando..."
              : currentStep === 3
              ? "Guardar Solicitud"
              : currentStep === 4
              ? "Enviar Solicitud"
              : "Guardar y Continuar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreditApplicationForm;