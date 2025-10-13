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

### Uso del cliente HTTP compartido (`api` con axios)

La app expone una instancia compartida de axios en `src/share/api/api.js` para centralizar la configuración (baseURL, interceptores, etc.).

1) Configurar la variable de entorno del backend en `.env` (o `.env.local`):

```bash
VITE_API_BASE=https://backend.dev/
```

2) Importar y usar `api` en los servicios o componentes (preferiblemente en `services/` de cada feature):

```js
// Ejemplos de uso
import { api } from "../share/api/api";

// GET
const { data } = await api.get("/users");

// POST (con payload)
await api.post("/auth/login", { email, password });

// Con params y headers adicionales (si hace falta)
await api.get("/reports", { params: { page: 1 }, headers: { "x-source": "web" } });
```

3) Manejo de errores: `api` devuelve los errores de axios. Se puede capturar en los servicios para mapear mensajes de UI.

```js
try {
  const { data } = await api.get("/me");
  return data;
} catch (error) {
  const message = error?.response?.data?.message ?? "Error inesperado";
  throw new Error(message);
}
```

Nota: Próximamente se agregará en `api.js` la inyección automática del token (p. ej., `Authorization: Bearer <token>`) mediante interceptores. De esa manera, no sera necesario pasar el token manualmente en cada request.
