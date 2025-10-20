import {SquareCheckBig, MousePointer2 } from 'lucide-react'
import img1 from '../../assets/foto.png' 

const SideCardProfile = () => {

    return (
        <>
            <div className='flex flex-col gap-4'>
                <div className='flex justify-center w-sm flex-col bg-Violet p-1'>
                    <picture className=''>
                        <img src={img1} alt="Imagen de dos personas viendo una pc." className='w-full' />
                    </picture>
                    <div className=''>
                        <section className='flex items-center w-full gap-2  py-2 px-4 bg-white border-1 border-Violet text-start'>
                            <SquareCheckBig className='h-5 w-5 text-Green' />
                            <p className='text-Green'> ¡Ya Creaste tu cuenta!</p>
                        </section>
                        <section className='flex items-center w-full gap-2 py-2 px-4 bg-white border-1 border-Violet '>
                            <MousePointer2 className='h-5 w-5 text-Green' />
                            <p className='text-Green'>Ahora completa el perfil</p>
                        </section>
                        <section className='flex  items-center w-full   gap-2 py-2 px-4 bg-white border-1 border-Violet '>
                            <MousePointer2 className='h-5 w-5 text-Green' />
                            <p className='text-Green'>Solicita tu crédito y sube la documentación</p>
                        </section>
                        <section className='flex  items-center w-full   gap-2 py-2 px-4 bg-white border-1 border-Violet '>
                            <MousePointer2 className='h-9 w-9 text-Green ' />
                            <p className='text-Green'>Ten en cuenta que tu solicitud sera evaluada. <br />Podrás realizar el seguimiento y ver el estado de las mismas en "Mis Solicitudes".</p>
                        </section>
                        <section className='flex items-center w-full   gap-2 py-2 px-4 bg-white border-1 border-Violet '>
                            <MousePointer2 className='h-5 w-5 text-Green' />
                            <p className='text-Green'>Y ¡listo! Recibi tu crédito</p>
                        </section>
                    </div>
                </div>

                <div className='mb-8 gap-2 bg-white px-0'>
                    <section className='flex justify-center items-center w-sm rounded-md mb-2  gap-2 py-2 px-4 bg-white border-2 border-b-4 border-gray-400'>
                        <p className='text-Green'>100% Seguro</p>
                    </section>
                    <section className='flex justify-center items-center w-sm rounded-md mb-2  gap-2 py-2 px-4 bg-white border-2 border-b-4 border-gray-400'>
                        <p className='text-Green'>Acompañamiento Personalizado</p>
                    </section>
                    <section className='flex justify-center items-center w-sm rounded-md mb-2  gap-2 py-2 px-4 bg-white border-2 border-b-4 border-gray-400'>
                        <p className='text-Green'>Transparencia en cada paso</p>
                    </section>
                </div>
            </div>
        </>
    );
};

export default SideCardProfile
