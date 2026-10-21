/*
 * Enrutador por hash de Consulta Comercial Malambo (#/, #/comercio/ID, #/mapa, #/panel).
 * Se usa el hash porque funciona igual con file:// y en Vercel, sin configurar rutas en el servidor.
 */
(function () {
  'use strict';

  window.CCM = window.CCM || {};

  const RUTA_INICIO = '/';
  const SUFIJO_TITULO = ' · Consulta Comercial Malambo';
  const MENSAJE_ERROR_VISTA = 'No pudimos cargar esta pantalla. Intenta de nuevo o vuelve al inicio.';

  const rutas = [];
  const limpiezas = [];
  let contenedor = null;
  let enlacesNavegacion = [];

  /** Convierte un patrón como "/comercio/:id" en una expresión regular con sus nombres de parámetros. */
  function compilarPatron(patron) {
    const nombres = [];
    const fuente = patron.replace(/:([a-z]+)/g, function (coincidencia, nombre) {
      nombres.push(nombre);
      return '([^/]+)';
    });
    return { expresion: new RegExp('^' + fuente + '$'), nombres: nombres };
  }

  /**
   * Registra una ruta.
   * @param {string} patron Ruta sin el "#", por ejemplo "/comercio/:id".
   * @param {function(HTMLElement, Object): string} manejador Dibuja la vista y devuelve el título de la página.
   * @param {string} seccionNav Valor de data-ruta del enlace de navegación que debe quedar activo.
   */
  function registrar(patron, manejador, seccionNav) {
    const compilado = compilarPatron(patron);
    rutas.push({
      expresion: compilado.expresion,
      nombres: compilado.nombres,
      manejador: manejador,
      seccionNav: seccionNav
    });
  }

  function rutaActual() {
    const hash = window.location.hash.replace(/^#/, '');
    return hash === '' ? RUTA_INICIO : hash;
  }

  /** Busca la ruta que coincide y extrae sus parámetros ya decodificados. */
  function resolver(ruta) {
    for (let i = 0; i < rutas.length; i += 1) {
      const coincidencia = rutas[i].expresion.exec(ruta);
      if (coincidencia) {
        const parametros = {};
        rutas[i].nombres.forEach(function (nombre, indice) {
          parametros[nombre] = decodeURIComponent(coincidencia[indice + 1]);
        });
        return { definicion: rutas[i], parametros: parametros };
      }
    }
    return null;
  }

  function marcarNavegacion(seccionNav) {
    enlacesNavegacion.forEach(function (enlace) {
      if (enlace.dataset.ruta === seccionNav) {
        enlace.setAttribute('aria-current', 'page');
      } else {
        enlace.removeAttribute('aria-current');
      }
    });
  }

  /** Lleva el foco al título de la vista para que lectores de pantalla anuncien el cambio. */
  function enfocarTitulo() {
    const titulo = contenedor.querySelector('h1');
    const objetivo = titulo || contenedor;
    objetivo.setAttribute('tabindex', '-1');
    objetivo.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function mostrarError() {
    contenedor.replaceChildren();
    const aviso = document.createElement('p');
    aviso.className = 'estado estado-error';
    aviso.setAttribute('role', 'alert');
    aviso.textContent = MENSAJE_ERROR_VISTA;
    contenedor.appendChild(aviso);
  }

  /**
   * Registra una función que se ejecuta una sola vez antes de la siguiente navegación.
   * Sirve para liberar recursos de una vista (mapas de Leaflet, temporizadores).
   * @param {function(): void} limpieza Función de limpieza.
   */
  function alDescartar(limpieza) {
    limpiezas.push(limpieza);
  }

  function ejecutarLimpiezas() {
    while (limpiezas.length > 0) {
      limpiezas.pop()();
    }
  }

  /** Dibuja la vista que corresponde al hash actual. */
  function navegar() {
    ejecutarLimpiezas();
    const resultado = resolver(rutaActual());
    if (!resultado) {
      window.location.replace('#' + RUTA_INICIO);
      return;
    }
    contenedor.replaceChildren();
    try {
      const titulo = resultado.definicion.manejador(contenedor, resultado.parametros);
      document.title = titulo + SUFIJO_TITULO;
    } catch (error) {
      mostrarError();
      document.title = 'Error' + SUFIJO_TITULO;
    }
    marcarNavegacion(resultado.definicion.seccionNav);
    enfocarTitulo();
  }

  /**
   * Arranca el enrutador y dibuja la ruta inicial.
   * @param {HTMLElement} elementoContenido Contenedor donde se pintan las vistas.
   * @param {NodeList|Array} enlaces Enlaces de la navegación principal (con data-ruta).
   */
  function iniciar(elementoContenido, enlaces) {
    contenedor = elementoContenido;
    enlacesNavegacion = Array.prototype.slice.call(enlaces);
    window.addEventListener('hashchange', navegar);
    navegar();
  }

  window.CCM.router = {
    registrar: registrar,
    iniciar: iniciar,
    recargar: navegar,
    alDescartar: alDescartar
  };
})();
