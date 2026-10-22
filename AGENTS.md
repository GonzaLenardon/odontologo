# AGENTS.md — Sistema Odontológico

## Resumen del proyecto

Demo frontend para presentación a cliente. Sistema de gestión odontológica que organiza la información clínica, administrativa y financiera en dos módulos conectados:

1. **Software odontológico** (puertas adentro) — gestión interna: agenda, historias clínicas, odontograma, presupuestos, cobros, profesionales.
2. **Portal del paciente** (puertas afuera) — reserva de turnos online, consulta de presupuestos, confirmación de citas.

Ambos módulos comparten **el mismo store**: un turno reservado desde el portal aparece en la agenda interna, y un presupuesto creado internamente se ve en el portal del paciente. Eso es lo que demuestra que es una plataforma y no pantallas sueltas.

Stack: Vite 8 + React 18. UI: MUI v5 + Tailwind CSS v3. Deploy: GitHub Pages (`https://GonzaLenardon.github.io/odontologo`).

## Comandos

```bash
npm run dev        # Dev server Vite en puerto 3006
npm run build      # Producción → dist/
npm run preview    # Sirve el build de producción (localhost:4173)
npm run deploy     # Build + deploy a gh-pages
```

No hay scripts de lint, typecheck o formatter propios. ESLint configurado en `package.json`.

## Stack y configuración crítica

| Tema | Dónde | Nota |
|---|---|---|
| **PostCSS** | `postcss.config.js` | **Obligatorio.** Tailwind v3 es un plugin de PostCSS y Vite NO lo integra solo (CRA sí lo hacía). Sin este archivo, `@tailwind` queda literal en el bundle y **ninguna** clase utilitaria se genera — el build pasa pero la app sale sin estilos. |
| **Base path** | `vite.config.mjs` | `base: '/odontologo/'` — GitHub Pages sirve bajo ese subpath. |
| **Basename** | `src/constants.js` | `BASENAME = '/odontologo'`, usado en el `BrowserRouter`. Debe coincidir con `base`. |
| **Rutas** | `src/constants.js` | `stripBasename()` normaliza `location.pathname` (react-router v6 lo devuelve **con** el basename incluido y con trailing slash). Sin esto, todo cae al módulo por defecto. |
| **Env** | `.env` | Prefijo `VITE_`. `VITE_API_URL`, `VITE_ID_SISTEMA` (reservados para el backend real). |

## Arquitectura

### Estructura de directorios

```
src/
  components/
    abm/            # Módulos de ficha: Pacientes, Historial, Estudios, Odontologos, OSociales, Proveedores, Cuadrado (odontograma)
    agenda/         # Agenda inteligente con drag & drop
    dashboard/      # Panel de control con KPIs
    portal/         # Portal del paciente (reserva + presupuestos)
    presupuesto/    # Presupuesto y Pagos + FirmaDigital
    recordatorios/  # Recordatorios automáticos WhatsApp/email
    elements/       # CSnackbar
  constants.js      # BASENAME + stripBasename
  context/
    DemoContext.jsx # Store unificado (pacientes, turnos, presupuestos, pagos, envios, actividad)
    UserContext.jsx # Usuario de la sesión
  data/
    catalogos.js    # Datos de referencia: odontólogos, obras sociales, tratamientos, estados
    dientes.js      # 32 piezas dentales (imágenes) + aradas FDI
    presupuestos.js # Cálculos de presupuesto (total, cobertura, copago, saldo)
    seed.js         # Datos iniciales de la demo
  pages/            # Login, Home, HomeNew
  utils/            # (vacío — utils removidas)
  assets/           # 32 dientes PNG, 5 fotos de paciente, panorámicas, foto de consultorio
```

### Routing

Todas las rutas cuelgan de `/odontologo` (basename). 11 rutas:

| Ruta | Módulo |
|---|---|
| `/` | Login |
| `/dashboard` | Panel de control (inicio) |
| `/pacientes` | Ficha del paciente (datos, historial, odontograma, estudios) |
| `/agenda` | Agenda inteligente |
| `/odontograma` | Odontograma interactivo |
| `/recordatorios` | Recordatorios automáticos |
| `/obras-sociales` | Obras sociales y prepagas |
| `/odontologos` | Equipo odontológico |
| `/proveedores` | Proveedores |
| `/presupuestos` | Presupuesto y Pagos |
| `/portal` | Portal del paciente |

`Home.jsx` deriva el módulo visible **de la URL** (no de estado local) → los deep-links funcionan y las URLs son compartibles. Para agregar un módulo: nueva ruta en `App.jsx` + entrada en `menuSections` y `componentMap` de `Home.jsx`.

### Store unificado (`context/DemoContext.jsx`)

Fuente única de verdad, persistida en `localStorage` (clave `odontologo_demo_store`):

```js
const { getAll, getById, create, update, remove, registrarActividad, reset } = useDemo();
```

Colecciones: `pacientes`, `turnos`, `presupuestos`, `pagos`, `historial`, `envios`, `actividad`.

- `registrarActividad(tipo, texto)` escribe en la bitácora que muestra el Dashboard.
- Las fotos de paciente **no se serializan**: se restauran del `seed` al cargar.
- `reset()` devuelve todo al estado inicial (útil si la demo queda con datos tocados).

## Funcionalidades implementadas

### 1. Panel de control (`components/dashboard/Dashboard.jsx`)

- **KPIs**: turnos hoy, pacientes activos, facturación del mes, recordatorios enviados.
- **Próximos turnos** con estado y urgencia.
- **Mini calendario** del mes con densidad de turnos.
- **Por cobrar**: presupuestos aceptados con saldo pendiente.
- **Actividad reciente**: timeline de turnos, presupuestos, pagos y recordatorios.

### 2. Agenda inteligente (`components/agenda/Agenda.jsx`)

- **Click en una celda** → abre el dialog **precargado** con esa fecha y hora.
- **Paciente → odontólogo automático**: al elegir el paciente, el profesional se asigna desde su ficha (`odontologoId`), con la ayuda *"Asignado automáticamente según la ficha del paciente"*.
- **Selector de fecha** y de hora, tipo, duración y estado.
- **Detalle de turno** (click en el turno): cambiar estado en un click, editar, eliminar.
- **Drag & drop** con **confirmación** antes de guardar y aviso de **solapamiento**.
- **Filtros** por profesional y por tipo de consulta.
- Vistas semanal y mensual.

### 3. Recordatorios automáticos (`components/recordatorios/Recordatorios.jsx`)

- WhatsApp y email habilitables por separado.
- **Anticipación** (horas antes) y **horario de envío** configurables.
- **3 plantillas** con variables `{paciente}`, `{fecha}`, `{hora}`, `{odontologo}`.
- Envío individual o a todos; historial con el mensaje exacto enviado.

### 4. Historias clínicas

- **Odontograma** (`components/abm/Cuadrado.jsx`): 32 dientes reales (`data/dientes.js`), click en un diente → popover con las **5 caras** (Vestibular, Lingual, Mesial, Distal, Oclusal/Incisal) → aplica el estado seleccionado. **18 estados clínicos**, historial de cambios, deshacer, dialog de guardado.
- **Historial** (`abm/Historial.jsx`): tabla con búsqueda en vivo.
- **Ficha del paciente** (`abm/Pacientes.jsx`): datos editables, obra social con % de cobertura y copago, odontólogo asignado, observaciones clínicas.
- **Estudios** (`abm/Estudios.jsx`): panorámicas con modal de detalle.

### 5. Presupuesto y Pagos (`components/presupuesto/Presupuestos.jsx`)

- **KPIs**: facturado, cobrado, pendiente de cobro.
- **Listado** con búsqueda y filtro por estado.
- **Detalle**: ítems, subtotal, descuento, cobertura de obra social y copago, total a pagar, pagos registrados, firma.
- **Estados**: `borrador → enviado → aceptado → pagado` (o `rechazado`).
- **Crear presupuesto** con catálogo de tratamientos (18 conceptos con precio) y total en vivo.
- **Registrar pago**: monto, método (efectivo / transferencia / tarjeta / obra social), recibido por.
- **Firma digital** (`FirmaDigital.jsx`): canvas propio con Pointer Events. El paciente firma la aceptación.
- **Imprimir / exportar** (CSS de impresión en `index.css`).

### 6. Portal del paciente (`components/portal/PortalPaciente.jsx`)

- Wizard de 4 pasos: profesional → fecha/hora → datos → confirmación.
- **Horarios ocupados** calculados sobre los turnos reales.
- **Sus presupuestos** con total a pagar y saldo pendiente.
- **Sus turnos**.
- Al reservar, el turno **aparece en la agenda interna**.

## Convenciones técnicas

- **UI**: MUI v5 + Tailwind CSS v3 simultáneos. Tailwind escanea `src/**/*.{js,jsx,ts,tsx}`.
- **Colores**: tema Tailwind `primary` (escala 50-900) y `dental` (`light`/`DEFAULT`/`dark`/`accent`). Usar clases, no hex sueltos.
- **MUI `color` prop**: solo acepta claves del tema (`primary`, `textPrimary`, `error`...). Para tonos exactos usar `className="text-primary-900"`.
- **Tailwind opacity**: solo valores de la escala (`/5`, `/10`, `/95`…). `bg-primary-900/98` no se genera.
- **Forms**: controlados con `formData` + `updateFormData(campo, valor)`.
- **Consola**: `console.log` deshabilitado en producción vía `src/config.js` (`import.meta.env.PROD`).
- **Archivos**: `.jsx` contiene JSX; `.js` es utilería sin JSX. Vite 8 no parsea JSX en `.js`.

## Guion de demo sugerido

1. **Login** → **Panel** ("de un vistazo tenés el control")
2. **Pacientes** → buscar → ficha con foto y cobertura de obra social
3. **Odontograma** → click en un diente, elegir cara, aplicar estado, guardar
4. **Presupuesto y Pagos** → ítems, cobertura, **firma del paciente**, cobrar
5. **Portal del paciente** → ve el presupuesto, reserva un turno
6. **Agenda** → el turno reservado ya está, arrastralo, probá el solapamiento
7. **Recordatorios** → enviar WhatsApp, ver el KPI del Panelactualizarse

## Gotchas

- **Tailwind sin PostCSS es el fallo más común**: si el CSS generado queda en ~2 kB o aparecen clases sin efecto, revisar `postcss.config.js` y que `postcss`/`autoprefixer` estén en `devDependencies`.
- `react-signature-canvas@1.1.0-alpha.1` **cuelga el build** de Vite 8 (UMD antiguo incompatible con Rolldown). La firma está implementada a mano en `FirmaDigital.jsx`. No volver a instalar ese paquete.
- `location.pathname` en react-router v6 **incluye** el basename → usar siempre `stripBasename()`.
- El `BrowserRouter` necesita `basename` o en GitHub Pages nunca se alcanza `/dashboard`.
- Los MUI `Popover`/`Dialog` evalúan los children aunque estén cerrados: si un child usa un valor `null` (ej. `tipoDiente(popover.diente)`), hay que guardarlo o la vista crashea.
- `.env` está commiteado: no agregar secretos reales.
