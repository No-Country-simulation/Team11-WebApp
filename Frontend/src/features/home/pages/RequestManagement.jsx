import {CircleAlert, Circle} from 'lucide-react'
import Img1 from '../assets/foto-1.jpeg'

const RequestManagement = () => {

    {/* Esto es para hacer test con los elementos de abajo, no se olviden cambiarlo con la info del backend. */}

    const test = {
        approved: 10,
        rejected: 40,
        checking: 50,
        avgAmount: 15000000
    }

    return (
        <main className='flex w-max'>
            <section className='max-w-sm'>
                <picture className=''>
                    <img src={Img1} alt="" className='w-full' />
                </picture>
                <p className='flex justify-center items-center w-sm rounded-md mt-4 mb-2 text-Green font-bold gap-2 py-2 px-4 bg-white border-2 border-gray-200 shadow-gray-700 shadow-sm'>Solicitudes nuevas esta semana</p>
                <p className='flex justify-center items-center w-sm rounded-md mb-2  text-Green font-bold gap-2 py-2 px-4 bg-white border-2 border-gray-200 shadow-gray-700 shadow-sm'>Documentación pendiente de revisión</p>
            </section>

            <section className='flex flex-col py-2 px-6'>
                <h1 className='text-Green text-2xl font-extrabold'>¿Cómo funciona la pre-evaluación de riesgo?</h1>
                <p className='mb-4 mt-2'>La plataforma realiza una pre-evaluación automática de cada solicitud según el historial financiero y los indicadores de la pyme.</p>
                <p className='mb-4'>Estos indicadores sirven como guia inicial para el análisis del operador, pero no determinan la decisión final del crédito.</p>
                <p className='mb-4'>Los resultados se muestran con un semáforo de riesgo:</p>

                <article className='flex justify-start gap-2'>
                    <Circle className='text-green-700 fill-green-700 h-5 w-5'/>
                    <span className='text-green-700 font-bold'>Bajo (0%-40%)</span>
                </article>
                    <p className='self-start ml-6 mt-2'>Perfil confiable, sin incidencias detectadas. <br />
                    Historial sólido. Documentación completa.</p>

                <article className='flex justify-start gap-2'>
                    <Circle className='text-amber-700 fill-amber-700 h-5 w-5' />
                    <span className='text-amber-700 font-bold'>Medio (41%-70%)</span>
                </article>
                    <p className='self-start ml-6 mt-2'>Se recomienda revisión manual de documentación. <br />
                    Historial regular. Documentación parcial.</p>

                <article className='flex justify-start gap-2'>
                    <Circle className='text-DarkRed fill-DarkRed h-5 w-5' />
                    <span className='text-DarkRed font-bold'>Alto (71%-100%)</span>
                </article>
                    <p className='self-start ml-6 mt-2'>Riesgo elevado, posible rechazo o revisión detallada. <br />
                    Deuda previa, Ingresos inconsistentes. Documentación insuficiente.</p>

                <h2 className='self-start ml-6 mt-6 text-Green font-bold text-2xl'>Resumen de tu actividad</h2>
                <p className='self-start ml-6 mt-4'>Gestión de solicitudes del mes</p>

                <article className='ml-6 mt-4 grid grid-cols-2 gap-4 w-max'>
                    <div className='flex gap-6'>
                        <CircleAlert className='text-green-700'/>
                        <div className='flex flex-col'>
                            <span className='text-green-700 font-bold'>Aprobadas</span>
                            <p>{test.approved} solicitudes</p>
                        </div>
                    </div>

                    <div className='flex gap-6'>
                        <CircleAlert className='text-DarkRed h-6 w-6' />
                        <div className='flex flex-col'>
                            <span className='text-DarkRed font-bold'>Rechazadas</span>
                            <p>{test.rejected} solicitudes</p>
                        </div>
                    </div>

                    <div className='flex gap-6'>
                        <CircleAlert className='text-amber-700 h-6 w-6' />
                        <div className='flex flex-col'>
                            <span className='text-amber-700 font-bold'>En revisión</span>
                            <p>{test.checking} solicitudes</p>
                        </div>
                    </div>

                    <div className='flex gap-6'>
                        <CircleAlert className='text-Violet h-6 w-6' />
                        <div className='flex flex-col'>
                            <span className='text-Violet font-bold'>Promedio montos <br />solicitado</span>
                            <p>$ {test.avgAmount}</p>
                        </div>
                    </div>
                </article>

            </section>
        </main>
    );
};


export default RequestManagement
