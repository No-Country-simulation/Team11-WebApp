# PyFin Plataforma de Aprobación de Créditos para PYMEs

Este proyecto es una **plataforma web** diseñada para la **gestión, solicitud y aprobación de créditos para pequeñas y medianas empresas (PYMEs)**.  
Permite a los usuarios registrarse, cargar documentación, firmar digitalmente y realizar el seguimiento del estado de su solicitud en tiempo real.

---

## Características Principales

- **Registro y autenticación segura**  
  Sistema de creación de cuentas con validación de credenciales y protección de datos.

- **Gestión de cuentas de usuario**  
  Panel de usuario para actualizar información personal y empresarial.

- **Solicitud de créditos**  
  Los usuarios pueden completar un **formulario dinámico**, con guardado automático de avances.

- **Carga de documentos**  
  Permite subir archivos requeridos (comprobantes, balances, identificaciones, etc.) asociados a la solicitud.

- **Firma digital**  
  Integración con un sistema de firma digital para validar la autenticidad de los documentos.

- **Seguimiento en tiempo real**  
  Cada solicitud puede consultarse en cualquier momento para ver su **estado de aprobación**.

---

## Tecnologías y librerias Utilizadas

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

---



## 🧩 Estructura del Proyecto

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

---

## Flujo General del Sistema

1. El usuario se **registra o inicia sesión**.  
2. Crea una **nueva solicitud de crédito**.  
3. Completa el **formulario dinámico** con información de la empresa y documentación requerida.  
4. **Carga los documentos** necesarios y **firma digitalmente**.  
5. Puede **revisar el estado** del proceso en todo momento desde su panel.  
6. El **administrador o analista de crédito** revisa la solicitud y la **aprueba o rechaza**.

---

## Futuras Mejoras

- Implementación de un módulo de análisis automático de riesgo crediticio.  
- Dashboard para administradores con métricas y estadísticas.  
- Integración con servicios financieros externos.  
- Notificaciones por correo o SMS.

---

## Equipo

 - Pia Lassartesse (Diseñadora UX/UI) / http://behance.net/pialassartesse  / http://linkedin.com/in/p%C3%ADa-lassartesse-uxui12  |
 - Mabel Iris Esmeralda Cárdenas Fernández (Desarrolladora Backend) / https://github.com/Mabeliris /   |
 - María Valentina Calogeropulos (Desarrolladora Fullstack) / https://github.com/ValenCalog  /   |
 - José Lugo (Desarrollador Fullstack) / https://github.com/jlugod1  /   |
 - Walter Laborde (Desarrollador Backend) / https://github.com/walterLaborde  /   |
 - Jefferson Panchi (Desarrolador Frontend) / https://github.com/jfpanchi  /   |
 - Juan Sebastian Rivera Chavez (QA Tester)  / https://github.com/juans0817  /   |
 - Gastón Federico Nahuel Gómez (Desarrollador Frontend) / https://github.com/Morfeo1997  /  https://gaston-gomez1997.netlify.app/ / https://www.linkedin.com/in/gaston-gomez1997/ |

---

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**.  
Consulta el archivo [`LICENSE`](LICENSE) para más detalles.
