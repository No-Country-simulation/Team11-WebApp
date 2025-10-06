### Tecnologías y librerías

Dependencias:
- react (^19.1.1): Biblioteca de UI basada en componentes.
- react-dom (^19.1.1): Renderizado de React en el DOM del navegador.
- react-router-dom (^7.9.3): Enrutamiento para SPA basado en componentes.
- axios (^1.12.2): Cliente HTTP para consumir APIs.
- zustand (^5.0.8): Gestión de estado global ligera y escalable.
- react-hook-form (^7.64.0): Manejo de formularios usando hooks de React.
- @hookform/resolvers (^5.2.2): Adaptadores de validación para RHF.
- zod (^4.1.11): Validación de esquemas en runtime y ayuda con tipos.
- tailwindcss (^4.1.14): Framework CSS de utilidades para estilos rápidos.

### Estructura base (Screaming Architecture) — `src/`

Estructura orientada a `features`: los nombres de carpetas comunican el `feature` y sus capas.

```
└── 📁src
    └── 📁features        
    └── 📁share
        └── 📁api
        └── 📁assets
        └── 📁components
            └── 📁ui
        └── 📁hooks
        └── 📁layouts
        └── 📁routes
            ├── index.jsx
        └── 📁utils
    ├── App.jsx
    ├── index.css
    └── main.jsx
```
Notas (para qué se usa cada carpeta):
- `features/`: módulos verticales por dominio (p. ej., `auth/`, `home/`).
  - `components/`: componentes específicos del dominio.
    - `ui/`: átomos/moléculas UI del dominio.
  - `hooks/`: hooks específicos del dominio.
  - `pages/`: páginas/rutas del dominio.
  - `services/`: acceso a datos, llamadas HTTP y lógica de integración del dominio.
- `share/`: código compartido entre dominios.
  - `api/`: configuración de cliente HTTP, instancias y middlewares.
  - `assets/`: recursos estáticos (imágenes, íconos, SVG, fuentes).
  - `components/`
    - `ui/`: componentes UI reutilizables (botones, inputs, modales, etc.).
  - `hooks/`: hooks reutilizables (estado, utilidades, data fetching genérico).
  - `layouts/`: contenedores de layout (shells, barras laterales, headers).
  - `routes/`: definición de rutas y registro del router (p. ej., `index.jsx`).
  - `utils/`: utilidades puras (formatos, helpers, constantes).
- `App.jsx`: composición raíz de la app (providers, router, layout principal).
- `main.jsx`: punto de entrada que monta React en el DOM.
- `index.css`: estilos globales (incluye configuración de Tailwind).

### Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Previsualización del build
npm run lint     # Linter
```
