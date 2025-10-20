import {SquareCheckBig, MousePointer2 } from 'lucide-react'
//import img1 from './assets/FOTO 2.png' 

const SideCardProfile = () => {

    return (
        <>
            <div className='bg-Violet p-1'>
                <picture>
                    <img src={img1} alt="Imagen de dos personas viendo una pc." className='w-sm' />
                </picture>
                <div className='gap-2 mb-2'>
                    <section className='flex items-center w-sm gap-2 mb-2 py-2 px-4 bg-white border-1 border-Violet text-start'>
                        <SquareCheckBig className='h-5 w-5 text-Green' />
                        <p className='text-Green'> ¡Ya Creaste tu cuenta!</p>
                    </section>
                    <section className='flex items-center  w-sm mb-2  gap-2 py-2 px-4 bg-white border-1 border-Violet '>
                        <MousePointer2 className='h-5 w-5 text-Green' />
                        <p className='text-Green'>Ahora completa el perfil</p>
                    </section>
                    <section className='flex  items-center w-sm mb-2  gap-2 py-2 px-4 bg-white border-1 border-Violet '>
                        <MousePointer2 className='h-5 w-5 text-Green' />
                        <p className='text-Green'>Solicita tu crédito y sube la documentación</p>
                    </section>
                    <section className='flex  items-center w-sm mb-2  gap-2 py-2 px-4 bg-white border-1 border-Violet '>
                        <MousePointer2 className='h-10 w-10 text-Green ' />
                        <p className='text-Green'>Ten en cuenta que tu solicitud sera evaluada. <br />Podrás realizar el seguimiento y ver el estado de las mismas en "Mis Solicitudes".</p>
                    </section>
                    <section className='flex items-center w-sm mb-2  gap-2 py-2 px-4 bg-white border-1 border-Violet '>
                        <MousePointer2 className='h-5 w-5 text-Green' />
                        <p className='text-Green'>Y ¡listo! Recibi tu crédito</p>
                    </section>
                </div>
            </div>

            <div>
                <section></section>
                <section></section>
                <section></section>
            </div>
        </>
    );
};

export default SideCardProfile