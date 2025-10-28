import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCompanyCreditApplications } from '../services/credit-application';

export const useCreditApplicationsStore = create(
  persist(
    (set, get) => ({
      // Estado
      applications: [],
      loading: false,
      error: null,
      filters: {
        status: 'ALL',
      },
      
      // Actions
      setApplications: (applications) => set({ applications }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilters: (filters) => set({ 
        filters: { ...get().filters, ...filters } 
      }),
      
      // Obtener aplicaciones del backend
      fetchApplications: async () => {
        try {
          set({ loading: true, error: null });
          const applications = await getCompanyCreditApplications();
          set({ applications, loading: false });
          return applications;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      // Obtener aplicaciones filtradas por estado (CORREGIDO)
      getApplicationsByStatus: (status) => {
        const { applications } = get();
        
        if (status === 'ALL') {
          return applications;
        }
        
        return applications.filter(app => app.creditStatus  === status);
      },
      
      // Obtener aplicaciones con filtros actuales (para el layout)
      getFilteredApplications: () => {
        const { applications, filters } = get();
        
        if (filters.status === 'ALL') {
          return applications;
        }
        
        return applications.filter(app => app.creditStatus  === filters.status);
      },
      
      // Obtener estadísticas
      getStats: () => {
        const { applications } = get();
        
        return {
          total: applications.length,
          draft: applications.filter(app => app.creditStatus  === 'SAVE').length,
          pending: applications.filter(app => app.creditStatus  === 'PENDING').length,
          underReview: applications.filter(app => app.creditStatus  === 'UNDER_REVIEW').length,
          approved: applications.filter(app => app.creditStatus  === 'APPROVED').length,
          rejected: applications.filter(app => app.creditStatus  === 'REJECTED').length,
          cancelled: applications.filter(app => app.creditStatus  === 'CANCELLED').length,
        };
      },
    }),
    {
      name: 'credit-applications-storage',
      partialize: (state) => ({ 
        applications: state.applications,
        filters: state.filters 
      }),
    }
  )
);