import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, ArrowLeft, SquarePen } from 'lucide-react';

const CreditApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: formData
  });

  const onSubmit = (data) => {
    setFormData({ ...formData, ...data });
    console.log({ ...formData, ...data });
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return 'Información del crédito';
      case 2: return 'Información Financiera';
      case 3: return 'Resumen y confirmación';
      case 4: return 'Firma Digital';
      default: return '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl  text-Green font-bold mb-6">Formulario Para Solicitar Crédito</h1>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6  text-Green" />
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
              <label htmlFor="creditType" className="block text-Green font-medium mb-2">
                Tipo de Crédito *
              </label>
              <select
                id="creditType"
                {...register('creditType', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="" className='text-Green'>Seleccione una opción</option>
                <option value="Capital de Trabajo" className='text-Green'>Capital de Trabajo</option>
                <option value="Inversión" className='text-Green'>Inversión</option>
                <option value="Equipamiento" className='text-Green'>Equipamiento</option>
                <option value="Otro" className='text-Green'>Otro</option>
              </select>
              {errors.creditType && (
                <span className="text-red-500 text-sm">{errors.creditType.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="requestedAmount" className="block  text-Green font-medium mb-2">
                Monto solicitado *
              </label>
              <input
                id="requestedAmount"
                type="number"
                {...register('requestedAmount', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 border  text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.requestedAmount && (
                <span className="text-red-500 text-sm block">{errors.requestedAmount.message}</span>
              )}
              <p className="text-sm text-gray-600 mt-1">* Ejemplo: $20000000</p>
            </div>

            <div>
              <label htmlFor="financingTerm" className="block  text-Green font-medium mb-2">
                Plazo deseado de financiación *
              </label>{/*
              <input
                id="financingTerm"
                type="date"
                {...register('financingTerm', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 text-Green border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />*/}
              <select
                id="financingTerm"
                {...register('financingTerm', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 text-Green border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="" className='text-Green'>Seleccione una opción</option>
                <option value="3 meses" className='text-Green'>3 Meses</option>
                <option value="6 meses" className='text-Green'>6 Meses</option>
                <option value="12 meses" className='text-Green'>12 Meses</option>
                <option value="18 meses" className='text-Green'>18 Meses</option>
                <option value="24 meses" className='text-Green'>24 Meses</option>
              </select>
              {errors.financingTerm && (
                <span className="text-red-500 text-sm block">{errors.financingTerm.message}</span>
              )}
              <p className="text-sm text-gray-600 mt-1">* Ejemplo: 18 meses</p>
            </div>

            <div>
              <label htmlFor="creditPurpose" className="block  text-Green font-medium mb-2">
                Destino del crédito *
              </label>
              <select
                id="creditPurpose"
                {...register('creditPurpose', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 border  text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="">Seleccione una opción</option>
                <option value="Compra de insumos" className=' text-Green'>Compra de insumos</option>
                <option value="Pago a proveedores" className=' text-Green'>Pago a proveedores</option>
                <option value="Expansión" className=' text-Green'>Expansión</option>
                <option value="Otro" className=' text-Green'>Otro</option>
              </select>
              {errors.creditPurpose && (
                <span className="text-red-500 text-sm">{errors.creditPurpose.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="estimatedDate" className="block  text-Green font-medium mb-2">
                Fecha estimada en que se necesita el crédito (opcional)
              </label>
              <input
                id="estimatedDate"
                type="date"
                {...register('estimatedDate')}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {/*<select
                id="estimatedDate"
                {...register('estimatedDate')}
                className="w-full px-4 py-2 text-Green border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="" className='text-Green'>Seleccione una opción</option>
                <option value="3 meses" className='text-Green'>3 Meses</option>
                <option value="6 meses" className='text-Green'>6 Meses</option>
                <option value="12 meses" className='text-Green'>12 Meses</option>
                <option value="18 meses" className='text-Green'>18 Meses</option>
                <option value="24 meses" className='text-Green'>24 Meses</option>
              </select>*/}
              <p className="text-sm text-gray-600 mt-1">Ejemplo: DD/MM/AAAA</p>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div>
              <label htmlFor="monthlyRevenue" className="block  text-Green font-medium mb-2">
                Facturación mensual promedio *
              </label>
              <input
                id="monthlyRevenue"
                type="number"
                defaultValue={formData.monthlyRevenue || ''}
                {...register('monthlyRevenue', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.monthlyRevenue && (
                <span className="text-red-500 text-sm block">{errors.monthlyRevenue.message}</span>
              )}
              <p className="text-sm  text-Green mt-1">Ejemplo: $ 40000000</p>
            </div>

            <div>
              <label htmlFor="monthlyExpenses" className="block  text-Green font-medium mb-2">
                Gasto Mensual Promedio *
              </label>
              <input
                id="monthlyExpenses"
                type="number"
                defaultValue={formData.monthlyExpenses || ''}
                {...register('monthlyExpenses', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.monthlyExpenses && (
                <span className="text-red-500 text-sm block">{errors.monthlyExpenses.message}</span>
              )}
              <p className="text-sm text-gray-600 mt-1">Ejemplo: $ 40000000</p>
            </div>

            <div>
              <label htmlFor="documents" className="block  text-Green font-medium mb-2">
                Adjuntar Documentación * (Balance General, Estado de Resultados, DDJJ IVA o IIBB, etc.)
              </label>
              <input
                id="documents"
                type="file"
                accept=".pdf"
                {...register('documents', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.documents && (
                <span className="text-red-500 text-sm block">{errors.documents.message}</span>
              )}
              <p className="text-sm text-gray-600 mt-1">Formato PDF</p>
            </div>

            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
              Nota: la documentación respaldatoria es fundamental para evaluar tu solicitud. Cuantos más comprobantes proporciones más ágil será el proceso de análisis
            </p>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div>
              <label htmlFor="creditType" className="block text-Green font-medium mb-2">
                Tipo de crédito *
              </label>
              <select
                id="creditType"
                defaultValue={formData.creditType || ''}
                {...register('creditType', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="" className='text-Green'>Seleccione una opción</option>
                <option value="Capital de Trabajo" className='text-Green'>Capital de Trabajo</option>
                <option value="Inversión" className='text-Green'>Inversión</option>
                <option value="Equipamiento" className='text-Green'>Equipamiento</option>
                <option value="Otro" className='text-Green'>Otro</option>
              </select>
              {errors.creditType && (
                <span className="text-red-500 text-sm">{errors.creditType.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="requestedAmount" className="block text-Green font-medium mb-2">
                Monto solicitado *
              </label>
              <input
                id="requestedAmount"
                type="number"
                defaultValue={formData.requestedAmount || ''}
                {...register('requestedAmount', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.requestedAmount && (
                <span className="text-red-500 text-sm block">{errors.requestedAmount.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="financingTerm" className="block text-Green font-medium mb-2">
                Plazo deseado de financiación *
              </label>{/*
              <input
                id="financingTerm"
                type="date"
                defaultValue={formData.financingTerm || ''}
                {...register('financingTerm', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />*/}
              <select
                id="financingTerm"
                defaultValue={formData.financingTerm || ''}
                {...register('financingTerm', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 text-Green border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="" className='text-Green'>Seleccione una opción</option>
                <option value="3 meses" className='text-Green'>3 Meses</option>
                <option value="6 meses" className='text-Green'>6 Meses</option>
                <option value="12 meses" className='text-Green'>12 Meses</option>
                <option value="18 meses" className='text-Green'>18 Meses</option>
                <option value="24 meses" className='text-Green'>24 Meses</option>
              </select>
              {errors.financingTerm && (
                <span className="text-red-500 text-sm block">{errors.financingTerm.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="creditPurpose" className="block text-Green font-medium mb-2">
                Destino del crédito *
              </label>
              <input
                id="creditPurpose"
                type="text"
                defaultValue={formData.creditPurpose || ''}
                {...register('creditPurpose', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.creditPurpose && (
                <span className="text-red-500 text-sm">{errors.creditPurpose.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="estimatedDate" className="block text-Green font-medium mb-2">
                Fecha estimada en que necesita el crédito (opcional)
              </label>
              <input
                id="estimatedDate"
                type="date"
                defaultValue={formData.estimatedDate || ''}
                {...register('estimatedDate')}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {/*<select
                id="estimatedDate"
                defaultValue={formData.estimatedDate || ''}
                {...register('estimatedDate')}
                className="w-full px-4 py-2 text-Green border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="" className='text-Green'>Seleccione una opción</option>
                <option value="3 meses" className='text-Green'>3 Meses</option>
                <option value="6 meses" className='text-Green'>6 Meses</option>
                <option value="12 meses" className='text-Green'>12 Meses</option>
                <option value="18 meses" className='text-Green'>18 Meses</option>
                <option value="24 meses" className='text-Green'>24 Meses</option>
              </select>*/}
            </div>

            <div>
              <label htmlFor="monthlyRevenue" className="block text-Green font-medium mb-2">
                Facturación mensual promedio *
              </label>
              <input
                id="monthlyRevenue"
                type="number"
                defaultValue={formData.monthlyRevenue || ''}
                {...register('monthlyRevenue', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.monthlyRevenue && (
                <span className="text-red-500 text-sm block">{errors.monthlyRevenue.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="monthlyExpenses" className="block text-Green font-medium mb-2">
                Gasto mensual promedio *
              </label>
              <input
                id="monthlyExpenses"
                type="number"
                defaultValue={formData.monthlyExpenses || ''}
                {...register('monthlyExpenses', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.monthlyExpenses && (
                <span className="text-red-500 text-sm block">{errors.monthlyExpenses.message}</span>
              )}
            </div>

            <div>
              <label htmlFor="documents" className="block text-Green font-medium mb-2">
                Adjuntar documentación {!formData.documents && '*'} (Balance General, Estado de Resultados, DDJJ IVA o IIBB, etc.)
              </label>
              <input
                id="documents"
                type="file"
                accept=".pdf"
                {...register('documents', { 
                  required: !formData.documents ? 'Este campo es obligatorio' : false 
                })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.documents && (
                <span className="text-red-500 text-sm block">{errors.documents.message}</span>
              )}
              {formData.documents && formData.documents[0] && (
                <p className="text-sm text-gray-600 mt-1">Archivo cargado: {formData.documents[0].name}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <input
                  id="confirmInfo"
                  type="checkbox"
                  {...register('confirmInfo', { required: 'Debe confirmar que la información es correcta' })}
                  className="mt-1"
                />
                <label htmlFor="confirmInfo" className="text-sm">
                  Declaro que la información es correcta
                </label>
              </div>
              {errors.confirmInfo && (
                <span className="text-red-500 text-sm block">{errors.confirmInfo.message}</span>
              )}

              <div className="flex items-start gap-2">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  {...register('acceptTerms', { required: 'Debe aceptar los términos y condiciones' })}
                  className="mt-1"
                />
                <label htmlFor="acceptTerms" className="text-sm">
                  He leído y acepto los <a href="#" className="underline">Términos y condiciones</a>
                </label>
              </div>
              {errors.acceptTerms && (
                <span className="text-red-500 text-sm block">{errors.acceptTerms.message}</span>
              )}
            </div>
          </>
        )}

        {currentStep === 4 && (
          <>
            <div>
              <label htmlFor="digitalSignature" className="block text-Green font-medium mb-2">
                Adjuntar firma digital *
              </label>
              <input
                id="digitalSignature"
                type="file"
                accept=".pdf"
                {...register('digitalSignature', { required: 'Este campo es obligatorio' })}
                className="w-full px-4 py-2 border text-Green rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {errors.digitalSignature && (
                <span className="text-red-500 text-sm block">{errors.digitalSignature.message}</span>
              )}
              <p className="text-sm text-gray-600 mt-1">Formato PDF.</p>
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
            className="px-6 py-2 bg-Violet text-white rounded-lg font-medium hover:opacity-80 transition-opacity"
          >
            {currentStep === 3 ? 'Enviar Solicitud' : currentStep === 4 ? 'Confirmar y finalizar' : 'Guardar y Continuar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreditApplicationForm;
