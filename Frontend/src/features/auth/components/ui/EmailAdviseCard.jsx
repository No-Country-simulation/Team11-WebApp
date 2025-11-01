import { Mail } from 'lucide-react'

const EmailAdviseCard = () => {
    return (
        <>
            <div className='bg-Violet flex flex-col w-5xl py-28 px-6 justify-center items-center rounded-2xl'>
                < Mail className="w-20 h-20 text-white mb-4" />
                <h2 className='text-white text-3xl'>Por favor confirma tu dirección de correo electrónico</h2>
                <p className='text-white mt-8 text-xl'>Hacé click en el enlace que enviamos por mail.</p>
                <p className='text-white'>Sí no aparece en tu bandeja de entrada, revisa en tu bandeja de correo no deseado o spam.</p>
            </div>
        </>
    )
}

export default EmailAdviseCard