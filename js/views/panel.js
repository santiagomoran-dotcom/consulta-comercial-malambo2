/*
 * Vista del panel del comercio (#/panel): acceso con PIN y gestión de los productos propios.
 * La sesión vive solo en memoria (se cierra al recargar) y el PIN nunca se guarda.
 */
(function () {
  'use strict';

  window.CCM = window.CCM || {};
  window.CCM.vistas = window.CCM.vistas || {};

  const TITULO_PAGINA = 'Panel del comercio';
  const LONGITUD_PIN = 4;
  const LONGITUD_MAXIMA_TEXTO = 60;
  const MENSAJE_PIN_INCORRECTO = 'PIN incorrecto. Revisa los 4 dígitos e inténtalo de nuevo.';
  const MENSAJE_SIN_GUARDAR = 'No se pudo guardar en este navegador: el cambio durará solo mientras esta pestaña siga abierta.';
  const NUEVO = 'nuevo';

  // Estado de la vista: comercio con sesión abierta y producto en edición (id, NUEVO o null).
  let comercioActivoId = null;
  let productoEnEdicion = null;

  function crear(etiqueta, clase, texto) {
    return window.CCM.utils.crearElemento(etiqueta, clase, texto);
  }

  function crearGrupoCampo(id, etiqueta, control) {
    const grupo = crear('div', 'campo-grupo');
    const rotulo = crear('label', 'rotulo', etiqueta);
    rotulo.htmlFor = id;
    control.id = id;
    grupo.appendChild(rotulo);
    grupo.appendChild(control);
    return grupo;
  }

  function crearEntradaTexto(valor, maximo) {
    const entrada = crear('input', 'campo');
    entrada.type = 'text';
    entrada.maxLength = maximo;
    entrada.value = valor;
    entrada.autocomplete = 'off';
    return entrada;
  }

  function avisarResultado(persistido, mensaje) {
    window.CCM.utils.mostrarAviso(persistido ? mensaje : MENSAJE_SIN_GUARDAR);
  }

  /* ---------- Acceso con PIN ---------- */

  function crearFormularioAcceso() {
    const datos = window.CCM.store.obtenerDatos();
    const formulario = crear('form', 'tarjeta formulario-panel');
    formulario.noValidate = true;

    const selector = crear('select', 'campo');
    datos.comercios.forEach(function (comercio) {
      const opcion = crear('option', '', comercio.nombre);
      opcion.value = comercio.id;
      selector.appendChild(opcion);
    });

    const entradaPin = crear('input', 'campo');
    entradaPin.type = 'password';
    entradaPin.inputMode = 'numeric';
    entradaPin.maxLength = LONGITUD_PIN;
    entradaPin.autocomplete = 'off';

    const error = crear('p', 'mensaje-error');
    error.setAttribute('role', 'alert');

    const boton = crear('button', 'boton', 'Entrar');
    boton.type = 'submit';

    formulario.appendChild(crearGrupoCampo('panel-comercio', 'Comercio', selector));
    formulario.appendChild(crearGrupoCampo('panel-pin', 'PIN de 4 dígitos', entradaPin));
    formulario.appendChild(error);
    formulario.appendChild(boton);
    formulario.appendChild(crear('p', 'texto-suave', 'Los PIN son de ejemplo y están en el README del proyecto.'));

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      if (window.CCM.store.pinCorrecto(selector.value, entradaPin.value)) {
        comercioActivoId = selector.value;
        productoEnEdicion = null;
        window.CCM.router.recargar();
        return;
      }
      error.textContent = MENSAJE_PIN_INCORRECTO;
      entradaPin.value = '';
      entradaPin.setAttribute('aria-invalid', 'true');
      entradaPin.focus();
    });
    return formulario;
  }

  /* ---------- Formulario de producto ---------- */

  function leerCampos(controles) {
    return {
      nombre: controles.nombre.value.trim(),
      categoria: controles.categoria.value.trim(),
      precio: Number(controles.precio.value),
      unidad: controles.unidad.value.trim(),
      estado: controles.estado.value
    };
  }

  /** @returns {string} Mensaje de error, o cadena vacía si los datos son válidos. */
  function validarCampos(campos, textoPrecio) {
    if (campos.nombre === '' || campos.categoria === '' || campos.unidad === '') {
      return 'Completa el nombre, la categoría y la unidad.';
    }
    if (textoPrecio.trim() === '' || !Number.isInteger(campos.precio) || campos.precio < 0) {
      return 'El precio debe ser un número entero en pesos, sin puntos ni decimales.';
    }
    return '';
  }

  function crearFormularioProducto(producto) {
    const datos = window.CCM.store.obtenerDatos();
    const esNuevo = producto === null;
    const formulario = crear('form', 'tarjeta formulario-panel');
    formulario.noValidate = true;
    formulario.appendChild(crear('h2', 'subtitulo-seccion', esNuevo ? 'Nuevo producto' : 'Editar producto'));

    const controles = {
      nombre: crearEntradaTexto(esNuevo ? '' : producto.nombre, LONGITUD_MAXIMA_TEXTO),
      categoria: crearEntradaTexto(esNuevo ? '' : producto.categoria, LONGITUD_MAXIMA_TEXTO),
      precio: crear('input', 'campo'),
      unidad: crearEntradaTexto(esNuevo ? '' : producto.unidad, LONGITUD_MAXIMA_TEXTO),
      estado: crear('select', 'campo')
    };

    controles.categoria.setAttribute('list', 'panel-categorias');
    const sugerencias = crear('datalist');
    sugerencias.id = 'panel-categorias';
    window.CCM.busqueda.opcionesDeFiltro(datos).categorias.forEach(function (categoria) {
      const opcion = crear('option');
      opcion.value = categoria;
      sugerencias.appendChild(opcion);
    });

    controles.precio.type = 'number';
    controles.precio.min = '0';
    controles.precio.step = '1';
    controles.precio.inputMode = 'numeric';
    controles.precio.value = esNuevo ? '' : String(producto.precio);

    window.CCM.store.ESTADOS_PRODUCTO.forEach(function (estado) {
      const opcion = crear('option', '', window.CCM.utils.ESTADOS[estado].etiqueta);
      opcion.value = estado;
      controles.estado.appendChild(opcion);
    });
    controles.estado.value = esNuevo ? 'disponible' : producto.estado;

    const error = crear('p', 'mensaje-error');
    error.setAttribute('role', 'alert');

    const acciones = crear('div', 'acciones');
    const guardar = crear('button', 'boton', 'Guardar');
    guardar.type = 'submit';
    const cancelar = crear('button', 'boton boton-secundario', 'Cancelar');
    cancelar.type = 'button';
    cancelar.addEventListener('click', function () {
      productoEnEdicion = null;
      window.CCM.router.recargar();
    });
    acciones.appendChild(guardar);
    acciones.appendChild(cancelar);

    formulario.appendChild(crearGrupoCampo('producto-nombre', 'Nombre del producto', controles.nombre));
    formulario.appendChild(crearGrupoCampo('producto-categoria', 'Categoría', controles.categoria));
    formulario.appendChild(sugerencias);
    formulario.appendChild(crearGrupoCampo('producto-precio', 'Precio en pesos (COP)', controles.precio));
    formulario.appendChild(crearGrupoCampo('producto-unidad', 'Unidad (kg, libra, unidad…)', controles.unidad));
    formulario.appendChild(crearGrupoCampo('producto-estado', 'Disponibilidad', controles.estado));
    formulario.appendChild(error);
    formulario.appendChild(acciones);

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      const campos = leerCampos(controles);
      const mensaje = validarCampos(campos, controles.precio.value);
      if (mensaje !== '') {
        error.textContent = mensaje;
        return;
      }
      const persistido = esNuevo
        ? window.CCM.store.agregarProducto(comercioActivoId, campos)
        : window.CCM.store.actualizarProducto(producto.id, campos);
      avisarResultado(persistido, esNuevo ? 'Producto agregado.' : 'Cambios guardados.');
      productoEnEdicion = null;
      window.CCM.router.recargar();
    });
    return formulario;
  }

  /* ---------- Lista de productos ---------- */

  function confirmarEliminar(producto) {
    window.CCM.dialogo.confirmar({
      titulo: '¿Eliminar este producto?',
      mensaje: '«' + producto.nombre + '» se quitará de tu lista y del buscador. Esta acción no se puede deshacer.',
      textoConfirmar: 'Sí, eliminar',
      peligro: true
    }).then(function (confirmado) {
      if (confirmado) {
        avisarResultado(window.CCM.store.eliminarProducto(producto.id), 'Producto eliminado.');
        window.CCM.router.recargar();
      }
    });
  }

  function crearFilaProducto(producto) {
    const utils = window.CCM.utils;
    const item = crear('li', 'tarjeta');

    const fila = crear('div', 'fila-precio');
    fila.appendChild(crear('h2', 'tarjeta-titulo', producto.nombre));
    fila.appendChild(crear('p', 'precio', utils.formatearPrecio(producto.precio)));
    item.appendChild(fila);
    item.appendChild(crear('p', 'tarjeta-detalle', producto.categoria + ' · por ' + producto.unidad));

    const meta = crear('div', 'fila-meta');
    meta.appendChild(utils.crearInsigniaEstado(producto.estado));
    meta.appendChild(crear('span', 'texto-suave', utils.textoActualizado(producto.actualizado)));
    item.appendChild(meta);

    const acciones = crear('div', 'acciones');
    const editar = crear('button', 'boton boton-secundario', 'Editar');
    editar.type = 'button';
    editar.setAttribute('aria-label', 'Editar ' + producto.nombre);
    editar.addEventListener('click', function () {
      productoEnEdicion = producto.id;
      window.CCM.router.recargar();
    });
    const eliminar = crear('button', 'boton boton-peligro', 'Eliminar');
    eliminar.type = 'button';
    eliminar.setAttribute('aria-label', 'Eliminar ' + producto.nombre);
    eliminar.addEventListener('click', function () {
      confirmarEliminar(producto);
    });
    acciones.appendChild(editar);
    acciones.appendChild(eliminar);
    item.appendChild(acciones);
    return item;
  }

  function crearListaProductos(productos) {
    if (productos.length === 0) {
      return crear('p', 'estado', 'Aún no tienes productos. Agrega el primero con el botón de arriba.');
    }
    const lista = crear('ul', 'lista-tarjetas');
    productos.forEach(function (producto) {
      lista.appendChild(crearFilaProducto(producto));
    });
    return lista;
  }

  /* ---------- Vistas ---------- */

  function renderizarGestion(contenedor, comercio) {
    const productos = window.CCM.store.obtenerProductosDeComercio(comercio.id);
    const enEdicion = productos.find(function (p) { return p.id === productoEnEdicion; });

    contenedor.appendChild(crear('h1', 'titulo-pagina', 'Panel de ' + comercio.nombre));
    contenedor.appendChild(crear('p', 'subtitulo', 'Aquí solo ves y editas los productos de tu comercio.'));

    const barra = crear('div', 'acciones barra-panel');
    const agregar = crear('button', 'boton', 'Agregar producto');
    agregar.type = 'button';
    agregar.addEventListener('click', function () {
      productoEnEdicion = NUEVO;
      window.CCM.router.recargar();
    });
    const salir = crear('button', 'boton boton-secundario', 'Cerrar sesión');
    salir.type = 'button';
    salir.addEventListener('click', function () {
      comercioActivoId = null;
      productoEnEdicion = null;
      window.CCM.utils.mostrarAviso('Sesión cerrada.');
      window.CCM.router.recargar();
    });
    barra.appendChild(agregar);
    barra.appendChild(salir);
    contenedor.appendChild(barra);

    if (productoEnEdicion === NUEVO) {
      contenedor.appendChild(crearFormularioProducto(null));
    } else if (enEdicion) {
      contenedor.appendChild(crearFormularioProducto(enEdicion));
    }
    contenedor.appendChild(crearListaProductos(productos));
  }

  function renderizarAcceso(contenedor) {
    contenedor.appendChild(crear('h1', 'titulo-pagina', 'Panel de mi comercio'));
    contenedor.appendChild(crear('p', 'subtitulo', 'Elige tu comercio e ingresa tu PIN para actualizar precios y disponibilidad.'));
    contenedor.appendChild(crearFormularioAcceso());
  }

  /**
   * Dibuja el panel: el acceso con PIN o la gestión de productos si ya hay sesión.
   * @param {HTMLElement} contenedor Elemento donde se pinta la vista.
   * @returns {string} Título de la página.
   */
  function renderizar(contenedor) {
    const comercio = comercioActivoId === null ? undefined : window.CCM.store.obtenerComercio(comercioActivoId);
    if (comercio) {
      renderizarGestion(contenedor, comercio);
    } else {
      comercioActivoId = null;
      renderizarAcceso(contenedor);
    }
    return TITULO_PAGINA;
  }

  window.CCM.vistas.panel = { renderizar: renderizar };
})();
