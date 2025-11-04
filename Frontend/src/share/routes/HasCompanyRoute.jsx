import { useEffect, useRef, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useCompany } from "../../features/profile/hooks/useCompany";
import { toast } from "sonner";

export function HasCompanyRoute({ redirectTo = "/panel/empresa" }) {
  const { company, loading, error } = useCompany();
  const loadingToastId = useRef(null);
  const hasShownSuccess = useRef(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const wasLoading = useRef(false);

  // Rastrear cuando la carga inicial ha terminado
  // Solo marcar como loaded cuando loading pasa de true a false
  useEffect(() => {
    if (loading) {
      wasLoading.current = true;
    }
    
    // Solo marcar como loaded cuando ya estaba cargando y ahora terminó
    if (!loading && wasLoading.current && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [loading, hasLoaded]);

  // Mostrar toast de loading solo si está cargando y no hay toast activo
  useEffect(() => {
    if (loading && !loadingToastId.current) {
      loadingToastId.current = toast.info(
        "Cargando información de la empresa...",        
      );
    }

    // Cuando termina de cargar, cerramos el toast de loading
    if (!loading && loadingToastId.current) {
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = null;
    }
  }, [loading]);

  // Mostrar toast de error si hay
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Mostrar toast de éxito cuando la empresa ya está cargada
  useEffect(() => {
    if (!loading && company && !hasShownSuccess.current) {
      toast.success("Información de la empresa cargada!");
      hasShownSuccess.current = true;
    }
  }, [loading, company]);

  // Mientras está cargando por primera vez, esperar antes de tomar decisiones
  // Si ya tiene empresa en el store (persistido), podemos mostrar el Outlet mientras recarga
  if (!hasLoaded) {
    // Si tiene empresa persistida, mostrar el Outlet mientras verifica
    if (company) {
      return <Outlet />;
    }
    // Si no tiene empresa y está cargando, esperar
    return null; // o un componente de loading si prefieres
  }

  // Solo redirigir cuando ya terminó de cargar Y confirmó que no tiene empresa
  if (!loading && !company) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si tiene empresa, mostrar las rutas internas
  return <Outlet />;
}
