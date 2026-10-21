# Consulta Comercial Malambo

Prototipo web para consultar productos, precios, ubicación y medios de pago de comercios de Malambo, Atlántico.

> Datos de ejemplo para fines académicos.

Proyecto Aplicado en Gerencia de Proyectos Informáticos, Ingeniería de Sistemas, CUN. Equipo 5, ficha 55530. Entrega final: 8 de noviembre de 2026.

## Problema

No hay un lugar único para consultar qué hay, a qué precio, dónde queda y cómo se paga en los comercios de Malambo, y los negocios pequeños casi no tienen presencia digital.

## Qué incluye

- **Buscador** de productos (sin distinguir tildes ni mayúsculas) con chips de categoría, filtros por medio de pago, barrio y "abierto ahora", y resultados ordenados por precio.
- **Ficha del comercio** con horario por día, medios de pago, WhatsApp, productos, mapa del local y "Cómo llegar" a Google Maps.
- **Mapa general** con un pin por comercio y un globo con enlace a la ficha.
- **Panel del comercio con PIN** para crear, editar y eliminar productos, y cambiar su disponibilidad (Disponible, Pocas unidades, Agotado).
- 7 comercios y 45 productos de ejemplo.

No incluye: compra o pago en línea, backend, inventarios reales ni app nativa.

## Cómo ejecutar

- Opción 1: abrir `index.html` con doble clic (funciona con `file://`).
- Opción 2: en la raíz, ejecutar un servidor estático, por ejemplo `python -m http.server` y abrir `http://localhost:8000`.

Requiere internet para cargar Tailwind CSS, Google Fonts, Leaflet y los mosaicos de mapa (Esri) desde sus CDN. Sin internet, la app funciona, pero el mapa muestra un aviso.

## PIN de ejemplo del panel

| Comercio | PIN |
|----------|-----|
| Tienda Don Pedro | 1111 |
| Panadería El Trigal | 2222 |
| Ferretería El Tornillo | 3333 |
| Papelería Punto Útil | 4444 |
| Frutería La Cosecha | 5555 |
| Miscelánea La Esquina | 6666 |
| Carnicería El Corral | 7777 |

Los cambios del panel se guardan en el LocalStorage del navegador. El botón "Restablecer datos de ejemplo" (pie de página) vuelve al estado inicial.

## Arquitectura

```
index.html        Página única (la que sirve Vercel)
css/estilos.css   Variables de color y componentes
js/app.js         Arranque: registra rutas y conecta el pie de página
js/router.js      Enrutador por hash (#/, #/comercio/ID, #/mapa, #/panel)
js/store.js       Datos: semilla + LocalStorage validado + operaciones de producto
js/busqueda.js    Lógica de filtrado y orden (sin DOM)
js/horario.js     Hora de Bogotá y estado Abierto/Cerrado (sin DOM)
js/mapaBase.js    Utilidades de Leaflet compartidas
js/utils.js       Formato de precios y fechas, normalización de texto, avisos
js/views/         Una vista por ruta (buscador, comercio, mapa, panel)
data/seed.js      Datos de ejemplo como window.SEED
docs/evidencias/  Casos de prueba y capturas
```

Todo vive bajo el espacio de nombres `window.CCM`, y cada archivo es una IIFE. El flujo es: `seed.js` → `store` (con LocalStorage) → vistas, que dibujan con `textContent` (nunca con `innerHTML` sobre datos).

## Decisiones técnicas

- **JavaScript clásico y un solo espacio de nombres (`window.CCM`)**: los módulos ES no funcionan con `file://`, y así el sitio se puede abrir sin servidor.
- **Datos en `data/seed.js`, sin `fetch`**: el navegador bloquea `fetch` de archivos locales.
- **Rutas con hash**: funcionan igual en `file://` y en Vercel, sin configurar reescrituras en el servidor.
- **LocalStorage validado**: se comprueba la forma de los datos al leerlos; si están dañados, la app vuelve a la semilla. Si LocalStorage no está disponible, sigue con datos en memoria y avisa al guardar.
- **`textContent` en vez de `innerHTML`**: evita XSS con datos escritos en el panel.
- **Hora de Bogotá con `Intl.DateTimeFormat`**: "Abierto ahora" es correcto aunque el dispositivo esté en otra zona horaria.
- **Lógica separada del DOM** (`busqueda.js`, `horario.js`): filtrar, ordenar y calcular horarios no dependen de la interfaz.
- **Diálogo de confirmación propio con `<dialog>`**: se ve acorde al sitio, atrapa el foco y se cierra con Escape; el foco inicial va en "Cancelar" para evitar borrados por accidente.
- **Google Fonts con respaldo**: Plus Jakarta Sans (títulos) e Inter (texto), con la tipografía del sistema como alternativa si no cargan.
- **Estado nunca solo por color**: las insignias de disponibilidad y de Abierto/Cerrado llevan texto y símbolo; los chips activos llevan ✓.
- **Leaflet 1.9.4 con integridad SRI y versión fija, y mosaicos de Esri World Street Map**: mapa liviano, sin llaves de API. Se dejó de usar `tile.openstreetmap.org` porque bloquea con "403 Access blocked" las peticiones sin Referer, como las de `file://`. Tailwind 3.4.17 por CDN con versión fija.
- **Sin datos personales**: la app no pide ni guarda datos del consumidor (Ley 1581 de 2012). El PIN nunca se guarda: la sesión del panel vive en memoria.

## Despliegue en Vercel

Es un sitio estático: no necesita `vercel.json`, `package.json` ni build. Todas las rutas de archivos son relativas y no hay dependencias de `file://`.

1. Entrar a vercel.com con GitHub e importar el repositorio.
2. Framework Preset: **Other**. Build Command y Output Directory: vacíos (raíz).
3. Cada push a `main` redespliega automáticamente.
4. Si la URL pide inicio de sesión, desactivar "Vercel Authentication" en Settings → Deployment Protection, y probar la URL en una ventana de incógnito.

## Limitaciones

- Sin backend: los cambios del panel viven solo en el navegador de cada persona, y no se ven entre dispositivos.
- El PIN es de ejemplo y no ofrece seguridad real: cualquiera puede leerlo en `data/seed.js`.
- Los comercios, teléfonos, WhatsApp y precios son ficticios. Las coordenadas son aproximadas y deben verificarse en OpenStreetMap.
- El CDN de Tailwind no se recomienda para producción: carga más código del necesario y muestra un aviso en la consola.
- Los horarios no contemplan turnos que crucen la medianoche.

## Trabajo futuro

- Código QR por comercio.
- Comparador de precios entre comercios.
- Backend real con autenticación para que los cambios se compartan entre dispositivos.
