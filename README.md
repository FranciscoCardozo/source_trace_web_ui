# source-trace · Web UI

Frontend de **source-trace**: una aplicación Angular para analizar código fuente. Permite
subir un artefacto comprimido o indicar la URL de un repositorio para que el backend lo
descargue y lo analice, y luego consultar el estado y los resultados del análisis.

Generado con [Angular CLI](https://github.com/angular/angular-cli) 19.2.x.

---

## Requisitos

| Herramienta | Versión recomendada |
|-------------|---------------------|
| Node.js     | 20.x (LTS)          |
| npm         | 10.x                |

Angular 19 requiere Node `^18.19` o `>=20.x`. Verifica con:

```bash
node -v
npm -v
```

---

## Levantar el repositorio en local

### 1. Clonar

```bash
git clone git@github.com:FranciscoCardozo/source_trace_web_ui.git
cd source_trace_web_ui
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Arrancar el servidor de desarrollo

```bash
npm start
```

> `npm start` es un alias de `ng serve`.

La app queda disponible en **http://localhost:4200/** con recarga automática al guardar
cambios.

Para exponerla en la red local o cambiar el puerto:

```bash
npm start -- --host 0.0.0.0 --port 4300
```

---

## Configuración de endpoints

Las URLs del backend (API de invocación, API de estado y CDN de evidencias) están en
[`src/app/config.ts`](src/app/config.ts):

```ts
export default {
  invokerApiEndpoint: 'https://.../prod',   // /V1/product/analysis/invoke y /uploadUrl
  statusApiEndpoint:  'https://.../prod',    // /V1/product/status/analysis
  evidencesUrl:       'https://...cloudfront.net', // base pública de las evidencias
  // ...
};
```

Ajusta esos valores si apuntas a otro entorno. No hay archivos `environment.ts`: toda la
configuración vive en `config.ts`.

---

## Rutas de la aplicación

| Ruta        | Pantalla            | Descripción |
|-------------|---------------------|-------------|
| `/`         | Inicio              | Presentación y accesos directos a las dos acciones |
| `/analyze`  | Analizar código     | Sube un `.zip` / `.tar.gz` o pega la URL de un repositorio e inicia el análisis |
| `/validate` | Validar análisis    | Consulta por `jobId` el estado y los resultados (resumen + evidencias) |

Desde `/analyze`, al iniciar un análisis se obtiene un `jobId` con el que se puede navegar
directamente a `/validate?jobId=<id>`.

---

## Scripts disponibles

| Comando          | Acción |
|------------------|--------|
| `npm start`      | Servidor de desarrollo (`ng serve`) en `:4200` |
| `npm run build`  | Build de producción en `dist/source-trace-web-ui/` |
| `npm run watch`  | Build en modo desarrollo con recompilación continua |
| `npm test`       | Tests unitarios con Karma + Jasmine |

---

## Build de producción

```bash
npm run build
```

Genera los estáticos en `dist/source-trace-web-ui/browser/`. Ese es el contenido que el
pipeline sube a S3 (ver [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

---

## Estructura del proyecto

```
src/app/
├── components/        # Componentes reutilizables
│   ├── header/          barra superior
│   ├── side-bar/        navegación lateral
│   ├── upload-file/     dropzone de carga de archivos
│   ├── summary/         resumen del resultado de un análisis
│   ├── evidence/        galería de evidencias (imágenes desde CloudFront)
│   └── modal/           diálogo genérico
├── pages/             # Vistas enrutadas
│   ├── home-page/
│   ├── analyze-code/
│   └── results/         (ruta /validate)
├── services/         # Acceso a APIs (fetch)
│   ├── invokerService/   uploadUrl + invoke
│   ├── bucketService/    PUT del artefacto a la URL prefirmada
│   ├── statusService/    consulta de estado por jobId (header x-job-id)
│   └── eventsService/    eventos de UI (modales / navegación)
├── models/           # Interfaces y enums
└── config.ts         # Endpoints del backend
```

---

## Comandos comunes de Angular CLI

Crear un componente:

```bash
npx ng g c components/nombre-componente
```

Crear un servicio:

```bash
npx ng g s services/nombreService/nombre
```

Ver más opciones:

```bash
npx ng generate --help
```

---

## Despliegue

El despliegue a S3 + CloudFront es automático mediante GitHub Actions al hacer push a
`main` (autenticación por OIDC, sin llaves de larga duración). Detalles en
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
