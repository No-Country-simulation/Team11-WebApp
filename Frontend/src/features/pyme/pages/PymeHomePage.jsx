export default function PymeHomePage() {
  return (
    <div className="w-full bg-primary">
      <div className="grid md:grid-cols-12 items-stretch max-w-7xl mx-auto">
        <div className="md:col-span-7 overflow-hidden">
          <img
            src="/pyme-banner.png"
            alt="Personas revisando documentos frente a un computador"
            className="w-full h-full object-cover"
          />
        </div>

        <aside className="bg-primary p-4 md:p-6 flex flex-col justify-center gap-6 md:col-span-5">
          <div className="bg-secondary text-white text-center font-extrabold rounded-4xl py-3 px-4 text-4xl shadow-[0_4px_4px_0_#00000040]">
            Solicita tu crédito ahora
          </div>

          <div className="bg-white text-center font-bold text-2xl text-text rounded-xl shadow-[0_0_4px_0_#33333380] border border-secondary p-4">
            100% Seguro
          </div>

          <div className="bg-white text-center font-bold text-2xl text-text rounded-xl shadow-[0_0_4px_0_#33333380] border border-secondary p-4">
            Transparencia en cada paso
          </div>

          <div className="bg-white text-center font-bold text-2xl text-text rounded-xl shadow-[0_0_4px_0_#33333380] border border-secondary p-4">
            Acompañamiento personalizado
          </div>

          <div className="bg-white text-center font-bold text-2xl text-text rounded-xl shadow-[0_0_4px_0_#33333380] border border-secondary p-4">
            Sin costos ocultos
          </div>
        </aside>
      </div>
    </div>
  );
}
