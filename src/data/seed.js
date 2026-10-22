import face1 from '../assets/face.avif';
import face2 from '../assets/face1.jpeg';
import face3 from '../assets/face2.webp';
import face4 from '../assets/face4.avif';
import face5 from '../assets/face5.avif';

/**
 * Datos iniciales mutables de la demo.
 * Se copian al store la primera vez y quedan persistidos en localStorage.
 */

/** Historial clínico por paciente (registros de la ficha). */
export const historialSeed = [
  { id: 1, pacienteId: 1, fecha: '2025-03-20', hora: '10:00', codigo: 'A001', diente: 'Molar 18', cara: 'Oclusal', observacion: 'Caries incipiente' },
  { id: 2, pacienteId: 1, fecha: '2025-03-20', hora: '10:30', codigo: 'A002', diente: 'Premolar 24', cara: 'Mesial', observacion: 'Restauración necesaria' },
  { id: 3, pacienteId: 1, fecha: '2025-03-25', hora: '11:00', codigo: 'A003', diente: 'Incisivo 11', cara: 'Vestibular', observacion: 'Desgaste leve' },
  { id: 4, pacienteId: 1, fecha: '2025-04-01', hora: '09:30', codigo: 'A004', diente: 'Canino 33', cara: 'Lingual', observacion: 'Fractura pequeña' },
  { id: 5, pacienteId: 2, fecha: '2025-03-18', hora: '14:00', codigo: 'A005', diente: 'Molar 46', cara: 'Distal', observacion: 'Placa bacteriana' },
  { id: 6, pacienteId: 2, fecha: '2025-03-22', hora: '15:00', codigo: 'A006', diente: 'Molar 18', cara: 'Oclusal', observacion: 'Restauración necesaria' },
  { id: 7, pacienteId: 3, fecha: '2025-03-19', hora: '10:00', codigo: 'A007', diente: 'Premolar 24', cara: 'Mesial', observacion: 'Caries incipiente' },
  { id: 8, pacienteId: 3, fecha: '2025-03-26', hora: '11:30', codigo: 'A008', diente: 'Incisivo 11', cara: 'Vestibular', observacion: 'Desgaste leve' },
  { id: 9, pacienteId: 4, fecha: '2025-03-21', hora: '09:00', codigo: 'A009', diente: 'Canino 33', cara: 'Oclusal', observacion: 'Fractura pequeña' },
  { id: 10, pacienteId: 4, fecha: '2025-03-28', hora: '10:00', codigo: 'A010', diente: 'Molar 46', cara: 'Distal', observacion: 'Placa bacteriana' },
  { id: 11, pacienteId: 5, fecha: '2025-03-17', hora: '16:00', codigo: 'A011', diente: 'Molar 18', cara: 'Oclusal', observacion: 'Restauración necesaria' },
  { id: 12, pacienteId: 5, fecha: '2025-03-24', hora: '16:30', codigo: 'A012', diente: 'Premolar 24', cara: 'Mesial', observacion: 'Caries incipiente' },
];

export const pacientesSeed = [  {
    id: 1,
    nombres: 'Juan Rodriguez',
    dni: '41456698',
    domicilio: 'San Martín 444',
    localidad: 'Paraná',
    obraSocialId: 6,
    nroAfiliado: '123456789',
    telefono: '+54 343 4567890',
    email: 'juan.rodriguez@email.com',
    observaciones: 'Paciente en ortodoncia. Requiere control trimestral.',
    odontologoId: 1,
    tratamiento: 'Ortodoncia',
    fechaAlta: '2024-03-12',
    foto: face1,
  },
  {
    id: 2,
    nombres: 'Maria Lopez',
    dni: '38547236',
    domicilio: 'Av. Corrientes 1234',
    localidad: 'Buenos Aires',
    obraSocialId: 3,
    nroAfiliado: '987654321',
    telefono: '+54 11 45678901',
    email: 'maria.lopez@email.com',
    observaciones: 'Alergia a la anestesia con penicilina. Anestesia sin epinefrina.',
    odontologoId: 2,
    tratamiento: 'Implante',
    fechaAlta: '2023-11-05',
    foto: face2,
  },
  {
    id: 3,
    nombres: 'Carlos Pérez',
    dni: '40256321',
    domicilio: 'Belgrano 567',
    localidad: 'Rosario',
    obraSocialId: 4,
    nroAfiliado: '456123789',
    telefono: '+54 341 5678901',
    email: 'carlos.perez@email.com',
    observaciones: 'Requiere control trimestral. Hipertensión controlada.',
    odontologoId: 1,
    tratamiento: 'Control general',
    fechaAlta: '2025-01-20',
    foto: face3,
  },
  {
    id: 4,
    nombres: 'Ana Fernández',
    dni: '37485692',
    domicilio: 'Mitre 321',
    localidad: 'Córdoba',
    obraSocialId: 5,
    nroAfiliado: '741852963',
    telefono: '+54 351 6789012',
    email: 'ana.fernandez@email.com',
    observaciones: 'Uso de ortodoncia. Controles cada 30 días.',
    odontologoId: 2,
    tratamiento: 'Ortodoncia',
    fechaAlta: '2024-08-30',
    foto: face4,
  },
  {
    id: 5,
    nombres: 'Pedro Gómez',
    dni: '42856329',
    domicilio: 'Sarmiento 890',
    localidad: 'Mendoza',
    obraSocialId: 2,
    nroAfiliado: '159753468',
    telefono: '+54 261 7890123',
    email: 'pedro.gomez@email.com',
    observaciones: 'Consulta por implantes. Hueso suficiente en sector posterior.',
    odontologoId: 1,
    tratamiento: 'Implante',
    fechaAlta: '2025-02-14',
    foto: face5,
  },
];

/** Semana actual (lunes a sábado) en formato ISO. */
export function getSemanaActual() {
  const hoy = new Date();
  const dia = hoy.getDay();
  const diff = hoy.getDate() - dia + (dia === 0 ? -6 : 1);
  const lunes = new Date(hoy);
  lunes.setDate(diff);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

function buildTurnosSeed() {
  const s = getSemanaActual();
  return [
    { id: 1, pacienteId: 1, odontologoId: 1, fecha: s[0], hora: '09:00', duracion: 30, estado: 'confirmado', tipo: 'Control' },
    { id: 2, pacienteId: 3, odontologoId: 1, fecha: s[0], hora: '10:30', duracion: 45, estado: 'confirmado', tipo: 'Limpieza' },
    { id: 3, pacienteId: 5, odontologoId: 1, fecha: s[0], hora: '16:00', duracion: 60, estado: 'pendiente', tipo: 'Implante' },
    { id: 4, pacienteId: 2, odontologoId: 2, fecha: s[1], hora: '10:00', duracion: 45, estado: 'confirmado', tipo: 'Ortodoncia' },
    { id: 5, pacienteId: 4, odontologoId: 2, fecha: s[1], hora: '11:30', duracion: 30, estado: 'pendiente', tipo: 'Control' },
    { id: 6, pacienteId: 1, odontologoId: 1, fecha: s[1], hora: '15:00', duracion: 30, estado: 'confirmado', tipo: 'Limpieza' },
    { id: 7, pacienteId: 3, odontologoId: 1, fecha: s[2], hora: '09:30', duracion: 30, estado: 'pendiente', tipo: 'Control' },
    { id: 8, pacienteId: 2, odontologoId: 2, fecha: s[2], hora: '14:00', duracion: 60, estado: 'confirmado', tipo: 'Implante' },
    { id: 9, pacienteId: 4, odontologoId: 2, fecha: s[2], hora: '16:30', duracion: 30, estado: 'urgencia', tipo: 'Urgencia' },
    { id: 10, pacienteId: 5, odontologoId: 1, fecha: s[3], hora: '10:00', duracion: 60, estado: 'confirmado', tipo: 'Extracción' },
    { id: 11, pacienteId: 1, odontologoId: 1, fecha: s[3], hora: '12:00', duracion: 30, estado: 'pendiente', tipo: 'Control' },
    { id: 12, pacienteId: 3, odontologoId: 1, fecha: s[4], hora: '09:00', duracion: 30, estado: 'confirmado', tipo: 'Limpieza' },
    { id: 13, pacienteId: 4, odontologoId: 2, fecha: s[4], hora: '11:00', duracion: 45, estado: 'confirmado', tipo: 'Ortodoncia' },
    { id: 14, pacienteId: 2, odontologoId: 2, fecha: s[5], hora: '10:30', duracion: 30, estado: 'pendiente', tipo: 'Control' },
    { id: 15, pacienteId: 5, odontologoId: 1, fecha: s[5], hora: '15:30', duracion: 60, estado: 'confirmado', tipo: 'Implante' },
  ];
}

function buildPresupuestosSeed() {
  const hoy = new Date();
  const haceDias = (d) => {
    const f = new Date(hoy);
    f.setDate(f.getDate() - d);
    return f.toISOString().split('T')[0];
  };

  return [
    {
      id: 1,
      pacienteId: 2,
      odontologoId: 2,
      obraSocialId: 3,
      fecha: haceDias(12),
      vencimiento: haceDias(-18),
      estado: 'aceptado',
      items: [
        { concepto: 'Implante dental', precio: 720000, cantidad: 1 },
        { concepto: 'Prótesis sobre implante', precio: 540000, cantidad: 1 },
        { concepto: 'Radiografía periapical', precio: 12000, cantidad: 2 },
      ],
      descuento: 50000,
      usaObraSocial: true,
      firma: null,
      observaciones: 'Incluye control post-operatorio por 12 meses.',
    },
    {
      id: 2,
      pacienteId: 4,
      odontologoId: 2,
      obraSocialId: 5,
      fecha: haceDias(5),
      vencimiento: haceDias(-25),
      estado: 'enviado',
      items: [
        { concepto: 'Control de ortodoncia', precio: 55000, cantidad: 4 },
        { concepto: 'Panorámica', precio: 28000, cantidad: 1 },
      ],
      descuento: 0,
      usaObraSocial: true,
      firma: null,
      observaciones: 'Control mensual de brackets inferiores.',
    },
    {
      id: 3,
      pacienteId: 1,
      odontologoId: 1,
      obraSocialId: 6,
      fecha: haceDias(20),
      vencimiento: haceDias(-10),
      estado: 'pagado',
      items: [
        { concepto: 'Limpieza dental (profilaxis)', precio: 38000, cantidad: 1 },
        { concepto: 'Obturación simple', precio: 75000, cantidad: 2 },
      ],
      descuento: 0,
      usaObraSocial: false,
      firma: null,
      observaciones: '',
    },
    {
      id: 4,
      pacienteId: 5,
      odontologoId: 1,
      obraSocialId: 2,
      fecha: haceDias(2),
      vencimiento: haceDias(-28),
      estado: 'borrador',
      items: [
        { concepto: 'Implante dental', precio: 720000, cantidad: 2 },
        { concepto: 'Corona de porcelana', precio: 380000, cantidad: 2 },
      ],
      descuento: 100000,
      usaObraSocial: true,
      firma: null,
      observaciones: 'Pendiente de evaluar muestra de hueso.',
    },
  ];
}

function buildPagosSeed() {
  const hoy = new Date();
  const haceDias = (d) => {
    const f = new Date(hoy);
    f.setDate(f.getDate() - d);
    return f.toISOString().split('T')[0];
  };
  return [
    { id: 1, presupuestoId: 3, monto: 190000, metodo: 'efectivo', fecha: haceDias(18), recibe: 'Recepción' },
  ];
}

export const seedData = {
  pacientes: pacientesSeed,
  turnos: buildTurnosSeed(),
  presupuestos: buildPresupuestosSeed(),
  pagos: buildPagosSeed(),
  historial: historialSeed,
  envios: [],
  actividad: [],
};
