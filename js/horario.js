/*
 * Lógica de horarios de los comercios: hora actual en Bogotá y estado Abierto/Cerrado.
 * Se usa la zona America/Bogota (y no la del dispositivo) para que "Abierto ahora" sea correcto
 * aunque quien consulta esté en otra zona horaria.
 */
(function () {
  'use strict';

  window.CCM = window.CCM || {};

  const ZONA_HORARIA = 'America/Bogota';
  const MINUTOS_POR_HORA = 60;
  const CODIGOS_DIA = { Mon: 'lun', Tue: 'mar', Wed: 'mie', Thu: 'jue', Fri: 'vie', Sat: 'sab', Sun: 'dom' };
  const DIAS = [
    { codigo: 'lun', nombre: 'Lunes' },
    { codigo: 'mar', nombre: 'Martes' },
    { codigo: 'mie', nombre: 'Miércoles' },
    { codigo: 'jue', nombre: 'Jueves' },
    { codigo: 'vie', nombre: 'Viernes' },
    { codigo: 'sab', nombre: 'Sábado' },
    { codigo: 'dom', nombre: 'Domingo' }
  ];

  // hourCycle h23 evita el "24:00" que algunos navegadores devuelven a medianoche.
  const formateadorBogota = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONA_HORARIA,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  });

  function aMinutos(hora) {
    const partes = hora.split(':');
    return Number(partes[0]) * MINUTOS_POR_HORA + Number(partes[1]);
  }

  /**
   * Devuelve el día y la hora actuales en Bogotá.
   * @param {Date} [fecha] Instante a convertir; por defecto, ahora.
   * @returns {{dia: string, minutos: number}} Código de día (lun a dom) y minutos desde la medianoche.
   */
  function ahoraEnBogota(fecha) {
    const partes = {};
    formateadorBogota.formatToParts(fecha || new Date()).forEach(function (parte) {
      partes[parte.type] = parte.value;
    });
    return {
      dia: CODIGOS_DIA[partes.weekday],
      minutos: Number(partes.hour) * MINUTOS_POR_HORA + Number(partes.minute)
    };
  }

  /**
   * Indica si un comercio está abierto en el momento dado.
   * @param {Object} horario Horario por día (abre/cierra o cerrado).
   * @param {{dia: string, minutos: number}} ahora Resultado de ahoraEnBogota.
   * @returns {boolean}
   */
  function estaAbierto(horario, ahora) {
    const tramo = horario[ahora.dia];
    if (!tramo || tramo.cerrado) {
      return false;
    }
    return ahora.minutos >= aMinutos(tramo.abre) && ahora.minutos < aMinutos(tramo.cierra);
  }

  function formatearHora(hora) {
    const minutos = aMinutos(hora);
    const fecha = new Date(2000, 0, 1, Math.floor(minutos / MINUTOS_POR_HORA), minutos % MINUTOS_POR_HORA);
    return fecha.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
  }

  /**
   * Describe el horario de un día en texto legible.
   * @param {{abre?: string, cierra?: string, cerrado?: boolean}} tramo Horario del día.
   * @returns {string} Por ejemplo "6:00 a. m. – 9:00 p. m." o "Cerrado".
   */
  function textoTramo(tramo) {
    if (!tramo || tramo.cerrado) {
      return 'Cerrado';
    }
    return formatearHora(tramo.abre) + ' – ' + formatearHora(tramo.cierra);
  }

  window.CCM.horario = {
    DIAS: DIAS,
    ahoraEnBogota: ahoraEnBogota,
    estaAbierto: estaAbierto,
    textoTramo: textoTramo
  };
})();
