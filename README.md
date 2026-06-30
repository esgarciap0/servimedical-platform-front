# Servimedical Platform — Frontend

SPA en **React 19 + TypeScript + Vite** que consume el backend Spring Boot
[`servimedical-platform-back`](../servimedical-platform-back).

---

## Requisitos

- Node.js **20+**
- npm 10+
- Backend Servimedical corriendo (por defecto en `http://localhost:8080`)

---

## Configuración

1. Copia el archivo de ejemplo de variables de entorno:

   ```bash
   cp .env.example .env.local
   ```

2. Ajusta `VITE_API_URL` si tu backend no está en `http://localhost:8080/api`.

> Solo `.env.example` se versiona. Los archivos `.env`, `.env.local`, etc. están
> ignorados por git.

---

## Scripts

| Comando            | Descripción                                  |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Servidor de desarrollo con HMR               |
| `npm run build`    | Type-check (`tsc -b`) + build de producción  |
| `npm run preview`  | Sirve el build de producción para revisión   |
| `npm run lint`     | Corre ESLint sobre todo el proyecto          |
| `npm run lint:fix` | ESLint con autofix                           |
| `npm run typecheck`| Solo verificación de tipos                   |

---

## Estructura

```
src/
├── assets/                     Imágenes y SVGs
├── config/
│   └── env.ts                  Lectura centralizada de variables de entorno
├── data/
│   └── modules.ts              Catálogo de módulos del sidebar/dashboard
├── icons/
│   └── AppIcons.tsx            Re-exports tipados de @mui/icons-material
├── layout/
│   └── MainLayout.tsx          Drawer + AppBar + Outlet
├── pages/
│   ├── Dashboard.tsx
│   ├── ModulePlaceholder.tsx   Vista "en construcción" para módulos sin pantalla
│   ├── NotFound.tsx
│   ├── Prehospitalizacion.tsx  Pantalla principal del módulo APH
│   └── prehospitalizacion/
│       ├── constants.ts        Opciones, columnas y configuración estática
│       ├── helpers.ts          Funciones puras (sort, parseo, helpers de UI)
│       └── initialForm.ts      Estado inicial del formulario APH
├── services/
│   ├── api.ts                  Cliente HTTP genérico + ApiError
│   ├── aphService.ts           Endpoints del recurso /aph
│   └── pdfGenerator.ts         Generación de PDF en cliente (pdf-lib)
├── types/
│   └── aph.ts                  AphForm, AphPayload, AphResponse, AphSortKey
├── main.tsx
├── router.tsx
└── theme.ts                    Tema MUI centralizado
```

---

## Cómo agregar un módulo nuevo

1. Registra el módulo en `src/data/modules.ts` (nombre, ruta, icono, descripción).
2. Crea la página en `src/pages/MiModulo.tsx` (o una carpeta si se vuelve grande).
3. Si no agregas ruta específica en `src/router.tsx`, el router usará
   `ModulePlaceholder` automáticamente (vista "en construcción").

## Cómo agregar un campo nuevo al formulario APH

1. Añade el campo en `src/types/aph.ts` → `AphForm`.
2. Añade su valor inicial en `src/pages/prehospitalizacion/initialForm.ts`.
3. Si es obligatorio, agrégalo al tab correspondiente en
   `src/pages/prehospitalizacion/constants.ts` → `requiredFieldsByTab`.
4. Renderiza el `<FormInput />` en el tab apropiado dentro de `Prehospitalizacion.tsx`.

`AphPayload` y `AphResponse` se derivan de `AphForm`, así que no hay que
duplicar tipos.

---

## Convenciones

- **HTTP**: usar siempre `api`/`aphService`, nunca `fetch` directo en componentes.
- **Errores**: capturar `ApiError` (`status`, `message`, `fields`) para feedback
  consistente con el backend.
- **Estilos**: respetar el tema MUI (`theme.ts`). Evitar colores hex sueltos.
- **Rutas**: enlazar con `<Link component={RouterLink} to="..." />` para evitar
  full reloads.
