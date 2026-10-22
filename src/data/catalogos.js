/**
 * Datos de referencia (solo lectura) de la demo.
 * No se persisten: son catálogos estáticos de la clínica.
 */

export const odontologos = [
  {
    id: 1,
    nombre: 'Dr. Marcelo Maidana',
    matricula: 'MN 12345',
    especialidad: 'Odontología General',
    telefono: '+54 343 4123456',
    email: 'maidana@clinica.com',
    horarios: { inicio: '09:00', fin: '18:00' },
    foto: 'odontologo1',
  },
  {
    id: 2,
    nombre: 'Dra. Cristina Martinez',
    matricula: 'MN 67890',
    especialidad: 'Ortodoncia',
    telefono: '+54 11 4234567',
    email: 'cmartinez@clinica.com',
    horarios: { inicio: '10:00', fin: '19:00' },
    foto: 'odontologo2',
  },
];

export const obrasSociales = [
  { id: 1, nombre: 'IOSPER', plan: 'Plan A', cobertura: 70, copago: 30000 },
  { id: 2, nombre: 'OSDE', plan: 'Plan 210', cobertura: 80, copago: 25000 },
  { id: 3, nombre: 'Swiss Medical', plan: 'Plan Premium', cobertura: 90, copago: 15000 },
  { id: 4, nombre: 'Galeno', plan: 'Plan Azul', cobertura: 80, copago: 22000 },
  { id: 5, nombre: 'Medife', plan: 'Plan Bronce', cobertura: 70, copago: 28000 },
  { id: 6, nombre: 'OMINT', plan: 'Plan Basico', cobertura: 60, copago: 35000 },
  { id: 7, nombre: 'Sancor Salud', plan: 'Plan 2000', cobertura: 85, copago: 20000 },
  { id: 8, nombre: 'Accord Salud', plan: 'Plan A', cobertura: 75, copago: 27000 },
  { id: 9, nombre: 'Prevención Salud', plan: 'Plan 1', cobertura: 70, copago: 30000 },
  { id: 10, nombre: 'Federada Salud', plan: 'Plan Basico', cobertura: 65, copago: 32000 },
];

/** Catálogo de tratamientos con precios de referencia (moneda local). */
export const catalogoTratamientos = [
  { id: 1, categoria: 'Diagnóstico', concepto: 'Consulta y diagnóstico', precio: 45000 },
  { id: 2, categoria: 'Preventiva', concepto: 'Limpieza dental (profilaxis)', precio: 38000 },
  { id: 3, categoria: 'Preventiva', concepto: 'Radiografía periapical', precio: 12000 },
  { id: 4, categoria: 'Preventiva', concepto: 'Panorámica', precio: 28000 },
  { id: 5, categoria: 'Operatoria', concepto: 'Obturación simple', precio: 75000 },
  { id: 6, categoria: 'Operatoria', concepto: 'Obturación doble', precio: 110000 },
  { id: 7, categoria: 'Operatoria', concepto: 'Endodoncia (tratamiento de conducto)', precio: 280000 },
  { id: 8, categoria: 'Operatoria', concepto: 'Extracción simple', precio: 95000 },
  { id: 9, categoria: 'Operatoria', concepto: 'Extracción quirúrgica', precio: 220000 },
  { id: 10, categoria: 'Rehabilitación', concepto: 'Corona de porcelana', precio: 380000 },
  { id: 11, categoria: 'Rehabilitación', concepto: 'Prótesis dental', precio: 450000 },
  { id: 12, categoria: 'Ortodoncia', concepto: 'Instalación de brackets metálicos', precio: 650000 },
  { id: 13, categoria: 'Ortodoncia', concepto: 'Control de ortodoncia', precio: 55000 },
  { id: 14, categoria: 'Ortodoncia', concepto: 'Aligners (juego de 20)', precio: 1800000 },
  { id: 15, categoria: 'Implantes', concepto: 'Implante dental', precio: 720000 },
  { id: 16, categoria: 'Implantes', concepto: 'Prótesis sobre implante', precio: 540000 },
  { id: 17, categoria: 'Estética', concepto: 'Blanqueamiento dental', precio: 180000 },
  { id: 18, categoria: 'Estética', concepto: 'Carilla de porcelana', precio: 420000 },
];

export const categoriasTratamiento = [
  'Diagnóstico',
  'Preventiva',
  'Operatoria',
  'Rehabilitación',
  'Ortodoncia',
  'Implantes',
  'Estética',
];

export const tiposConsulta = [
  'Control',
  'Limpieza',
  'Ortodoncia',
  'Implante',
  'Extracción',
  'Urgencia',
];

export const metodosPago = [
  { id: 'efectivo', label: 'Efectivo' },
  { id: 'transferencia', label: 'Transferencia' },
  { id: 'tarjeta', label: 'Tarjeta' },
  { id: 'obrasocial', label: 'Obra social' },
];

export const estadosPresupuesto = {
  borrador: { label: 'Borrador', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  enviado: { label: 'Enviado', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  aceptado: { label: 'Aceptado', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  pagado: { label: 'Pagado', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400' },
  rechazado: { label: 'Rechazado', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
};
