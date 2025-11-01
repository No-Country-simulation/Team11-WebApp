import Img1 from '../assets/banner.png'
import Img2 from '../assets/foto-4.jpeg'

const AboutUs = () => {
    return (
        <main className="flex flex-col w-screen">
            <section className="min-w-full">
                <picture className="relative w-full">
                    <img alt="Banner" className="w-full h-[220px] sm:h-[280px] md:h-[340px] lg:h-[380px] object-cover" src={Img1} />
                </picture>
                <header className="w-full bg-Violet text-center py-10 px-6">
                    <h1 className="text-white text-5xl font-medium">Impulsamos el crecimiento de las pymes con soluciones <br /></h1>
                    <h1 className="text-white text-5xl font-medium mt-4">financieras ágiles, seguras y personalizadas.</h1>
                </header>
            </section>

            <section className="flex h-fit w-full">
                <picture className=''>
                    <img src={Img2} alt="" />
                </picture>
                <article className="text-center text-Green px-6">
                    <h2 className="text-Green text-3xl font-bold mt-8 mb-8">Misión</h2>
                    <p className='text-xl mt-4 mb-4 font-semibold'>Facilitar el financiamiento de manera simple y transparente.</p>
                    <h2 className="text-Green text-3xl font-bold mt-8 mb-8">Visión</h2>
                    <p className='text-xl mt-4 mb-4 font-semibold'>Ser la plataforma líder en evaluación y gestión de créditos para pymes en Latinoamérica.</p>
                    <h2 className="text-Green text-3xl font-bold mt-8 mb-8">Valores</h2>
                    <p className='text-xl mt-4 mb-4 font-semibold'>Innovación, transparencia, compromiso, confianza, eficiencia.</p>
                    <h2 className="text-Green text-3xl font-bold mt-8 mb-8" >¿Cómo trabajamos?</h2>
                    <p className='text-xl mt-4 mb-4 font-semibold'>Nuestro equipo esta conformado por especialistas en finanzas, tecnología y atención a pymes, comprometidos con acompañar cada etapa del proceso.</p>
                    <p className='text-xl mt-6 mb-4 font-semibold'>En Pyfin utilizamos tecnología de análisis inteligente para evaluar solicitudes de crédito, junto con la experiencia de nuestros operadores para tomar decisiones equilibradas.</p>
                </article>
            </section>
        </main>
    );
}

export default AboutUs
