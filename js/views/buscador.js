/*
 * Vista de inicio (#/): buscador de productos con chips de categoría y filtros.
 * Dibuja los controles una sola vez y solo actualiza la lista, para no perder el foco al escribir.
 */
(function () {
  'use strict';

  window.CCM = window.CCM || {};
  window.CCM.vistas = window.CCM.vistas || {};

  const TITULO_PAGINA = 'Inicio';
  const ESPERA_BUSQUEDA_MS = 200;
  // Los datos son locales y cargan al instante; esta pausa corta deja ver el esqueleto de carga.
  const DURACION_ESQUELETO_MS = 250;
  const TARJETAS_ESQUELETO = 4;
  const SUGERENCIA_VACIO = 'Prueba con arroz o pan.';

  const FILTROS_INICIALES = { texto: '', categoria: '', medioPago: '', barrio: '', soloAbiertos: false };

  // Se conserva entre visitas para que al volver de una ficha la búsqueda siga igual.
  let filtros = Object.assign({}, FILTROS_INICIALES);
  let esqueletoYaMostrado = false;

  function crear(etiqueta, clase, texto) {
    return window.CCM.utils.crearElemento(etiqueta, clase, texto);
  }

  function crearTarjetaResultado(resultado) {
    const utils = window.CCM.utils;
    const item = crear('li', 'tarjeta');

    const fila = crear('div', 'fila-precio');
    fila.appendChild(crear('h2', 'tarjeta-titulo', resultado.producto.nombre));
    fila.appendChild(crear('p', 'precio', utils.formatearPrecio(resultado.producto.precio)));
    item.appendChild(fila);

    item.appendChild(crear('p', 'tarjeta-detalle', 'Por ' + resultado.producto.unidad));

    const enlace = crear('a', 'enlace', resultado.comercio.nombre);
    enlace.href = '#/comercio/' + encodeURIComponent(resultado.comercio.id);
    const lugar = crear('p', 'tarjeta-detalle');
    lugar.appendChild(enlace);
    lugar.appendChild(document.createTextNode(' · ' + resultado.comercio.barrio));
    item.appendChild(lugar);

    const pie = crear('div', 'fila-meta');
    pie.appendChild(utils.crearInsigniaEstado(resultado.producto.estado));
    pie.appendChild(utils.crearInsigniaApertura(resultado.abierto));
    pie.appendChild(crear('span', 'texto-suave', utils.textoActualizado(resultado.producto.actualizado)));
    item.appendChild(pie);
    return item;
  }

  function crearEsqueleto() {
    const lista = crear('ul', 'lista-tarjetas');
    for (let i = 0; i < TARJETAS_ESQUELETO; i += 1) {
      const item = crear('li', 'tarjeta esqueleto');
      item.setAttribute('aria-hidden', 'true');
      lista.appendChild(item);
    }
    return lista;
  }

  function crearEstadoVacio() {
    const estado = crear('div', 'estado');
    const mensaje = filtros.texto.trim() === ''
      ? 'No hay productos con esos filtros. Quita alguno para ver más resultados.'
      : 'No encontramos «' + filtros.texto.trim() + '». ' + SUGERENCIA_VACIO;
    estado.appendChild(crear('p', 'subtitulo', mensaje));
    const boton = crear('button', 'boton boton-secundario', 'Limpiar búsqueda y filtros');
    boton.type = 'button';
    boton.addEventListener('click', function () {
      filtros = Object.assign({}, FILTROS_INICIALES);
      window.CCM.router.recargar();
    });
    estado.appendChild(boton);
    return estado;
  }

  function textoContador(cantidad) {
    return cantidad === 1 ? '1 resultado' : cantidad + ' resultados';
  }

  function crearChip(texto, valor, alElegir) {
    const chip = crear('button', 'chip', texto);
    chip.type = 'button';
    chip.dataset.valor = valor;
    chip.setAttribute('aria-pressed', String(filtros.categoria === valor));
    chip.addEventListener('click', function () {
      alElegir(valor);
    });
    return chip;
  }

  function crearCampoSelect(id, etiqueta, opciones, valorActual, alCambiar) {
    const grupo = crear('div', 'campo-grupo');
    const rotulo = crear('label', 'rotulo', etiqueta);
    rotulo.htmlFor = id;
    const select = crear('select', 'campo');
    select.id = id;
    const todas = crear('option', '', 'Todos');
    todas.value = '';
    select.appendChild(todas);
    opciones.forEach(function (opcion) {
      const nodo = crear('option', '', opcion);
      nodo.value = opcion;
      select.appendChild(nodo);
    });
    select.value = valorActual;
    select.addEventListener('change', function () {
      alCambiar(select.value);
    });
    grupo.appendChild(rotulo);
    grupo.appendChild(select);
    return grupo;
  }

  function crearInterruptorAbierto(alCambiar) {
    const rotulo = crear('label', 'interruptor');
    const casilla = crear('input');
    casilla.type = 'checkbox';
    casilla.checked = filtros.soloAbiertos;
    casilla.addEventListener('change', function () {
      alCambiar(casilla.checked);
    });
    rotulo.appendChild(casilla);
    rotulo.appendChild(crear('span', '', 'Abierto ahora'));
    return rotulo;
  }

  /**
   * Dibuja el buscador.
   * @param {HTMLElement} contenedor Elemento donde se pinta la vista.
   * @returns {string} Título de la página.
   */
  function renderizar(contenedor) {
    const datos = window.CCM.store.obtenerDatos();
    const opciones = window.CCM.busqueda.opcionesDeFiltro(datos);

    const contador = crear('p', 'contador');
    contador.setAttribute('role', 'status');
    const resultados = crear('div');

    function actualizarResultados() {
      const encontrados = window.CCM.busqueda.buscarProductos(
        datos,
        filtros,
        window.CCM.horario.ahoraEnBogota()
      );
      contador.textContent = textoContador(encontrados.length);
      resultados.replaceChildren();
      resultados.removeAttribute('aria-busy');
      if (encontrados.length === 0) {
        resultados.appendChild(crearEstadoVacio());
        return;
      }
      const lista = crear('ul', 'lista-tarjetas');
      encontrados.forEach(function (resultado) {
        lista.appendChild(crearTarjetaResultado(resultado));
      });
      resultados.appendChild(lista);
    }

    const chips = crear('div', 'chips');
    chips.setAttribute('role', 'group');
    chips.setAttribute('aria-label', 'Categorías de producto');

    function elegirCategoria(valor) {
      filtros.categoria = valor;
      Array.prototype.forEach.call(chips.children, function (chip) {
        chip.setAttribute('aria-pressed', String(chip.dataset.valor === valor));
      });
      actualizarResultados();
    }

    chips.appendChild(crearChip('Todas', '', elegirCategoria));
    opciones.categorias.forEach(function (categoria) {
      chips.appendChild(crearChip(categoria, categoria, elegirCategoria));
    });

    const formulario = crear('form', 'formulario-hero');
    formulario.setAttribute('role', 'search');
    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
    });

    const etiquetaBusqueda = crear('label', 'solo-lectores', 'Buscar producto');
    etiquetaBusqueda.htmlFor = 'busqueda-texto';
    const entrada = crear('input', 'campo campo-busqueda');
    entrada.id = 'busqueda-texto';
    entrada.type = 'search';
    entrada.placeholder = 'Busca: arroz, pan…';
    entrada.autocomplete = 'off';
    entrada.value = filtros.texto;
    const buscarConEspera = window.CCM.utils.retrasar(function () {
      filtros.texto = entrada.value;
      actualizarResultados();
    }, ESPERA_BUSQUEDA_MS);
    entrada.addEventListener('input', buscarConEspera);

    const panelFiltros = crear('div', 'panel-filtros');
    panelFiltros.appendChild(crearCampoSelect('filtro-pago', 'Medio de pago', window.CCM.busqueda.MEDIOS_PAGO, filtros.medioPago, function (valor) {
      filtros.medioPago = valor;
      actualizarResultados();
    }));
    panelFiltros.appendChild(crearCampoSelect('filtro-barrio', 'Barrio', opciones.barrios, filtros.barrio, function (valor) {
      filtros.barrio = valor;
      actualizarResultados();
    }));
    panelFiltros.appendChild(crearInterruptorAbierto(function (marcado) {
      filtros.soloAbiertos = marcado;
      actualizarResultados();
    }));

    formulario.appendChild(etiquetaBusqueda);
    formulario.appendChild(entrada);

    const filtrosCaja = crear('section', 'tarjeta formulario-busqueda');
    filtrosCaja.setAttribute('aria-label', 'Filtros de búsqueda');
    filtrosCaja.appendChild(chips);
    filtrosCaja.appendChild(panelFiltros);

    const portada = crear('section', 'hero');
    portada.appendChild(crear('h1', 'titulo-pagina', '¿Qué estás buscando en Malambo?'));
    portada.appendChild(crear('p', 'subtitulo', 'Compara precios, ubicación y medios de pago de los comercios del municipio.'));
    portada.appendChild(formulario);

    contenedor.appendChild(portada);
    contenedor.appendChild(filtrosCaja);
    contenedor.appendChild(contador);
    contenedor.appendChild(resultados);

    if (esqueletoYaMostrado) {
      actualizarResultados();
    } else {
      esqueletoYaMostrado = true;
      resultados.setAttribute('aria-busy', 'true');
      resultados.appendChild(crearEsqueleto());
      const temporizador = window.setTimeout(actualizarResultados, DURACION_ESQUELETO_MS);
      window.CCM.router.alDescartar(function () { window.clearTimeout(temporizador); });
    }
    return TITULO_PAGINA;
  }

  window.CCM.vistas.buscador = { renderizar: renderizar };
})();
