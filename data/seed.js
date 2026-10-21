/*
 * Datos de ejemplo (semilla) de Consulta Comercial Malambo.
 * Se expone como window.SEED para no depender de fetch y poder abrir el sitio con file://.
 * Todos los comercios, teléfonos, PIN y precios son ficticios, solo para fines académicos.
 */
(function () {
  'use strict';

  const DIAS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
  const FECHA_ACTUALIZACION = '2026-10-17T15:00:00-05:00';

  /** Crea el horario semanal; los días sin entrada quedan como cerrados. */
  function crearHorario(porDia) {
    const horario = {};
    DIAS.forEach(function (dia) {
      horario[dia] = porDia[dia] || { cerrado: true };
    });
    return horario;
  }

  /** Repite el mismo horario para una lista de días. */
  function mismoHorario(dias, abre, cierra) {
    const porDia = {};
    dias.forEach(function (dia) {
      porDia[dia] = { abre: abre, cierra: cierra };
    });
    return porDia;
  }

  const ENTRE_DIAS = ['lun', 'mar', 'mie', 'jue', 'vie'];

  /** Atajo para declarar un producto sin repetir las claves. */
  function producto(id, comercioId, nombre, categoria, precio, unidad, estado) {
    return {
      id: id,
      comercio_id: comercioId,
      nombre: nombre,
      categoria: categoria,
      precio: precio,
      unidad: unidad,
      estado: estado,
      actualizado: FECHA_ACTUALIZACION
    };
  }

  const comercios = [
    {
      id: 'tienda-don-pedro',
      nombre: 'Tienda Don Pedro',
      categoria: 'Tienda de barrio',
      descripcion: 'Víveres y productos básicos para la casa, con domicilio en el barrio.',
      direccion: 'Calle 12 # 15-20',
      barrio: 'Centro',
      lat: 10.8598,
      lng: -74.7745,
      telefono: '300 000 0101',
      whatsapp: '573000000101',
      horario: crearHorario(Object.assign(mismoHorario(DIAS, '06:00', '21:00'), { dom: { abre: '07:00', cierra: '14:00' } })),
      medios_pago: ['efectivo', 'Nequi', 'Daviplata'],
      pin: '1111'
    },
    {
      id: 'panaderia-el-trigal',
      nombre: 'Panadería El Trigal',
      categoria: 'Panadería',
      descripcion: 'Pan fresco todos los días, desde las primeras horas de la mañana.',
      direccion: 'Carrera 14 # 10-45',
      barrio: 'Villa Rosa',
      lat: 10.8631,
      lng: -74.7702,
      telefono: '300 000 0102',
      whatsapp: '573000000102',
      horario: crearHorario(mismoHorario(DIAS, '05:00', '19:00')),
      medios_pago: ['efectivo', 'Nequi', 'tarjeta'],
      pin: '2222'
    },
    {
      id: 'ferreteria-el-tornillo',
      nombre: 'Ferretería El Tornillo',
      categoria: 'Ferretería',
      descripcion: 'Herramientas, material eléctrico y pintura para arreglos del hogar.',
      direccion: 'Calle 8 # 18-30',
      barrio: 'Pueblo Nuevo',
      lat: 10.8562,
      lng: -74.7789,
      telefono: '300 000 0103',
      whatsapp: '573000000103',
      horario: crearHorario(Object.assign(mismoHorario(ENTRE_DIAS, '07:30', '18:00'), { sab: { abre: '07:30', cierra: '13:00' } })),
      medios_pago: ['efectivo', 'tarjeta', 'transferencia'],
      pin: '3333'
    },
    {
      id: 'papeleria-punto-util',
      nombre: 'Papelería Punto Útil',
      categoria: 'Papelería',
      descripcion: 'Útiles escolares, fotocopias y papelería para la oficina.',
      direccion: 'Carrera 17 # 13-12',
      barrio: 'Centro',
      lat: 10.8612,
      lng: -74.7771,
      telefono: '300 000 0104',
      whatsapp: '573000000104',
      horario: crearHorario(Object.assign(mismoHorario(ENTRE_DIAS, '08:00', '19:00'), { sab: { abre: '09:00', cierra: '15:00' } })),
      medios_pago: ['efectivo', 'Nequi', 'Daviplata', 'transferencia'],
      pin: '4444'
    },
    {
      id: 'fruteria-la-cosecha',
      nombre: 'Frutería La Cosecha',
      categoria: 'Frutería',
      descripcion: 'Frutas, verduras y algunos víveres frescos traídos cada mañana.',
      direccion: 'Calle 15 # 11-08',
      barrio: 'Santa Rita',
      lat: 10.8655,
      lng: -74.7738,
      telefono: '300 000 0105',
      whatsapp: '573000000105',
      horario: crearHorario(Object.assign(mismoHorario(DIAS, '06:00', '17:00'), { dom: { abre: '06:00', cierra: '12:00' } })),
      medios_pago: ['efectivo', 'Nequi'],
      pin: '5555'
    },
    {
      id: 'miscelanea-la-esquina',
      nombre: 'Miscelánea La Esquina',
      categoria: 'Miscelánea',
      descripcion: 'De todo un poco: aseo, víveres y artículos para el hogar.',
      direccion: 'Carrera 12 # 9-33',
      barrio: 'Cordialidad',
      lat: 10.8574,
      lng: -74.7682,
      telefono: '300 000 0106',
      whatsapp: '573000000106',
      horario: crearHorario(mismoHorario(DIAS, '07:00', '20:00')),
      medios_pago: ['efectivo', 'Nequi', 'Daviplata', 'tarjeta'],
      pin: '6666'
    },
    {
      id: 'carniceria-el-corral',
      nombre: 'Carnicería El Corral',
      categoria: 'Carnicería',
      descripcion: 'Carnes frescas, pollo y huevos, cortados al momento.',
      direccion: 'Calle 10 # 16-50',
      barrio: 'Pueblo Nuevo',
      lat: 10.8585,
      lng: -74.7812,
      telefono: '300 000 0107',
      whatsapp: '573000000107',
      horario: crearHorario(Object.assign(mismoHorario(['lun', 'mar', 'mie', 'jue', 'vie', 'sab'], '06:00', '16:00'), { dom: { abre: '06:00', cierra: '12:00' } })),
      medios_pago: ['efectivo', 'Nequi', 'transferencia'],
      pin: '7777'
    }
  ];

  const productos = [
    // Tienda Don Pedro
    producto('p01', 'tienda-don-pedro', 'Arroz', 'Víveres', 4200, 'kg', 'disponible'),
    producto('p02', 'tienda-don-pedro', 'Aceite vegetal', 'Víveres', 12500, 'litro', 'disponible'),
    producto('p03', 'tienda-don-pedro', 'Azúcar', 'Víveres', 4300, 'kg', 'pocas_unidades'),
    producto('p04', 'tienda-don-pedro', 'Huevos', 'Víveres', 19000, 'cubeta x30', 'disponible'),
    producto('p05', 'tienda-don-pedro', 'Leche entera', 'Bebidas', 4800, 'litro', 'disponible'),
    producto('p06', 'tienda-don-pedro', 'Gaseosa', 'Bebidas', 5500, '1,5 litros', 'agotado'),
    producto('p07', 'tienda-don-pedro', 'Pasta', 'Víveres', 3200, '500 g', 'disponible'),
    // Panadería El Trigal
    producto('p08', 'panaderia-el-trigal', 'Pan francés', 'Panadería', 500, 'unidad', 'disponible'),
    producto('p09', 'panaderia-el-trigal', 'Pan de bono', 'Panadería', 1500, 'unidad', 'disponible'),
    producto('p10', 'panaderia-el-trigal', 'Pan tajado', 'Panadería', 6500, '500 g', 'pocas_unidades'),
    producto('p11', 'panaderia-el-trigal', 'Almojábana', 'Panadería', 2000, 'unidad', 'disponible'),
    producto('p12', 'panaderia-el-trigal', 'Café tinto', 'Bebidas', 1500, 'vaso', 'disponible'),
    producto('p13', 'panaderia-el-trigal', 'Pastel de pollo', 'Panadería', 2800, 'unidad', 'agotado'),
    // Ferretería El Tornillo
    producto('p14', 'ferreteria-el-tornillo', 'Martillo', 'Ferretería', 18000, 'unidad', 'disponible'),
    producto('p15', 'ferreteria-el-tornillo', 'Destornillador', 'Ferretería', 8500, 'unidad', 'disponible'),
    producto('p16', 'ferreteria-el-tornillo', 'Clavos', 'Ferretería', 4500, 'libra', 'disponible'),
    producto('p17', 'ferreteria-el-tornillo', 'Cinta métrica', 'Ferretería', 9000, '5 metros', 'pocas_unidades'),
    producto('p18', 'ferreteria-el-tornillo', 'Cable eléctrico', 'Ferretería', 2200, 'metro', 'disponible'),
    producto('p19', 'ferreteria-el-tornillo', 'Bombillo LED 9 W', 'Ferretería', 6500, 'unidad', 'disponible'),
    // Papelería Punto Útil
    producto('p20', 'papeleria-punto-util', 'Cuaderno de 100 hojas', 'Papelería', 4500, 'unidad', 'disponible'),
    producto('p21', 'papeleria-punto-util', 'Lápiz', 'Papelería', 1000, 'unidad', 'disponible'),
    producto('p22', 'papeleria-punto-util', 'Resma de papel carta', 'Papelería', 19000, 'resma', 'pocas_unidades'),
    producto('p23', 'papeleria-punto-util', 'Borrador', 'Papelería', 700, 'unidad', 'disponible'),
    producto('p24', 'papeleria-punto-util', 'Marcador permanente', 'Papelería', 3000, 'unidad', 'disponible'),
    producto('p25', 'papeleria-punto-util', 'Fotocopia', 'Papelería', 200, 'copia', 'disponible'),
    // Frutería La Cosecha
    producto('p26', 'fruteria-la-cosecha', 'Arroz', 'Víveres', 4000, 'kg', 'disponible'),
    producto('p27', 'fruteria-la-cosecha', 'Banano', 'Frutas y verduras', 1500, 'libra', 'disponible'),
    producto('p28', 'fruteria-la-cosecha', 'Tomate', 'Frutas y verduras', 4500, 'kg', 'disponible'),
    producto('p29', 'fruteria-la-cosecha', 'Cebolla', 'Frutas y verduras', 3800, 'kg', 'pocas_unidades'),
    producto('p30', 'fruteria-la-cosecha', 'Papa', 'Frutas y verduras', 3500, 'kg', 'disponible'),
    producto('p31', 'fruteria-la-cosecha', 'Limón', 'Frutas y verduras', 2000, 'libra', 'agotado'),
    producto('p32', 'fruteria-la-cosecha', 'Yuca', 'Frutas y verduras', 2800, 'kg', 'disponible'),
    producto('p33', 'fruteria-la-cosecha', 'Aguacate', 'Frutas y verduras', 3500, 'unidad', 'disponible'),
    // Miscelánea La Esquina
    producto('p34', 'miscelanea-la-esquina', 'Arroz', 'Víveres', 4600, 'kg', 'disponible'),
    producto('p35', 'miscelanea-la-esquina', 'Aceite vegetal', 'Víveres', 13000, 'litro', 'disponible'),
    producto('p36', 'miscelanea-la-esquina', 'Detergente en polvo', 'Aseo', 5500, '500 g', 'disponible'),
    producto('p37', 'miscelanea-la-esquina', 'Jabón de baño', 'Aseo', 2800, 'unidad', 'disponible'),
    producto('p38', 'miscelanea-la-esquina', 'Papel higiénico', 'Aseo', 6000, 'paquete x4', 'pocas_unidades'),
    producto('p39', 'miscelanea-la-esquina', 'Gaseosa', 'Bebidas', 5800, '1,5 litros', 'disponible'),
    // Carnicería El Corral
    producto('p40', 'carniceria-el-corral', 'Arroz', 'Víveres', 4400, 'kg', 'disponible'),
    producto('p41', 'carniceria-el-corral', 'Carne molida', 'Carnes', 9500, 'libra', 'disponible'),
    producto('p42', 'carniceria-el-corral', 'Pollo entero', 'Carnes', 11500, 'kg', 'disponible'),
    producto('p43', 'carniceria-el-corral', 'Costilla de cerdo', 'Carnes', 10500, 'libra', 'pocas_unidades'),
    producto('p44', 'carniceria-el-corral', 'Carne de res', 'Carnes', 11000, 'libra', 'agotado'),
    producto('p45', 'carniceria-el-corral', 'Huevos', 'Víveres', 18500, 'cubeta x30', 'disponible')
  ];

  window.SEED = { comercios: comercios, productos: productos };
})();
