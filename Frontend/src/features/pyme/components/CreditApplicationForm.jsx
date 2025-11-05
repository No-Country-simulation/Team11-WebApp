import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FileText, ArrowLeft, SquarePen, Trash2, X } from "lucide-react";
import {
  createCreditApplication,
  updateCreditApplication,
  submitCreditApplication,
  attachDigitalSignature,
} from "../services/credit-application";
import {
  uploadDocuments,
  getApplicationDocuments,
  deleteDocument,
} from "../services/documents";
import { toast } from "sonner";
import {
  getDocumentTypeFromFile,
  getDocumentTypeLabel,
} from "../helpers/DocumentType";
import { extractApiErrorMessage } from "../../../share/utils/httpError";
import { useCreditApplicationsStore } from "../store/useCreditApplicationsStore";

const CreditApplicationForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;
  const { applications } = useCreditApplicationsStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [applicationId, setApplicationId] = useState(editId || null);
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [documentsToDelete, setDocumentsToDelete] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    reset,
    setValue,
  } = useForm({
    defaultValues: formData,
  });

  // Función para cargar documentos existentes
  const loadExistingDocuments = useCallback(async (appId) => {
    if (!appId) return;

    try {
      setLoadingDocuments(true);
      const docs = await getApplicationDocuments(appId);
      setExistingDocuments(docs || []);
    } catch (error) {
      console.error("Error al cargar documentos:", error);
      // No mostramos error si no hay documentos, es normal
    } finally {
      setLoadingDocuments(false);
    }
  }, []);

  // Función para eliminar un documento
  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este documento?")) {
      return;
    }

    try {
      await deleteDocument(documentId);
      setExistingDocuments(
        existingDocuments.filter((doc) => doc.id !== documentId)
      );
      setDocumentsToDelete([...documentsToDelete, documentId]);
      toast.success("Documento eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      toast.error("Error al eliminar el documento");
    }
  };

  // Cargar datos cuando está en modo edición usando los datos del store
  useEffect(() => {
    if (!isEditMode || !editId) return;

    // Buscar la aplicación en el store
    const application = applications.find((app) => app.id === editId);

    if (!application) {
      toast.error("No se encontró la solicitud para editar");
      navigate("/panel/mis-solicitudes/guardadas");
      return;
    }

    // Mapear los datos del store al formato del formulario
    const formDataToLoad = {
      creditType: application.creditType,
      requestedAmount: application.requestedAmount,
      termMonths: application.termMonths?.toString(),
      description: application.description,
      monthlyRevenue: application.monthlyRevenue,
      monthlyExpenses: application.monthlyExpenses,
      companyYears: application.companyYears,
    };

    // Establecer valores en el formulario
    Object.keys(formDataToLoad).forEach((key) => {
      if (formDataToLoad[key] !== undefined && formDataToLoad[key] !== null) {
        setValue(key, formDataToLoad[key]);
      }
    });

    setFormData(formDataToLoad);
    setApplicationId(editId);

    // Cargar documentos existentes
    loadExistingDocuments(editId);
  }, [
    isEditMode,
    editId,
    applications,
    setValue,
    navigate,
    loadExistingDocuments,
  ]);

  // Paso 3: Guardar solicitud (crear/actualizar y subir documentos)
  const handleSaveApplication = async (applicationData) => {
    try {
      setIsSubmitting(true);

      // Preparar datos para el backend según el DTO
      const submitData = {
        creditType: applicationData.creditType,
        requestedAmount: parseFloat(applicationData.requestedAmount),
        termMonths: parseInt(applicationData.termMonths),
        description: applicationData.description || "Solicitud de crédito",
        monthlyRevenue: parseFloat(applicationData.monthlyRevenue),
        monthlyExpenses: parseFloat(applicationData.monthlyExpenses),
        companyYears: parseInt(applicationData.companyYears),
        applicationCheckbox: true,
      };

      let newApplicationId = applicationId;

      if (isEditMode && applicationId) {
        // Modo edición: actualizar la solicitud existente
        toast.loading("Actualizando solicitud de crédito...");
        await updateCreditApplication(applicationId, submitData);
        toast.dismiss();
        toast.success("Solicitud de crédito actualizada");
      } else {
        // Modo creación: crear nueva solicitud
        toast.loading("Creando solicitud de crédito...");
        const response = await createCreditApplication(submitData);
        toast.dismiss();
        toast.success("Solicitud de crédito creada");

        if (response.id) {
          newApplicationId = response.id;
          setApplicationId(newApplicationId);
        }
      }

      if (newApplicationId) {
        // 2. Subir documentos si existen (solo en modo creación o si hay nuevos documentos)
        if (applicationData.documents && applicationData.documents.length > 0) {
          try {
            toast.loading("Subiendo documentos...");

            // Convertir FileList a Array y mapear tipos
            const filesArray = Array.from(applicationData.documents);
            const documentTypes = filesArray.map((file) =>
              getDocumentTypeFromFile(file)
            );

            await uploadDocuments(newApplicationId, filesArray, documentTypes);

            toast.dismiss();
            toast.success(
              `✅ ${filesArray.length} documento(s) subido(s) exitosamente`
            );

            // Recargar documentos si está en modo edición
            if (isEditMode && newApplicationId) {
              await loadExistingDocuments(newApplicationId);
            }
          } catch (uploadError) {
            console.error("Error al subir documentos:", uploadError);
            toast.error(
              "⚠️ Solicitud guardada pero hubo un error al subir algunos documentos"
            );
            // Continuamos aunque falle la subida de documentos
          }
        }

        // Avanzar al paso de firma digital
        setCurrentStep(4);
        setTimer(120);
      }
    } catch (error) {
      console.error("Error al guardar la solicitud:", error);
      const errorText = extractApiErrorMessage(
        error,
        isEditMode
          ? "Error al actualizar la solicitud"
          : "Error al guardar la solicitud"
      );

      toast.dismiss();
      toast.error(errorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Paso 4: Firmar y enviar solicitud
  const handleSignAndSubmit = async (applicationData) => {
    try {
      setIsSubmitting(true);

      if (!applicationId) {
        toast.error("No se encontró la solicitud a firmar");
        return;
      }

      // 1. Adjuntar firma digital y consentimiento
      try {
        toast.loading("Procesando firma digital...");

        // Crear payload para la firma digital
        const signaturePayload = {
          consent: true, // Siempre true según el DTO
          signatureDocument: `digital-signature-${applicationId}-${Date.now()}`, // Mock temporal
        };

        await attachDigitalSignature(applicationId, signaturePayload);

        toast.dismiss();
        toast.success("✅ Firma digital procesada exitosamente");
      } catch (signatureError) {
        console.error("Error al procesar firma digital:", signatureError);
        toast.error("Error al procesar la firma digital");
        return; // No continuamos si falla la firma digital
      }

      // 2. Enviar la aplicación (cambiar estado a PENDING)
      toast.loading("Enviando solicitud...");
      await submitCreditApplication(applicationId);
      toast.dismiss();
      toast.success("Solicitud de crédito enviada exitosamente");
      
      // Resetear el formulario y redirigir
      reset();
      setFormData({});
      setApplicationId(null);
      setCurrentStep(1);
      navigate("/panel/mis-solicitudes/pendientes");
    } catch (error) {
      console.error("Error al firmar y enviar la solicitud:", error);
      const errorText = extractApiErrorMessage(
        error,
        "Error al enviar la solicitud"
      );

      toast.dismiss();
      toast.error(errorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Paso 3: Guardar solicitud (crear + documentos)
    if (currentStep === 3) {
      await handleSaveApplication(updatedData);
      return;
    }

    // Paso 4: Firmar y enviar (solo firma + envío)
    if (currentStep === 4) {
      if (!updatedData.digitalSignature) {
        setError("digitalSignature", {
          type: "manual",
          message: "Debe ingresar su contraseña de firma digital",
        });
        return;
      }

      await handleSignAndSubmit(updatedData);
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
        {isEditMode
          ? "Editar Solicitud de Crédito"
          : "Formulario Para Solicitar Crédito"}
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
                Adjuntar Documentación {isEditMode ? "Adicional" : ""}{" "}
                (Opcional)
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

            {/* Mostrar documentos existentes en modo edición */}
            {isEditMode && (
              <div className="mt-4">
                <label className="block text-Green font-medium mb-2">
                  Documentos existentes
                </label>
                {loadingDocuments ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-Green"></div>
                  </div>
                ) : existingDocuments.length > 0 ? (
                  <div className="space-y-2">
                    {existingDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="h-5 w-5 text-gray-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {doc.fileName ||
                                doc.name ||
                                `Documento ${doc.id}`}
                            </p>
                            {doc.documentType && (
                              <p className="text-xs text-gray-500">
                                Tipo: {getDocumentTypeLabel(doc.documentType)}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar documento"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No hay documentos adjuntos
                  </p>
                )}
              </div>
            )}

            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
              Nota: la información financiera y documentación respaldatoria son
              fundamentales para evaluar tu solicitud. Cuantos más comprobantes
              proporciones más ágil será el proceso de análisis.
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

              {/* Mostrar documentos existentes (si está en modo edición) */}
              {isEditMode && existingDocuments.length > 0 && (
                <div className="col-span-2">
                  <label className="block text-Green font-medium mb-2">
                    Documentos existentes
                  </label>
                  <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 space-y-1">
                    {existingDocuments.map((doc) => (
                      <p key={doc.id} className="text-sm text-gray-600">
                        📎 {doc.fileName || doc.name || `Documento ${doc.id}`}
                        {doc.documentType &&
                          ` (${getDocumentTypeLabel(doc.documentType)})`}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Mostrar documentos nuevos a subir */}
              {formData.documents && formData.documents.length > 0 && (
                <div className="col-span-2">
                  <label className="block text-Green font-medium mb-2">
                    {isEditMode
                      ? "Nuevos documentos a adjuntar"
                      : "Documentos adjuntos"}
                  </label>
                  <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {Array.from(formData.documents).map((file, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        📎 {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                        MB)
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
                Ingrese su Contraseña para Firma Digital *
              </label>
              <input
                id="digitalSignature"
                type="password"
                {...register("digitalSignature", {
                  required: "Este campo es obligatorio",
                })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Ingrese su contraseña para autorizar la firma digital"
              />
              {errors.digitalSignature && (
                <span className="text-red-500 text-sm block">
                  {errors.digitalSignature.message}
                </span>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Al ingresar su contraseña, autoriza la firma digital de su
                solicitud. Tiene {timer} segundos para completar este paso.
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
              ? "Procesando..."
              : currentStep === 3
              ? isEditMode
                ? "Actualizar Solicitud"
                : "Guardar Solicitud"
              : currentStep === 4
              ? "Firmar y Enviar Solicitud"
              : "Guardar y Continuar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreditApplicationForm;
