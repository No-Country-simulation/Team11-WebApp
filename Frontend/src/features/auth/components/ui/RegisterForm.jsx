import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const password = watch('password');

  return (
    <div className="max-w-2xl mx-auto p-6 bg-OffGreen rounded-sm shadow-md">
      <h2 className="text-3xl font-bold text-white mb-6">Crea tu cuenta</h2>

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
          />
          {errors.fullName && (
            <span className="text-red-500 text-sm">{errors.fullName.message}</span>
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
          />
          {errors.dni && (
            <span className="text-red-500 text-sm">{errors.dni.message}</span>
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
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
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
          />
          {errors.repeatEmail && (
            <span className="text-red-500 text-sm">{errors.repeatEmail.message}</span>
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
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
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
            />
            <button
              type="button"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showRepeatPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.repeatPassword && (
            <span className="text-red-500 text-sm">{errors.repeatPassword.message}</span>
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
          />
          <label htmlFor="termsAccepted " className="text-sm text-white">
            He leído y acepto los <a href="#" className="underline">Términos y condiciones</a>
          </label>
        </div>
        {errors.termsAccepted && (
          <span className="text-red-500 text-sm block">{errors.termsAccepted.message}</span>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            className="px-6 py-2 border-0 rounded-lg text-white cursor-pointer font-medium hover:text-Violet transition-colors duration-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-Violet text-white cursor-pointer rounded-sm font-medium hover:bg-DarkViolet transition-colors duration-400"
          >
            Crear Cuenta
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
