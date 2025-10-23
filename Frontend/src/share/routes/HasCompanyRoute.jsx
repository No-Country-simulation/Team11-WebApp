import { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useCompany } from "../../features/profile/hooks/useCompany";
import { toast } from "sonner";

export function HasCompanyRoute({ redirectTo = "/panel/empresa" }) {
  const { company, loading, error } = useCompany();
  const loadingToastId = useRef(null);
  const hasShownSuccess = useRef(false);

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

  // Si no tiene empresa, redirigir al panel de empresa
  if (!loading && !company) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si tiene empresa, mostrar las rutas internas
  return <Outlet />;
}
