import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    setLoginError(true);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-DarkViolet rounded-sm shadow-md">
      <h2 className="text-3xl font-bold text-white mb-6">Ingresa a tu cuenta</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium text-white mb-2">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-800" />
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
              className="w-full pl-10 pr-4 py-2 bg-gray-200 border-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          {errors.email && (
            <span className="text-red-300 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block font-medium text-white mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Este campo es requerido'
              })}
              className="w-full px-4 py-2 border-1 bg-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="h-5 w-5 cursor-pointer text-gray-800" /> : <Eye className="h-5 w-5 cursor-pointer text-gray-800" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-300 text-sm">{errors.password.message}</span>
          )}
          {loginError && (
            <p className="text-red-300 text-sm mt-2">
              La dirección de email o la contraseña son incorrectas, por favor intente nuevamente
            </p>
          )}
        </div>

        <div>
          <a href="#" className="text-md font-extrabold text-white hover:underline">
            Olvidé mi contraseña
          </a>
        </div>

        <p className="text-sm text-white">
          ¿No tienes cuenta? <a href="#" className="underline font-bold hover:opacity-70">Registrarse</a>
        </p>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            className="px-6 py-2 border-0 cursor-pointer text-white font-medium hover:text-LightViolet transition-colors duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 cursor-pointer bg-LightGreen text-white rounded-sm font-medium hover:bg-GreenLogo transition-colors duration-300"
          >
            Ingresar
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
