import { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Description as DescriptionIcon,
  Payments as PaymentsIcon,
} from '@mui/icons-material';
import { useDemo } from '../../context/DemoContext';
import { odontologos } from '../../data/catalogos';
import { desglose, totalPagado, formatMoneda } from '../../data/presupuestos';
import CSnackbar from '../elements/CSnackbar';

const HORARIOS_DISPONIBLES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

const TIPOS_CONSULTA = [
  { id: 'control', label: 'Control general', duracion: 30, descripcion: 'Revisión y diagnóstico' },
  { id: 'limpieza', label: 'Limpieza dental', duracion: 45, descripcion: 'Profilaxis y detartraje' },
  { id: 'ortodoncia', label: 'Ortodoncia', duracion: 30, descripcion: 'Control de brackets/aligners' },
  { id: 'implante', label: 'Implante', duracion: 60, descripcion: 'Consulta sobre implantes' },
  { id: 'extraccion', label: 'Extracción', duracion: 45, descripcion: 'Extracción dental' },
  { id: 'urgencia', label: 'Urgencia', duracion: 30, descripcion: 'Dolor o emergencia' },
];

const steps = ['Profesional', 'Fecha y hora', 'Datos', 'Confirmación'];

const formatFechaLarga = (iso) => {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
};

export default function PortalPaciente() {
  const { getAll, create, registrarActividad } = useDemo();

  const turnos = getAll('turnos');
  const presupuestos = getAll('presupuestos');
  const pagos = getAll('pagos');
  const pacientes = getAll('pacientes');

  // Paciente "logueado" en el portal: el primero de la lista (modo demo).
  const paciente = pacientes[0];

  const [vista, setVista] = useState('reservar');
  const [activeStep, setActiveStep] = useState(0);
  const [seleccion, setSeleccion] = useState({
    odontologoId: '',
    tipoConsulta: '',
    fecha: '',
    hora: '',
    nombre: '',
    email: '',
    telefono: '',
    motivo: '',
  });
  const [confirmado, setConfirmado] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const misPresupuestos = presupuestos.filter((p) => p.pacienteId === paciente?.id);
  const misTurnos = turnos
    .filter((t) => t.pacienteId === paciente?.id)
    .sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`));

  const getOdontologo = () => odontologos.find((o) => o.id === parseInt(seleccion.odontologoId));
  const getTipoConsulta = () => TIPOS_CONSULTA.find((t) => t.id === seleccion.tipoConsulta);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      confirmarReserva();
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0: return !!seleccion.odontologoId && !!seleccion.tipoConsulta;
      case 1: return !!seleccion.fecha && !!seleccion.hora;
      case 2: return !!seleccion.nombre && !!seleccion.email && !!seleccion.telefono;
      default: return true;
    }
  };

  const confirmarReserva = () => {
    // El turno creado desde el portal aparece en la agenda interna.
    const nuevo = create('turnos', {
      pacienteId: paciente.id,
      odontologoId: parseInt(seleccion.odontologoId),
      fecha: seleccion.fecha,
      hora: seleccion.hora,
      duracion: getTipoConsulta()?.duracion || 30,
      estado: 'pendiente',
      tipo: getTipoConsulta()?.label || 'Control',
    });
    registrarActividad('turno', `Turno reservado online por ${seleccion.nombre}`);
    setConfirmado(nuevo);
    setSnackbar({
      open: true,
      severity: 'success',
      message: '¡Turno reservado! Ya está disponible en la agenda de la clínica',
    });
  };

  const generarProximosDias = () => {
    const dias = [];
    const hoy = new Date();
    for (let i = 1; i <= 14; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      if (fecha.getDay() !== 0) dias.push(fecha);
    }
    return dias;
  };

  /** Horario ocupado si el profesional ya tiene turno ese día/hora. */
  const horarioOcupado = (fecha, hora) =>
    turnos.some(
      (t) =>
        t.fecha === fecha &&
        t.hora === hora &&
        t.odontologoId === parseInt(seleccion.odontologoId) &&
        t.estado !== 'cancelado'
    );

  // ---------------- Vista de confirmación ----------------
  if (confirmado) {
    return (
      <div className="max-w-lg mx-auto">
        <Paper elevation={0} className="p-8 rounded-2xl border border-gray-200 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckIcon sx={{ fontSize: 40 }} className="text-emerald-600" />
          </div>
          <Typography variant="h5" fontWeight="700" className="text-primary-900 mb-2">
            ¡Turno confirmado!
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-6">
            Recibirás un recordatorio por WhatsApp y email antes de tu cita.
          </Typography>

          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <PersonIcon fontSize="small" className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Profesional</p>
                <p className="text-sm font-medium">
                  {odontologos.find((o) => o.id === confirmado.odontologoId)?.nombre}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarIcon fontSize="small" className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Fecha</p>
                <p className="text-sm font-medium">{formatFechaLarga(confirmado.fecha)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TimeIcon fontSize="small" className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Horario</p>
                <p className="text-sm font-medium">
                  {confirmado.hora} — {confirmado.duracion} min
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outlined"
            onClick={() => {
              setConfirmado(null);
              setVista('reservar');
              setActiveStep(0);
              setSeleccion({
                odontologoId: '',
                tipoConsulta: '',
                fecha: '',
                hora: '',
                nombre: '',
                email: '',
                telefono: '',
                motivo: '',
              });
            }}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Reservar otro turno
          </Button>
        </Paper>
      </div>
    );
  }

  // ---------------- Portal del paciente ----------------
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header del portal */}
      <Paper
        elevation={0}
        className="p-5 rounded-2xl border border-gray-200 bg-gradient-to-r from-dental to-dental-dark"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <Avatar src={paciente?.foto} sx={{ width: 56, height: 56, bgcolor: 'white', color: 'primary.800' }}>
            {paciente?.nombres.charAt(0)}
          </Avatar>
          <div className="flex-1">
            <Typography variant="h6" fontWeight="700" className="text-white">
              Hola, {paciente?.nombres.split(' ')[0]}
            </Typography>
            <Typography variant="body2" className="text-white/80">
              Portal del paciente · gestioná tus turnos y presupuestos
            </Typography>
          </div>
          <div className="flex gap-2">
            <Button
              size="small"
              onClick={() => setVista('reservar')}
              className={vista === 'reservar' ? 'bg-white text-dental' : 'text-white'}
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              Reservar turno
            </Button>
            <Button
              size="small"
              onClick={() => setVista('presupuestos')}
              className={vista === 'presupuestos' ? 'bg-white text-dental' : 'text-white'}
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              Mis presupuestos
            </Button>
          </div>
        </div>
      </Paper>

      {vista === 'presupuestos' ? (
        <PresupuestosPaciente
          presupuestos={misPresupuestos}
          pagos={pagos}
          paciente={paciente}
        />
      ) : (
        <>
          <div className="text-center">
            <Typography variant="h5" fontWeight="700" className="text-primary-900">
              Reservá tu turno online
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Elegí profesional, fecha y horario en simples pasos
            </Typography>
          </div>

          <Stepper activeStep={activeStep} sx={{ mb: 1 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Paper elevation={0} className="p-6 rounded-2xl border border-gray-200 mb-6">
            {activeStep === 0 && (
              <div className="space-y-6">
                <div>
                  <Typography variant="subtitle1" fontWeight="600" className="mb-3">
                    Seleccioná el profesional
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {odontologos.map((o) => (
                      <Card
                        key={o.id}
                        elevation={0}
                        onClick={() => setSeleccion({ ...seleccion, odontologoId: String(o.id) })}
                        className={`cursor-pointer border-2 rounded-xl transition-all ${
                          seleccion.odontologoId === String(o.id)
                            ? 'border-dental bg-dental/5 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CardContent sx={{ p: '16px !important' }}>
                          <div className="flex items-center gap-3">
                            <Avatar sx={{ bgcolor: '#4a90d9', width: 48, height: 48 }}>
                              {o.nombre.charAt(0)}
                            </Avatar>
                            <div>
                              <Typography variant="body2" fontWeight="600">{o.nombre}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {o.especialidad}
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary">
                                Mat. {o.matricula}
                              </Typography>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Typography variant="subtitle1" fontWeight="600" className="mb-3">
                    Tipo de consulta
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TIPOS_CONSULTA.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSeleccion({ ...seleccion, tipoConsulta: t.id })}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          seleccion.tipoConsulta === t.id
                            ? 'border-dental bg-dental/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{t.label}</p>
                            <p className="text-xs text-gray-500">{t.descripcion}</p>
                          </div>
                          <Chip
                            label={`${t.duracion} min`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Typography variant="subtitle1" fontWeight="600" className="mb-3">
                    Seleccioná la fecha
                  </Typography>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {generarProximosDias().slice(0, 10).map((fecha, i) => {
                      const fechaStr = new Date(
                        fecha.getTime() - fecha.getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .split('T')[0];
                      return (
                        <div
                          key={i}
                          onClick={() => setSeleccion({ ...seleccion, fecha: fechaStr })}
                          className={`p-3 rounded-xl border-2 cursor-pointer text-center transition-all ${
                            seleccion.fecha === fechaStr
                              ? 'border-dental bg-dental/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="text-xs text-gray-500 capitalize">
                            {fecha.toLocaleDateString('es-AR', { weekday: 'short' })}
                          </p>
                          <p className="text-lg font-bold">{fecha.getDate()}</p>
                          <p className="text-xs text-gray-400 capitalize">
                            {fecha.toLocaleDateString('es-AR', { month: 'short' })}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {seleccion.fecha && (
                  <div>
                    <Typography variant="subtitle1" fontWeight="600" className="mb-3">
                      Horarios disponibles
                    </Typography>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {HORARIOS_DISPONIBLES.map((hora) => {
                        const ocupado = horarioOcupado(seleccion.fecha, hora);
                        return (
                          <button
                            key={hora}
                            onClick={() => !ocupado && setSeleccion({ ...seleccion, hora })}
                            disabled={ocupado}
                            className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                              seleccion.hora === hora
                                ? 'border-dental bg-dental text-white'
                                : ocupado
                                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                : 'border-gray-200 hover:border-dental hover:bg-dental/5'
                            }`}
                          >
                            {hora}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <Typography variant="subtitle1" fontWeight="600">
                  Completá tus datos
                </Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    label="Nombre completo"
                    value={seleccion.nombre}
                    onChange={(e) => setSeleccion({ ...seleccion, nombre: e.target.value })}
                    size="small"
                    fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={seleccion.email}
                    onChange={(e) => setSeleccion({ ...seleccion, email: e.target.value })}
                    size="small"
                    fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                  />
                  <TextField
                    label="Teléfono"
                    value={seleccion.telefono}
                    onChange={(e) => setSeleccion({ ...seleccion, telefono: e.target.value })}
                    size="small"
                    fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                  />
                </div>
                <TextField
                  label="Motivo de consulta (opcional)"
                  value={seleccion.motivo}
                  onChange={(e) => setSeleccion({ ...seleccion, motivo: e.target.value })}
                  size="small"
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <Typography variant="subtitle1" fontWeight="600">
                  Confirmá los datos del turno
                </Typography>
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Profesional</p>
                      <p className="text-sm font-semibold">{getOdontologo()?.nombre}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Especialidad</p>
                      <p className="text-sm font-semibold">{getOdontologo()?.especialidad}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Fecha</p>
                      <p className="text-sm font-semibold">
                        {formatFechaLarga(seleccion.fecha)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Horario</p>
                      <p className="text-sm font-semibold">
                        {seleccion.hora} — {getTipoConsulta()?.duracion} min
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Tipo de consulta</p>
                      <p className="text-sm font-semibold">{getTipoConsulta()?.label}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Paciente</p>
                      <p className="text-sm font-semibold">{seleccion.nombre}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Paper>

          <div className="flex justify-between">
            <Button
              onClick={() => setActiveStep((prev) => prev - 1)}
              disabled={activeStep === 0}
              startIcon={<ArrowBackIcon />}
              sx={{ borderRadius: '10px', textTransform: 'none' }}
            >
              Atrás
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepValid()}
              endIcon={activeStep < steps.length - 1 ? <ArrowForwardIcon /> : <CheckIcon />}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #4a90d9, #2c5f8a)',
              }}
            >
              {activeStep === steps.length - 1 ? 'Confirmar turno' : 'Siguiente'}
            </Button>
          </div>

          {/* Mis turnos */}
          {misTurnos.length > 0 && (
            <Paper elevation={0} className="p-5 rounded-xl border border-gray-200">
              <Typography variant="subtitle1" fontWeight="600" className="mb-3">
                Mis turnos
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>
                        Fecha
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>
                        Hora
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>
                        Profesional
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>
                        Estado
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {misTurnos.map((t) => (
                      <TableRow key={t.id} hover>
                        <TableCell sx={{ fontSize: '0.85rem' }}>
                          {formatFechaLarga(t.fecha)}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.85rem' }}>{t.hora}</TableCell>
                        <TableCell sx={{ fontSize: '0.85rem' }}>
                          {odontologos.find((o) => o.id === t.odontologoId)?.nombre}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={t.estado}
                            size="small"
                            color={t.estado === 'confirmado' ? 'success' : 'warning'}
                            sx={{ fontSize: '0.65rem' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}

      <CSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </div>
  );
}

function PresupuestosPaciente({ presupuestos, pagos, paciente }) {
  if (presupuestos.length === 0) {
    return (
      <Paper elevation={0} className="p-10 rounded-2xl border border-gray-200 text-center">
        <DescriptionIcon sx={{ fontSize: 48, mb: 1, color: '#cbd5e1' }} />
        <Typography variant="h6" fontWeight="600" color="text.secondary">
          No tenés presupuestos por ahora
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cuando tu odontólogo te envíe un plan de tratamiento, lo vas a ver acá.
        </Typography>
      </Paper>
    );
  }

  return (
    <div className="space-y-4">
      {presupuestos.map((p) => {
        const d = desglose(p);
        const pagado = totalPagado(pagos, p.id);
        const saldo = Math.max(0, d.aPagar - pagado);
        return (
          <Paper key={p.id} elevation={0} className="p-5 rounded-xl border border-gray-200">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <Typography variant="h6" fontWeight="700">
                  Presupuesto #{p.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {p.items.length} conceptos · {formatFechaLarga(p.fecha)}
                </Typography>
              </div>
              <Chip
                label={
                  p.estado === 'pagado'
                    ? 'Pagado'
                    : p.estado === 'aceptado'
                    ? 'Aceptado'
                    : p.estado === 'enviado'
                    ? 'Recibido'
                    : 'En preparación'
                }
                color={p.estado === 'pagado' ? 'success' : p.estado === 'aceptado' ? 'primary' : 'default'}
                sx={{ fontSize: '0.7rem' }}
              />
            </div>

            <div className="mt-3 space-y-1">
              {p.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-600">
                  <span>
                    {item.concepto} × {item.cantidad}
                  </span>
                  <span>{formatMoneda(item.precio * item.cantidad)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Total a pagar</span>
              <span className="text-xl font-bold text-primary-900">
                {formatMoneda(d.aPagar)}
              </span>
            </div>

            {saldo > 0 && (
              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <Typography variant="caption" className="text-amber-900">
                  <PaymentsIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                  Tenés un saldo pendiente de {formatMoneda(saldo)}. Podés abonarlo en recepción.
                </Typography>
              </div>
            )}
          </Paper>
        );
      })}
    </div>
  );
}
