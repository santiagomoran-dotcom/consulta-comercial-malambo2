/*
 * Utilidades de mapa sobre Leaflet, compartidas por la ficha y el mapa general.
 * Si Leaflet no cargó (sin internet), las vistas muestran un aviso en lugar de romperse.
 */
(function () {
  'use strict';

  window.CCM = window.CCM || {};

  // Mosaicos de Esri World Street Map (sin llave de API). Se evitó tile.openstreetmap.org porque responde
  // "403 Access blocked" cuando la petición no trae Referer, algo habitual al abrir con file://.
  const URL_TESELAS = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
  const ATRIBUCION = 'Mapa &copy; <a href="https://www.esri.com">Esri</a>, HERE, Garmin y colaboradores de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  const ZOOM_MAXIMO = 19;
  const MARGEN_AJUSTE = [32, 32];
  const URL_COMO_LLEGAR = 'https://www.google.com/maps/dir/?api=1&destination=';

  /** @returns {boolean} true si la biblioteca Leaflet está disponible. */
  function leafletDisponible() {
    return typeof window.L !== 'undefined';
  }

  /**
   * Crea un mapa dentro del elemento y lo libera al cambiar de pantalla.
   * @param {HTMLElement} elemento Contenedor con altura definida.
   * @returns {Object} Mapa de Leaflet.
   */
  function crearMapa(elemento) {
    const mapa = window.L.map(elemento);
    window.L.tileLayer(URL_TESELAS, { maxZoom: ZOOM_MAXIMO, attribution: ATRIBUCION }).addTo(mapa);
    window.CCM.router.alDescartar(function () { mapa.remove(); });
    return mapa;
  }

  /**
   * Enlace de Google Maps con la ruta hacia el comercio.
   * @param {{lat: number, lng: number}} comercio Comercio de destino.
   * @returns {string}
   */
  function urlComoLlegar(comercio) {
    return URL_COMO_LLEGAR + comercio.lat + ',' + comercio.lng;
  }

  /**
   * Centra el mapa en un solo comercio.
   * @param {Object} mapa Mapa de Leaflet.
   * @param {{lat: number, lng: number}} comercio Comercio a mostrar.
   * @param {number} zoom Nivel de acercamiento.
   */
  function centrarEn(mapa, comercio, zoom) {
    mapa.setView([comercio.lat, comercio.lng], zoom);
  }

  /**
   * Ajusta el mapa para que se vean todos los comercios.
   * @param {Object} mapa Mapa de Leaflet.
   * @param {Array<{lat: number, lng: number}>} comercios Comercios a encuadrar.
   */
  function encuadrar(mapa, comercios) {
    const puntos = comercios.map(function (c) { return [c.lat, c.lng]; });
    mapa.fitBounds(puntos, { padding: MARGEN_AJUSTE });
  }

  /**
   * Agrega un pin; si se pasa `globo`, se abre al tocarlo.
   * @param {Object} mapa Mapa de Leaflet.
   * @param {{lat: number, lng: number, nombre: string}} comercio Comercio del pin.
   * @param {HTMLElement} [globo] Contenido del globo (nodo DOM, no HTML en texto).
   */
  function agregarPin(mapa, comercio, globo) {
    const marcador = window.L.marker([comercio.lat, comercio.lng], { title: comercio.nombre, alt: comercio.nombre }).addTo(mapa);
    if (globo) {
      marcador.bindPopup(globo);
    }
  }

  window.CCM.mapaBase = {
    leafletDisponible: leafletDisponible,
    crearMapa: crearMapa,
    urlComoLlegar: urlComoLlegar,
    centrarEn: centrarEn,
    encuadrar: encuadrar,
    agregarPin: agregarPin
  };
})();
