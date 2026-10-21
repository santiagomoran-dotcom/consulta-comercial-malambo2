/*
 * Lógica de búsqueda de Consulta Comercial Malambo: filtra productos y los ordena por precio.
 * No toca el DOM, para poder razonar sobre ella (y probarla) sin la interfaz.
 */
(function () {
  'use strict';

  window.CCM = window.CCM || {};

  const MEDIOS_PAGO = ['efectivo', 'Nequi', 'Daviplata', 'tarjeta', 'transferencia'];

  function ordenarTextos(textos) {
    return textos.slice().sort(function (a, b) { return a.localeCompare(b, 'es'); });
  }

  function sinRepetidos(valores) {
    return Array.from(new Set(valores));
  }

  /**
   * Obtiene las categorías de producto y los barrios disponibles para los filtros.
   * @param {{comercios: Array, productos: Array}} datos Datos vigentes.
   * @returns {{categorias: string[], barrios: string[]}}
   */
  function opcionesDeFiltro(datos) {
    return {
      categorias: ordenarTextos(sinRepetidos(datos.productos.map(function (p) { return p.categoria; }))),
      barrios: ordenarTextos(sinRepetidos(datos.comercios.map(function (c) { return c.barrio; })))
    };
  }

  function coincideTexto(producto, textoNormalizado) {
    return textoNormalizado === '' ||
      window.CCM.utils.normalizarTexto(producto.nombre).indexOf(textoNormalizado) !== -1;
  }

  function coincideComercio(comercio, abierto, filtros) {
    return (filtros.medioPago === '' || comercio.medios_pago.indexOf(filtros.medioPago) !== -1) &&
      (filtros.barrio === '' || comercio.barrio === filtros.barrio) &&
      (!filtros.soloAbiertos || abierto);
  }

  /**
   * Filtra los productos y los devuelve del más barato al más caro.
   * @param {{comercios: Array, productos: Array}} datos Datos vigentes.
   * @param {{texto: string, categoria: string, medioPago: string, barrio: string, soloAbiertos: boolean}} filtros
   *   Filtros activos; las cadenas vacías significan "sin filtro".
   * @param {{dia: string, minutos: number}} ahora Hora actual en Bogotá.
   * @returns {Array<{producto: Object, comercio: Object, abierto: boolean}>}
   */
  function buscarProductos(datos, filtros, ahora) {
    const textoNormalizado = window.CCM.utils.normalizarTexto(filtros.texto);
    const comercios = {};
    datos.comercios.forEach(function (comercio) {
      comercios[comercio.id] = {
        comercio: comercio,
        abierto: window.CCM.horario.estaAbierto(comercio.horario, ahora)
      };
    });

    return datos.productos
      .filter(function (producto) {
        const info = comercios[producto.comercio_id];
        return coincideTexto(producto, textoNormalizado) &&
          (filtros.categoria === '' || producto.categoria === filtros.categoria) &&
          coincideComercio(info.comercio, info.abierto, filtros);
      })
      .map(function (producto) {
        const info = comercios[producto.comercio_id];
        return { producto: producto, comercio: info.comercio, abierto: info.abierto };
      })
      .sort(function (a, b) {
        return a.producto.precio - b.producto.precio ||
          a.comercio.nombre.localeCompare(b.comercio.nombre, 'es');
      });
  }

  window.CCM.busqueda = {
    MEDIOS_PAGO: MEDIOS_PAGO,
    opcionesDeFiltro: opcionesDeFiltro,
    buscarProductos: buscarProductos
  };
})();
