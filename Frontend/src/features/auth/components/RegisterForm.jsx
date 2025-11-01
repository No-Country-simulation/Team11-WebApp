import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { registerClient, registerOperator } from '../services/register';
import { extractApiErrorMessage } from '../../../share/utils/httpError';


const RegisterForm = ( {onClose} ) => {
  const location = useLocation();
  const isOperatorRoute = location.pathname.startsWith('/operador');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitStatus(null);

    try {
      // Preparar los datos para enviar al backend
      const userData = {
        name: data.fullName.split(' ')[0], // Primer nombre
        lastName: data.fullName.split(' ').slice(1).join(' '), // Apellidos
        email: data.email,
        password: data.password, // El backend se encargará del hash
        dni: data.dni,
      };

      const result = isOperatorRoute
        ? await registerOperator(userData)
        : await registerClient(userData);
      toast.success(result?.message || 'Usuario registrado correctamente');
      
      setSubmitStatus('success');
      reset(); // Limpiar el formulario      
      onClose && onClose();

    } catch (error) {
      console.error('Error:', error);
      const errorText = extractApiErrorMessage(error, 'Error al registrar usuario');
      toast.error(errorText);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch('password');

  return (
    <div className="max-w-2xl mx-auto p-6 bg-Green rounded-sm shadow-md">
      <h2 className="text-3xl font-bold text-white mb-6">Crea tu cuenta</h2>

      {/* Mensaje de éxito */}
      {submitStatus === 'success' && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span>¡Cuenta creada exitosamente! Redirigiendo...</span>
        </div>
      )}

      {/* Mensaje de error */}
      {submitStatus === 'error' && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Error al crear la cuenta. Por favor intenta nuevamente.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-white font-medium mb-2">
            Nombre y Apellido
          </label>
          <input
            id="fullName"
            type="text"
            {...register('fullName', { required: 'Este campo es requerido' })}
            className="w-full px-4 py-2 border-1 bg-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={isLoading}
          />
          {errors.fullName && (
            <span className="text-red-300 text-sm">{errors.fullName.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="dni" className="block text-white font-medium mb-2">
            DNI
          </label>
          <input
            id="dni"
            type="text"
            {...register('dni', {
              required: 'Este campo es requerido',
              pattern: {
                value: /^[0-9]+$/,
                message: 'Solo se permiten números'
              }
            })}
            className="w-full px-4 py-2 border-1 bg-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={isLoading}
          />
          {errors.dni && (
            <span className="text-red-300 text-sm">{errors.dni.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-white font-medium mb-2">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Este campo es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo electrónico inválido'
              }
            })}
            className="w-full px-4 py-2 border-1 bg-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={isLoading}
          />
          {errors.email && (
            <span className="text-red-300 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="repeatEmail" className="block text-white font-medium mb-2">
            Repetir Correo Electrónico
          </label>
          <input
            id="repeatEmail"
            type="email"
            {...register('repeatEmail', {
              required: 'Este campo es requerido',
              validate: (value) =>
                value === watch('email') || 'Los correos electrónicos no coinciden'
            })}
            className="w-full px-4 py-2 border-1 bg-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={isLoading}
          />
          {errors.repeatEmail && (
            <span className="text-red-300 text-sm">{errors.repeatEmail.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-white font-medium mb-2">
            Ingresar Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Este campo es requerido',
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'La contraseña no cumple con los requisitos'
                }
              })}
              className="w-full px-4 py-2 border-1 bg-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-300 text-sm">{errors.password.message}</span>
          )}
        </div>

        <p className="text-sm text-white">
          La Contraseña debe contener 8 caracteres, 1 mayúscula, 1 minúscula, 1 carácter numérico y un símbolo.
        </p>

        <div>
          <label htmlFor="repeatPassword" className="block text-white font-medium mb-2">
            Repetir Contraseña
          </label>
          <div className="relative">
            <input
              id="repeatPassword"
              type={showRepeatPassword ? 'text' : 'password'}
              {...register('repeatPassword', {
                required: 'Este campo es requerido',
                validate: (value) =>
                  value === password || 'Las contraseñas no coinciden'
              })}
              className="w-full px-4 py-2 border-1 bg-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              disabled={isLoading}
            >
              {showRepeatPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.repeatPassword && (
            <span className="text-red-300 text-sm">{errors.repeatPassword.message}</span>
          )}
        </div>

        <hr className="my-6 bg-white border-white" />

        <div className="flex items-center">
          <input
            id="termsAccepted"
            type="checkbox"
            {...register('termsAccepted', {
              required: 'Debes aceptar los términos y condiciones'
            })}
            className="h-4 w-4 mr-2 border-2 border-black"
            disabled={isLoading}
          />
          <label htmlFor="termsAccepted" className="text-sm text-white">
            He leído y acepto los <a href="#" className="underline">Términos y condiciones</a>
          </label>
        </div>
        {errors.termsAccepted && (
          <span className="text-red-300 text-sm block">{errors.termsAccepted.message}</span>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border-0 rounded-lg text-white cursor-pointer font-medium hover:text-Violet transition-colors duration-400"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-Violet text-white cursor-pointer rounded-sm font-medium hover:bg-purple-800 transition-colors duration-400"
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
