/*
 * Utilidades compartidas de Consulta Comercial Malambo.
 * Reúne formato (precios, fechas), normalización de texto y ayudas para construir el DOM sin innerHTML.
 */
(function () {
  'use strict';

  window.CCM = window.CCM || {};

  const MS_POR_MINUTO = 60 * 1000;
  const MINUTOS_POR_HORA = 60;
  const HORAS_POR_DIA = 24;
  const DURACION_AVISO_MS = 3500;

  // Cada estado lleva un símbolo además del color, para no depender solo de él.
  const ESTADOS = {
    disponible: { etiqueta: 'Disponible', simbolo: '✓' },
    pocas_unidades: { etiqueta: 'Pocas unidades', simbolo: '!' },
    agotado: { etiqueta: 'Agotado', simbolo: '✕' }
  };

  const formateadorPrecio = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  });

  /**
   * Crea un elemento con clases y texto opcionales.
   * Usa textContent para que cualquier dato externo quede escapado y no abra la puerta a XSS.
   * @param {string} etiqueta Nombre de la etiqueta HTML.
   * @param {string} [clase] Clases CSS separadas por espacio.
   * @param {string} [texto] Texto plano del elemento.
   * @returns {HTMLElement}
   */
  function crearElemento(etiqueta, clase, texto) {
    const nodo = document.createElement(etiqueta);
    if (clase) {
      nodo.className = clase;
    }
    if (texto !== undefined) {
      nodo.textContent = texto;
    }
    return nodo;
  }

  /**
   * Quita tildes y mayúsculas para comparar textos ("Limón" y "limon" son iguales).
   * @param {string} texto Texto original.
   * @returns {string}
   */
  function normalizarTexto(texto) {
    return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  /**
   * Da formato de pesos colombianos a un valor entero.
   * @param {number} valor Precio en COP.
   * @returns {string} Por ejemplo "$ 4.200".
   */
  function formatearPrecio(valor) {
    return formateadorPrecio.format(valor);
  }

  function pluralizar(cantidad, singular, plural) {
    return cantidad === 1 ? singular : plural;
  }

  /**
   * Convierte una fecha ISO en un texto relativo como "hace 3 h".
   * @param {string} fechaIso Fecha de la última actualización.
   * @param {number} [ahoraMs] Instante de referencia en milisegundos; por defecto, ahora.
   * @returns {string}
   */
  function textoActualizado(fechaIso, ahoraMs) {
    const minutos = Math.floor(((ahoraMs || Date.now()) - new Date(fechaIso).getTime()) / MS_POR_MINUTO);
    if (minutos < 1) {
      return 'Actualizado hace un momento';
    }
    if (minutos < MINUTOS_POR_HORA) {
      return 'Actualizado hace ' + minutos + ' min';
    }
    const horas = Math.floor(minutos / MINUTOS_POR_HORA);
    if (horas < HORAS_POR_DIA) {
      return 'Actualizado hace ' + horas + ' h';
    }
    const dias = Math.floor(horas / HORAS_POR_DIA);
    return 'Actualizado hace ' + dias + ' ' + pluralizar(dias, 'día', 'días');
  }

  /**
   * Devuelve una versión de la función que espera a que pasen `espera` ms sin nuevas llamadas.
   * Evita filtrar en cada tecla mientras la persona sigue escribiendo.
   * @param {function} funcion Función a retrasar.
   * @param {number} espera Milisegundos de espera.
   * @returns {function}
   */
  function retrasar(funcion, espera) {
    let temporizador = null;
    return function () {
      window.clearTimeout(temporizador);
      temporizador = window.setTimeout(funcion, espera);
    };
  }

  /**
   * Crea la insignia Abierto/Cerrado. El estado va en texto y no solo en color.
   * @param {boolean} abierto Si el comercio está abierto ahora.
   * @returns {HTMLElement}
   */
  function crearInsigniaApertura(abierto) {
    return crearElemento(
      'span',
      'insignia ' + (abierto ? 'insignia-abierto' : 'insignia-cerrado'),
      abierto ? 'Abierto' : 'Cerrado'
    );
  }

  /**
   * Crea la insignia de disponibilidad de un producto (texto, símbolo y color).
   * @param {string} estado "disponible", "pocas_unidades" o "agotado".
   * @returns {HTMLElement}
   */
  function crearInsigniaEstado(estado) {
    const datos = ESTADOS[estado];
    return crearElemento('span', 'insignia insignia-' + estado.replace('_', '-'), datos.simbolo + ' ' + datos.etiqueta);
  }

  /**
   * Muestra un aviso breve (toast) que desaparece solo; lo anuncian los lectores de pantalla.
   * @param {string} texto Mensaje para la persona.
   */
  function mostrarAviso(texto) {
    const zona = document.getElementById('avisos');
    const aviso = crearElemento('p', 'aviso-flotante', texto);
    zona.appendChild(aviso);
    window.setTimeout(function () { aviso.remove(); }, DURACION_AVISO_MS);
  }

  window.CCM.utils = {
    ESTADOS: ESTADOS,
    crearElemento: crearElemento,
    normalizarTexto: normalizarTexto,
    formatearPrecio: formatearPrecio,
    textoActualizado: textoActualizado,
    retrasar: retrasar,
    crearInsigniaApertura: crearInsigniaApertura,
    crearInsigniaEstado: crearInsigniaEstado,
    mostrarAviso: mostrarAviso
  };
})();
