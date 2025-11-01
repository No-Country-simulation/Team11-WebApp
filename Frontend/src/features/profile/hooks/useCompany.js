import { useEffect, useState } from "react";
import { useCompanyStore } from "../store/useCompanyStore";
import { getCompanyProfile } from "../services/company";
import useAuthStore from "../../auth/hooks/useAuthStore";

export const useCompany = () => {
  const { company, setCompany, clearCompany } = useCompanyStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Solo necesitamos saber si el usuario está autenticado
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getCompanyProfile();
        
        if (response && typeof response === "object") {
          setCompany(response);
        } else {
          clearCompany();
        }
      } catch (err) {
        const errorText = err.message || "Error al cargar la empresa";
        setError(errorText);
        clearCompany();
      } finally {
        setLoading(false);
      }
    };

    // 🔹 Solo hacer fetch si el usuario está autenticado
    if (isAuthenticated) {
      fetchCompany();
    } else {
      clearCompany();
    }
  }, [isAuthenticated]); // Dependencia: si cambia la autenticación, recarga

  return {
    company,
    loading,
    error,
    reloadCompany: async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      setError(null);
      try {
        const response = await getCompanyProfile();
        
        if (response && typeof response === "object") {
          setCompany(response);
        } else {
          clearCompany();
        }
      } catch (err) {
        setError(err.message || "Error al recargar la empresa");
      } finally {
        setLoading(false);
      }
    },
  };
};
