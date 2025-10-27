import { ClockAlert, SaveOff, ShieldCheck, Users } from "lucide-react";
import React from "react";

export default function HomePage() {
  return (
    <div className="w-full">
      <section className="relative w-full">
        <img
          src="/banner.png"
          alt="Banner"
          className="w-full h-[220px] sm:h-[280px] md:h-[340px] lg:h-[380px] object-cover"
        />
        <div className="absolute inset-x-0 -bottom-5 flex justify-center">
          <div className="px-6 sm:px-8 py-2 sm:py-3 bg-secondary text-white font-extrabold text-3xl rounded-4xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] cursor-pointer">
            Solicita tu crédito ahora
          </div>
        </div>
      </section>

      <section className="mt-14 sm:mt-16 md:mt-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="flex flex-col justify-center items-center rounded-xl bg-secondary-lighter text-center py-8 shadow-md">
            <ShieldCheck className="text-text mb-1" size={50} />
            <div className="text-text font-medium text-lg">100% Seguro</div>
          </div>
          <div className="flex flex-col justify-center items-center rounded-xl bg-secondary-lighter text-center py-8 shadow-md">
            <ClockAlert className="text-text mb-1" size={50} />
            <div className="text-text font-medium text-lg">Rápido y simple</div>
          </div>
          <div className="flex flex-col justify-center items-center rounded-xl bg-secondary-lighter text-center py-8 shadow-md">
            <Users className="text-text mb-1" size={50} />
            <div className="text-text font-medium text-lg">
              Pensado para tu pyme
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <h2 className="text-text font-bold text-lg">Seguí los siguientes pasos</h2>
        </div>

        <div className="mb-16 mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto items-start">
          <div className="flex flex-col items-center gap-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary text-text flex items-center justify-center text-5xl font-bold shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
              1
            </div>
            <p className="sm:text-md text-text text-center font-semibold text-xl">
              Abrí una cuenta
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary text-text flex items-center justify-center text-5xl font-bold shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
              2
            </div>
            <p className="sm:text-md text-text text-center font-semibold text-xl">
              Completa tu perfil
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary text-text flex items-center justify-center text-5xl font-bold shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
              3
            </div>
            <p className="sm:text-md text-text text-center font-semibold text-xl">
              Solicitá tu crédito
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary text-text flex items-center justify-center text-5xl font-bold shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
              4
            </div>
            <p className="sm:text-md text-text text-center font-semibold text-xl">
              Recibí tu crédito
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
