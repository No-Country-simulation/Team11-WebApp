import React from "react";

export default function ComingSoonBanner() {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl rounded-2xl bg-LightGreen text-white shadow-xl">
        <div className="absolute -inset-1 rounded-2xl pointer-events-none" />
        <div className="relative p-8 md:p-10">
          <div className="flex items-center justify-center mb-6">
            <img src="/logo.png" alt="PYFIN" className="w-36 h-24 mr-3" />
          </div>
          <div className="flex flex-col items-center text-center space-y-3">                     
            <h2 className="text-xl md:text-2xl font-semibold">¡Muy pronto!</h2>
            <p className="text-white/90 max-w-xl">
              Estamos preparando algo increíble. Vuelve pronto para descubrirlo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
