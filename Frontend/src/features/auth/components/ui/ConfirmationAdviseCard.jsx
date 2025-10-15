import { BadgeCheck } from 'lucide-react'

const ConfrimationAdviseCard = () => {
    return (
        <>
            <div className='bg-LightGreen flex flex-col w-5xl py-28 px-6 justify-center items-center rounded-2xl'>
                < BadgeCheck className="w-20 h-20 text-white mb-4" />
                <h2 className='text-white text-3xl'>¡Te damos la bienvenida!</h2>
                <p className='text-white mt-8 text-xl'>Gracias por confirmar tu dirección de correo electrónico, tu cuenta ya se encuentra activa.</p>
            </div>
        </>
    )
}

export default ConfrimationAdviseCard