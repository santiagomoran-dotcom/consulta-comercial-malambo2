# Registro de cambios

## 2026-10-19
- Se inicializó el repositorio, la rama `main`, el `.gitignore` y el README inicial.
- Etapa 0: estructura de carpetas, `index.html` con aviso permanente y navegación, enrutador por hash, almacén con LocalStorage validado, datos de ejemplo (7 comercios, 45 productos) y vistas de las 4 rutas.
- Etapa 1: buscador (sin tildes ni mayúsculas, chips de categoría, filtros por medio de pago, barrio y "abierto ahora", orden por precio, "actualizado hace X", estados vacío y de carga), ficha del comercio y mapa general con Leaflet.
- Etapa 2: panel con PIN para crear, editar y eliminar productos, con confirmación y avisos breves.
- Etapa 3: insignias de disponibilidad (Disponible, Pocas unidades, Agotado) en panel, buscador y ficha.
- Etapa 4: títulos de lista como `h2` (orden de encabezados), README final con arquitectura, PIN de ejemplo y guía de despliegue en Vercel.
- Mejoras visuales: favicon, tipografías Plus Jakarta Sans e Inter de Google Fonts, diálogos de confirmación propios (eliminar y restablecer), portada con degradado en el inicio, barra de navegación flotante en móvil y tarjetas con sombras suaves.
- Se creó `docs/evidencias/casos-de-prueba.md` con los casos CP-001 a CP-039, todos pendientes de prueba manual.
- Pendiente: probar los casos en el navegador, tomar las capturas, verificar las coordenadas en OpenStreetMap y desplegar en Vercel.
