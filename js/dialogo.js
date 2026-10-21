/*
 * Diálogo de confirmación propio de Consulta Comercial Malambo, basado en el elemento <dialog>.
 * Reemplaza a window.confirm: se ve acorde al sitio, atrapa el foco y se cierra con Escape.
 */
(function () {
  'use strict';

  window.CCM = window.CCM || {};

  /**
   * Pide una confirmación a la persona antes de una acción delicada.
   * @param {{titulo: string, mensaje: string, textoConfirmar: string, peligro: boolean}} opciones
   *   Textos del diálogo; `peligro` pinta el botón de confirmar como acción destructiva.
   * @returns {Promise<boolean>} true si confirmó; false si canceló, pulsó Escape o hizo clic fuera.
   */
  function confirmar(opciones) {
    const crear = window.CCM.utils.crearElemento;
    const dialogo = crear('dialog', 'dialogo');
    // Sin soporte de <dialog> (navegadores muy viejos) se usa el confirm nativo.
    if (typeof dialogo.showModal !== 'function') {
      return Promise.resolve(window.confirm(opciones.titulo + ' ' + opciones.mensaje));
    }

    return new Promise(function (resolver) {
      let terminado = false;

      // Se resuelve y se retira el diálogo en el acto, sin esperar al evento "close" del navegador.
      function terminar(confirmado) {
        if (terminado) {
          return;
        }
        terminado = true;
        dialogo.close();
        dialogo.remove();
        resolver(confirmado);
      }

      const icono = crear('div', 'dialogo-icono' + (opciones.peligro ? ' dialogo-icono-peligro' : ''), '!');
      icono.setAttribute('aria-hidden', 'true');
      const titulo = crear('h2', 'dialogo-titulo', opciones.titulo);
      titulo.id = 'dialogo-titulo';
      const mensaje = crear('p', 'dialogo-mensaje', opciones.mensaje);
      mensaje.id = 'dialogo-mensaje';
      dialogo.setAttribute('aria-labelledby', titulo.id);
      dialogo.setAttribute('aria-describedby', mensaje.id);

      const acciones = crear('div', 'acciones dialogo-acciones');
      // El foco inicial va en Cancelar: así un Enter distraído no ejecuta la acción destructiva.
      const cancelar = crear('button', 'boton boton-secundario', 'Cancelar');
      cancelar.type = 'button';
      cancelar.autofocus = true;
      cancelar.addEventListener('click', function () { terminar(false); });
      const aceptar = crear('button', 'boton' + (opciones.peligro ? ' boton-alerta' : ''), opciones.textoConfirmar);
      aceptar.type = 'button';
      aceptar.addEventListener('click', function () { terminar(true); });
      acciones.appendChild(cancelar);
      acciones.appendChild(aceptar);

      dialogo.appendChild(icono);
      dialogo.appendChild(titulo);
      dialogo.appendChild(mensaje);
      dialogo.appendChild(acciones);

      // Un clic sobre el fondo oscuro llega al propio <dialog>, no a su contenido.
      dialogo.addEventListener('click', function (evento) {
        if (evento.target === dialogo) {
          terminar(false);
        }
      });
      // Escape cierra el diálogo por su cuenta: se trata como cancelar.
      dialogo.addEventListener('close', function () { terminar(false); });

      document.body.appendChild(dialogo);
      dialogo.showModal();
    });
  }

  window.CCM.dialogo = { confirmar: confirmar };
})();
