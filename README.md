# Pulso Abierto

Aplicación web desarrollada con React y TypeScript para consultar en tiempo real las cotizaciones de Bitcoin, Ethereum y Solana en dólares (USD) y euros (EUR) mediante la API pública de CoinGecko. Permite filtrar los resultados a través de un formulario controlado con validación de esquemas, navegar hacia las vistas de detalle de cada criptomoneda y administrar una lista de favoritos con persistencia local.

## Enlaces del proyecto

* **Aplicación publicada en Vercel:** https://pulso-abierto-api4.vercel.app/
* **Repositorio en GitHub:** https://github.com/fernandezpd77-byte/pulso-abierto-api4

## Tecnologías principales

* **React 19** y **TypeScript**
* **Vite** (entorno de desarrollo y generación del build productivo)
* **React Router DOM** (enrutamiento SPA entre el listado principal y las vistas de detalle)
* **Zustand** (gestión de estado global para favoritos con persistencia en `localStorage`)
* **Zod** (validación de datos en el formulario controlado)
* **Vitest** y **Testing Library** (pruebas automatizadas unitarias y de integración)
* **ESLint** (análisis estático de código)

## Requisitos previos e instalación

* **Requisitos:** Node.js (versión 18 o superior) y npm instalados.

1. Clonar el repositorio e ingresar al directorio del proyecto:

```bash
git clone https://github.com/fernandezpd77-byte/pulso-abierto-api4.git
cd pulso-abierto-api4
```

2. Instalar las dependencias declaradas en `package.json`:

```bash
npm install
```

## Variables de entorno

Este proyecto no utiliza variables de entorno privadas ni requiere configurar un archivo `.env` local o en Vercel, ya que consume directamente el endpoint público de precios de CoinGecko (`https://api.coingecko.com/api/v3/simple/price`).

## Comandos disponibles

Todos los comandos coinciden con los scripts configurados en el archivo `package.json` del proyecto:

* **Ejecutar la aplicación en desarrollo:**

```bash
npm run dev
```

* **Ejecutar las pruebas automatizadas:**

```bash
npm run test
```

*(Para ejecutar la suite completa en una sola pasada sin modo watch: `npm run test:run`)*

* **Ejecutar el análisis estático (linter):**

```bash
npm run lint
```

* **Generar el build productivo (compila TypeScript y genera los archivos finales en la carpeta `dist/`):**

```bash
npm run build
```

* **Comprobar el build productivo localmente mediante preview:**

```bash
npm run preview
```

## Despliegue en Vercel

El proyecto está vinculado a GitHub y publicado en Vercel utilizando la configuración estándar de Vite (`npm run build` como comando de construcción y `dist` como directorio de salida). Además, incluye un archivo `vercel.json` con reglas de reescritura (`rewrites`) para permitir la navegación y recarga directa de rutas internas de detalle sin errores 404.

## Mejora de mantenibilidad realizada

* **Problema identificado:** El componente principal `src/App.tsx` concentraba responsabilidades mezcladas al encargarse al mismo tiempo de la consulta a la API, la lógica y validación del formulario controlado con Zod, el filtrado del listado y el renderizado completo de la sección de favoritos. Adicionalmente, en `src/pages/DetailPage.tsx` existía un error tipográfico en la etiqueta de moneda (`USD2S` en lugar de `USD`).
* **Cambio realizado:** Se extrajo la sección de visualización de criptomonedas favoritas hacia un componente dedicado (`src/components/FavoritosSection.tsx`) conectado directamente a `useFavoritosStore`, eliminando importaciones y variables innecesarias en `src/App.tsx`. También se corrigió la etiqueta a `USD` en `DetailPage.tsx` y en su archivo de prueba `DetailPage.test.tsx`.
* **Comprobación sin regresiones:** Se ejecutaron todas las pruebas automatizadas (`npm run test:run` con 5 suites y 17 tests aprobados), el análisis de ESLint (`npm run lint`), la compilación productiva (`npm run build`) y la vista previa local (`npm run preview`), confirmando que la selección y persistencia de favoritos conservan exactamente su comportamiento esperado.

## Verificación final

* **Pruebas ejecutadas:** Sí (`npm run test:run` con 5 suites y 17 pruebas aprobadas; `npm run lint` sin errores).
* **Build generado correctamente:** Sí (`npm run build` ejecutado sin errores, generando la carpeta `dist/`).
* **Preview comprobado:** Sí (`npm run preview` verificado localmente en el navegador sin errores bloqueantes en consola).
* **Despliegue realizado:** Sí, publicado y comprobado en https://pulso-abierto-api4.vercel.app/.
* **Fecha de verificación:** 23/11/2026.