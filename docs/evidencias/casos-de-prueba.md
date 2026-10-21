# Casos de prueba

Los resultados reales los registra el equipo después de probar en el navegador. Ningún caso se marca como "Pasó" sin esa confirmación.

## Etapa 0 – Base

| ID | Descripción | Pasos | Resultado esperado | Resultado real | Estado | Fecha |
|----|-------------|-------|--------------------|----------------|--------|-------|
| CP-001 | Abrir con file:// | Abrir `index.html` con doble clic y revisar la consola (F12) | Carga el inicio sin errores en consola | Pendiente | Pendiente | — |
| CP-002 | Abrir con servidor local | Ejecutar `python -m http.server` en la raíz y abrir `http://localhost:8000` | Carga el inicio sin errores en consola | Pendiente | Pendiente | — |
| CP-003 | Las 4 rutas cargan | Visitar `#/`, `#/comercio/panaderia-el-trigal`, `#/mapa` y `#/panel` | Cada ruta muestra su título y el enlace activo de la navegación se resalta | Pendiente | Pendiente | — |
| CP-004 | Comercio inexistente | Visitar `#/comercio/xyz` | Mensaje "Comercio no encontrado" con botón para volver al inicio | Pendiente | Pendiente | — |
| CP-005 | Ruta desconocida | Visitar `#/algo-que-no-existe` | Redirige al inicio | Pendiente | Pendiente | — |
| CP-006 | Aviso permanente | Navegar por las 4 rutas | El aviso "Datos de ejemplo para fines académicos" se ve siempre arriba | Pendiente | Pendiente | — |
| CP-007 | Restablecer datos | Pulsar "Restablecer datos de ejemplo" y confirmar en el diálogo | La app recarga la vista sin errores y muestra el aviso "Datos de ejemplo restablecidos."; si se cancela, no pasa nada | Pendiente | Pendiente | — |
| CP-008 | LocalStorage dañado | En la consola: `localStorage.setItem('ccm.datos.v1', '{roto')` y recargar | La app carga con los datos de ejemplo, sin errores | Pendiente | Pendiente | — |
| CP-009 | Vista a 360 px | Abrir a 360 px de ancho (modo dispositivo del navegador) | Sin scroll horizontal; barra inferior con 3 enlaces visibles; textos legibles | Pendiente | Pendiente | — |
| CP-010 | Navegación con teclado | Recorrer la página con Tab | Foco visible en todos los enlaces y botones; "Saltar al contenido" aparece primero | Pendiente | Pendiente | — |

## Etapa 1 – Versión mínima

| ID | Descripción | Pasos | Resultado esperado | Resultado real | Estado | Fecha |
|----|-------------|-------|--------------------|----------------|--------|-------|
| CP-011 | Búsqueda insensible a mayúsculas | Buscar "arroz", "Arroz" y "ARROZ" | Los tres dan los mismos 4 resultados, ordenados de menor a mayor precio | Pendiente | Pendiente | — |
| CP-012 | Búsqueda sin tildes | Buscar "limon" y "LIMÓN" | Ambos muestran el limón de Frutería La Cosecha | Pendiente | Pendiente | — |
| CP-013 | Contador de resultados | Escribir "arroz" | El contador dice "4 resultados" y se actualiza al escribir | Pendiente | Pendiente | — |
| CP-014 | Estado vacío | Buscar "zzz" | Mensaje con la sugerencia "Prueba con arroz o pan." y botón para limpiar | Pendiente | Pendiente | — |
| CP-015 | Chips de categoría | Tocar el chip "Carnes" | Solo se ven productos de carnes; el chip queda marcado con ✓ | Pendiente | Pendiente | — |
| CP-016 | Filtro por medio de pago | Elegir "tarjeta" con "arroz" | Solo aparece el arroz de Miscelánea La Esquina | Pendiente | Pendiente | — |
| CP-017 | Filtro por barrio | Elegir "Pueblo Nuevo" | Solo productos de Ferretería El Tornillo y Carnicería El Corral | Pendiente | Pendiente | — |
| CP-018 | Filtro "Abierto ahora" | Activar "Abierto ahora" a distintas horas | Solo se ven comercios cuya insignia dice Abierto, según la hora de Bogotá | Pendiente | Pendiente | — |
| CP-019 | Ficha del comercio | Entrar a un comercio desde un resultado | Se ven insignia, horario por día (hoy resaltado), medios de pago, WhatsApp, productos y mapa | Pendiente | Pendiente | — |
| CP-020 | Cómo llegar | Pulsar "Cómo llegar (Google Maps)" en una ficha | Abre Google Maps en otra pestaña con la ruta hacia el comercio | Pendiente | Pendiente | — |
| CP-021 | Mapa general | Abrir `#/mapa` y tocar un pin | Se ven 7 pines; el globo muestra el nombre y el enlace "Ver ficha" lleva a la ficha | Pendiente | Pendiente | — |
| CP-022 | Vista a 360 px | Revisar buscador, ficha y mapa a 360 px | Sin scroll horizontal; chips en una fila deslizable; botones de al menos 44 px | Pendiente | Pendiente | — |
| CP-023 | Sin internet | Abrir `#/mapa` sin conexión | Mensaje "No pudimos cargar el mapa", sin romper el resto de la app | Pendiente | Pendiente | — |

## Etapa 2 – Panel con PIN

| ID | Descripción | Pasos | Resultado esperado | Resultado real | Estado | Fecha |
|----|-------------|-------|--------------------|----------------|--------|-------|
| CP-024 | PIN incorrecto | En `#/panel`, elegir un comercio e ingresar un PIN equivocado | Mensaje "PIN incorrecto…", el campo se limpia y no se entra | Pendiente | Pendiente | — |
| CP-025 | PIN correcto | Elegir Tienda Don Pedro e ingresar 1111 | Se abre "Panel de Tienda Don Pedro" con solo sus 7 productos | Pendiente | Pendiente | — |
| CP-026 | Editar precio del arroz | Editar "Arroz" de Tienda Don Pedro, poner 5000 y guardar | Aviso "Cambios guardados."; en el buscador, "arroz" muestra $ 5.000 para ese comercio | Pendiente | Pendiente | — |
| CP-027 | Crear producto | Pulsar "Agregar producto", llenar los campos y guardar | Aviso "Producto agregado." y el producto aparece en la lista y en el buscador | Pendiente | Pendiente | — |
| CP-028 | Validación del formulario | Guardar el formulario vacío, o con precio con decimales | Mensaje de error claro; no se guarda | Pendiente | Pendiente | — |
| CP-029 | Eliminar con confirmación | Pulsar "Eliminar" y cancelar (o pulsar Escape); luego repetir y confirmar en el diálogo | Se abre un diálogo propio con el foco en "Cancelar"; al cancelar no pasa nada; al confirmar sale "Producto eliminado." y desaparece de la lista | Pendiente | Pendiente | — |
| CP-030 | Cambios persisten | Editar un precio y recargar la página (F5) | El precio nuevo se mantiene en el buscador | Pendiente | Pendiente | — |
| CP-031 | Cerrar sesión | Pulsar "Cerrar sesión" | Vuelve al acceso con PIN; aviso "Sesión cerrada." | Pendiente | Pendiente | — |
| CP-032 | Restablecer | Con cambios hechos, pulsar "Restablecer datos de ejemplo" | El arroz de Tienda Don Pedro vuelve a $ 4.200 y desaparecen los productos creados | Pendiente | Pendiente | — |
| CP-033 | Texto con HTML | Crear un producto llamado `<b>prueba</b>` | Se muestra el texto literal, sin negrita ni código ejecutado | Pendiente | Pendiente | — |

## Etapa 3 – Disponibilidad

| ID | Descripción | Pasos | Resultado esperado | Resultado real | Estado | Fecha |
|----|-------------|-------|--------------------|----------------|--------|-------|
| CP-034 | Tres estados visibles | Buscar productos sin filtro y revisar las insignias | Se ven "✓ Disponible" (verde), "! Pocas unidades" (ámbar) y "✕ Agotado" (coral), siempre con texto | Pendiente | Pendiente | — |
| CP-035 | Estado en la ficha | Abrir la ficha de Tienda Don Pedro | Cada producto muestra su insignia de disponibilidad | Pendiente | Pendiente | — |
| CP-036 | Cambiar estado en el panel | Poner un producto en "Agotado" desde el panel | La insignia cambia en el panel, el buscador y la ficha | Pendiente | Pendiente | — |

## Mejoras visuales

| ID | Descripción | Pasos | Resultado esperado | Resultado real | Estado | Fecha |
|----|-------------|-------|--------------------|----------------|--------|-------|
| CP-037 | Favicon | Abrir el sitio y mirar la pestaña del navegador | Se ve el ícono de pin verde azulado | Pendiente | Pendiente | — |
| CP-038 | Tipografías de Google Fonts | Abrir el inicio con internet | Títulos en Plus Jakarta Sans y texto en Inter; sin internet se usa la tipografía del sistema | Pendiente | Pendiente | — |
| CP-039 | Diálogo de confirmación | Eliminar un producto y restablecer datos | Diálogo centrado con fondo oscuro, botones de al menos 44 px; se cierra con Escape y con clic fuera | Pendiente | Pendiente | — |
