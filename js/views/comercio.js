/*
 * Vista de la ficha de un comercio (#/comercio/ID): horario, medios de pago, contacto,
 * productos, mapa del local y enlace "Cómo llegar" a Google Maps.
 */
(function () {
  'use strict';

  window.CCM = window.CCM || {};
  window.CCM.vistas = window.CCM.vistas || {};

  const TITULO_NO_ENCONTRADO = 'Comercio no encontrado';
  const ZOOM_FICHA = 16;
  const URL_WHATSAPP = 'https://wa.me/';
  const MENSAJE_SIN_MAPA = 'No pudimos cargar el mapa. Revisa tu conexión a internet.';

  function crear(etiqueta, clase, texto) {
    return window.CCM.utils.crearElemento(etiqueta, clase, texto);
  }

  function crearSeccion(titulo) {
    const seccion = crear('section', 'tarjeta seccion-ficha');
    seccion.appendChild(crear('h2', 'subtitulo-seccion', titulo));
    return seccion;
  }

  function crearEnlaceExterno(clase, texto, url) {
    const enlace = crear('a', clase, texto);
    enlace.href = url;
    enlace.target = '_blank';
    enlace.rel = 'noopener noreferrer';
    return enlace;
  }

  function renderizarNoEncontrado(contenedor) {
    contenedor.appendChild(crear('h1', 'titulo-pagina', TITULO_NO_ENCONTRADO));
    const estado = crear('div', 'estado');
    estado.appendChild(crear('p', 'subtitulo', 'No encontramos ese comercio. Puede que el enlace esté incompleto.'));
    const volver = crear('a', 'boton', 'Volver al inicio');
    volver.href = '#/';
    estado.appendChild(volver);
    contenedor.appendChild(estado);
    return TITULO_NO_ENCONTRADO;
  }

  function crearSeccionHorario(comercio, ahora) {
    const seccion = crearSeccion('Horario');
    const lista = crear('ul', 'lista-horario');
    window.CCM.horario.DIAS.forEach(function (dia) {
      const esHoy = dia.codigo === ahora.dia;
      const fila = crear('li', 'fila-horario' + (esHoy ? ' fila-hoy' : ''));
      fila.appendChild(crear('span', '', dia.nombre + (esHoy ? ' (hoy)' : '')));
      fila.appendChild(crear('span', '', window.CCM.horario.textoTramo(comercio.horario[dia.codigo])));
      lista.appendChild(fila);
    });
    seccion.appendChild(lista);
    return seccion;
  }

  function crearSeccionPagos(comercio) {
    const seccion = crearSeccion('Medios de pago');
    const lista = crear('ul', 'etiquetas');
    comercio.medios_pago.forEach(function (medio) {
      lista.appendChild(crear('li', 'etiqueta', medio.charAt(0).toUpperCase() + medio.slice(1)));
    });
    seccion.appendChild(lista);
    return seccion;
  }

  function crearSeccionContacto(comercio) {
    const seccion = crearSeccion('Contacto');
    seccion.appendChild(crear('p', 'tarjeta-detalle', comercio.direccion + ', ' + comercio.barrio));
    const acciones = crear('div', 'acciones');
    const llamar = crear('a', 'boton boton-secundario', 'Llamar: ' + comercio.telefono);
    llamar.href = 'tel:' + comercio.telefono.replace(/\s/g, '');
    acciones.appendChild(llamar);
    acciones.appendChild(crearEnlaceExterno('boton', 'WhatsApp (número de ejemplo)', URL_WHATSAPP + comercio.whatsapp));
    seccion.appendChild(acciones);
    return seccion;
  }

  function crearSeccionProductos(comercio) {
    const seccion = crearSeccion('Productos');
    const propios = window.CCM.store.obtenerProductosDeComercio(comercio.id);
    if (propios.length === 0) {
      seccion.appendChild(crear('p', 'tarjeta-detalle', 'Este comercio aún no tiene productos publicados.'));
      return seccion;
    }
    const lista = crear('ul', 'lista-productos');
    propios.forEach(function (producto) {
      const fila = crear('li', 'fila-producto');
      const descripcion = crear('div');
      descripcion.appendChild(crear('span', '', producto.nombre));
      descripcion.appendChild(crear('span', 'texto-suave', ' · ' + producto.unidad));
      const estado = crear('div', 'fila-meta');
      estado.appendChild(window.CCM.utils.crearInsigniaEstado(producto.estado));
      estado.appendChild(crear('span', 'texto-suave', window.CCM.utils.textoActualizado(producto.actualizado)));
      descripcion.appendChild(estado);
      fila.appendChild(descripcion);
      fila.appendChild(crear('strong', 'precio', window.CCM.utils.formatearPrecio(producto.precio)));
      lista.appendChild(fila);
    });
    seccion.appendChild(lista);
    return seccion;
  }

  function crearSeccionMapa(comercio) {
    const seccion = crearSeccion('Ubicación');
    if (window.CCM.mapaBase.leafletDisponible()) {
      const elementoMapa = crear('div', 'mapa mapa-ficha');
      elementoMapa.setAttribute('role', 'region');
      elementoMapa.setAttribute('aria-label', 'Mapa con la ubicación de ' + comercio.nombre);
      seccion.appendChild(elementoMapa);
      // Leaflet mide el contenedor al crearse, así que debe estar ya en la página.
      return { seccion: seccion, dibujar: function () {
        const mapa = window.CCM.mapaBase.crearMapa(elementoMapa);
        window.CCM.mapaBase.centrarEn(mapa, comercio, ZOOM_FICHA);
        window.CCM.mapaBase.agregarPin(mapa, comercio);
      } };
    }
    seccion.appendChild(crear('p', 'estado', MENSAJE_SIN_MAPA));
    return { seccion: seccion, dibujar: function () {} };
  }

  /**
   * Dibuja la ficha del comercio indicado en la ruta.
   * @param {HTMLElement} contenedor Elemento donde se pinta la vista.
   * @param {{id: string}} parametros Parámetros de la ruta.
   * @returns {string} Título de la página.
   */
  function renderizar(contenedor, parametros) {
    const comercio = window.CCM.store.obtenerComercio(parametros.id);
    if (!comercio) {
      return renderizarNoEncontrado(contenedor);
    }
    const ahora = window.CCM.horario.ahoraEnBogota();

    contenedor.appendChild(crear('h1', 'titulo-pagina', comercio.nombre));
    const resumen = crear('div', 'fila-meta');
    resumen.appendChild(window.CCM.utils.crearInsigniaApertura(window.CCM.horario.estaAbierto(comercio.horario, ahora)));
    resumen.appendChild(crear('span', 'texto-suave', comercio.categoria + ' · ' + comercio.barrio));
    contenedor.appendChild(resumen);
    contenedor.appendChild(crear('p', 'subtitulo', comercio.descripcion));

    const comoLlegar = crearEnlaceExterno('boton boton-ancho', 'Cómo llegar (Google Maps)', window.CCM.mapaBase.urlComoLlegar(comercio));
    contenedor.appendChild(comoLlegar);

    const rejilla = crear('div', 'rejilla-ficha');
    const mapa = crearSeccionMapa(comercio);
    rejilla.appendChild(crearSeccionContacto(comercio));
    rejilla.appendChild(crearSeccionHorario(comercio, ahora));
    rejilla.appendChild(crearSeccionPagos(comercio));
    rejilla.appendChild(crearSeccionProductos(comercio));
    rejilla.appendChild(mapa.seccion);
    contenedor.appendChild(rejilla);
    mapa.dibujar();
    return comercio.nombre;
  }

  window.CCM.vistas.comercio = { renderizar: renderizar };
})();
