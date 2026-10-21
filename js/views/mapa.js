/*
 * Vista del mapa general (#/mapa): un pin por comercio, con un globo que enlaza a su ficha.
 */
(function () {
  'use strict';

  window.CCM = window.CCM || {};
  window.CCM.vistas = window.CCM.vistas || {};

  const TITULO_PAGINA = 'Mapa';
  const MENSAJE_SIN_MAPA = 'No pudimos cargar el mapa. Revisa tu conexión a internet.';

  function crear(etiqueta, clase, texto) {
    return window.CCM.utils.crearElemento(etiqueta, clase, texto);
  }

  /** Construye el globo como nodo DOM para que el nombre del comercio quede escapado. */
  function crearGlobo(comercio) {
    const globo = crear('div', 'globo');
    globo.appendChild(crear('strong', 'globo-titulo', comercio.nombre));
    globo.appendChild(crear('p', 'globo-detalle', comercio.categoria + ' · ' + comercio.barrio));
    const enlace = crear('a', 'enlace', 'Ver ficha');
    enlace.href = '#/comercio/' + encodeURIComponent(comercio.id);
    globo.appendChild(enlace);
    return globo;
  }

  /**
   * Dibuja la pantalla del mapa general.
   * @param {HTMLElement} contenedor Elemento donde se pinta la vista.
   * @returns {string} Título de la página.
   */
  function renderizar(contenedor) {
    contenedor.appendChild(crear('h1', 'titulo-pagina', 'Mapa de comercios'));
    contenedor.appendChild(crear('p', 'subtitulo', 'Toca un pin para ver el comercio y entrar a su ficha.'));

    if (!window.CCM.mapaBase.leafletDisponible()) {
      contenedor.appendChild(crear('p', 'estado', MENSAJE_SIN_MAPA));
      return TITULO_PAGINA;
    }

    const elementoMapa = crear('div', 'mapa mapa-general');
    elementoMapa.setAttribute('role', 'region');
    elementoMapa.setAttribute('aria-label', 'Mapa con todos los comercios');
    contenedor.appendChild(elementoMapa);

    const comercios = window.CCM.store.obtenerDatos().comercios;
    const mapa = window.CCM.mapaBase.crearMapa(elementoMapa);
    comercios.forEach(function (comercio) {
      window.CCM.mapaBase.agregarPin(mapa, comercio, crearGlobo(comercio));
    });
    window.CCM.mapaBase.encuadrar(mapa, comercios);
    return TITULO_PAGINA;
  }

  window.CCM.vistas.mapa = { renderizar: renderizar };
})();
