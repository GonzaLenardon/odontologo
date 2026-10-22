import { useState, useMemo } from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  ViewWeek,
  CalendarMonth,
  Add as AddIcon,
  AccessTime,
  Person,
  WarningAmber,
  Delete as DeleteIcon,
  DragIndicator,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useDemo } from '../../context/DemoContext';
import { odontologos, tiposConsulta } from '../../data/catalogos';
import CSnackbar from '../elements/CSnackbar';

const HORAS = Array.from({ length: 20 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);
const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const estadoColor = {
  confirmado: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  pendiente: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  cancelado: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  urgencia: { bg: 'bg-red-200', text: 'text-red-800', border: 'border-red-400' },
};

const ESTADOS = ['pendiente', 'confirmado', 'urgencia', 'cancelado'];

function getWeekDates(date) {
  const start = new Date(date);
  const dia = start.getDay();
  const diff = start.getDate() - dia + (dia === 0 ? -6 : 1);
  start.setDate(diff);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function getMonthDates(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const dates = [];
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

function formatDate(date) {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return d.toISOString().split('T')[0];
}

/** "24 oct 2026" — mes capitalizado, sin el "de" extra que agrega es-AR. */
function formatFechaCorta(date, conAnio = false) {
  const mes = date.toLocaleDateString('es-AR', { month: 'short' });
  const mesCap = mes.charAt(0).toUpperCase() + mes.slice(1);
  return conAnio
    ? `${date.getDate()} ${mesCap} ${date.getFullYear()}`
    : `${date.getDate()} ${mesCap}`;
}

function formatFechaLarga(iso) {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

const minutosDe = (hora) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

export default function Agenda() {
  const { getAll, create, update, remove, registrarActividad } = useDemo();

  const [vista, setVista] = useState('semanal');
  const [fechaActual, setFechaActual] = useState(new Date());
  const [filtroOdontologo, setFiltroOdontologo] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formTurno, setFormTurno] = useState({
    pacienteId: '',
    odontologoId: '',
    fecha: '',
    hora: '09:00',
    duracion: 30,
    tipo: 'Control',
    estado: 'pendiente',
  });
  const [editandoId, setEditandoId] = useState(null);

  const [detalle, setDetalle] = useState(null);
  const [movimiento, setMovimiento] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const turnos = getAll('turnos');
  const pacientes = getAll('pacientes');

  const semanaDates = useMemo(() => getWeekDates(fechaActual), [fechaActual]);
  const mesDates = useMemo(() => getMonthDates(fechaActual), [fechaActual]);

  const notificar = (severity, message) => setSnackbar({ open: true, severity, message });

  const turnosVisibles = useMemo(
    () =>
      turnos.filter(
        (t) =>
          (filtroOdontologo === 'todos' || String(t.odontologoId) === filtroOdontologo) &&
          (filtroTipo === 'todos' || t.tipo === filtroTipo)
      ),
    [turnos, filtroOdontologo, filtroTipo]
  );

  const navigate = (direction) => {
    const newDate = new Date(fechaActual);
    if (vista === 'semanal') newDate.setDate(newDate.getDate() + direction * 7);
    else newDate.setMonth(newDate.getMonth() + direction);
    setFechaActual(newDate);
  };

  const getPacienteNombre = (id) => {
    const p = pacientes.find((p) => p.id === id);
    return p ? p.nombres : 'Desconocido';
  };

  const getOdontologoNombre = (id) => {
    const o = odontologos.find((o) => o.id === id);
    return o ? o.nombre : 'Desconocido';
  };

  /** Detecta si un profesional ya tiene un turno en la misma franja. */
  const haySolapamiento = (odontologoId, fecha, hora, duracion, ignorarId = null) => {
    const ini1 = minutosDe(hora);
    const fin1 = ini1 + (duracion || 30);
    return turnos.some((t) => {
      if (String(t.odontologoId) !== String(odontologoId)) return false;
      if (t.fecha !== fecha) return false;
      if (ignorarId && String(t.id) === String(ignorarId)) return false;
      if (t.estado === 'cancelado') return false;
      const ini2 = minutosDe(t.hora);
      const fin2 = ini2 + (t.duracion || 30);
      return ini1 < fin2 && ini2 < fin1;
    });
  };

  // ---------- Apertura del dialog ----------
  const abrirNuevo = (fecha, hora) => {
    setEditandoId(null);
    setFormTurno({
      pacienteId: '',
      odontologoId: '',
      fecha: fecha || formatDate(fechaActual),
      hora: hora || '09:00',
      duracion: 30,
      tipo: 'Control',
      estado: 'pendiente',
    });
    setDialogOpen(true);
  };

  const abrirTurno = (turno) => {
    setEditandoId(turno.id);
    setFormTurno({
      pacienteId: String(turno.pacienteId),
      odontologoId: String(turno.odontologoId),
      fecha: turno.fecha,
      hora: turno.hora,
      duracion: turno.duracion || 30,
      tipo: turno.tipo,
      estado: turno.estado,
    });
    setDialogOpen(true);
  };

  /** Al elegir paciente, el odontólogo se asigna según la ficha. */
  const handlePacienteChange = (pacienteId) => {
    const paciente = pacientes.find((p) => String(p.id) === String(pacienteId));
    setFormTurno((prev) => ({
      ...prev,
      pacienteId,
      odontologoId: paciente ? String(paciente.odontologoId) : prev.odontologoId,
    }));
  };

  const odontologoAsignadoPorFicha = (() => {
    if (!formTurno.pacienteId) return false;
    const paciente = pacientes.find((p) => String(p.id) === String(formTurno.pacienteId));
    return paciente && String(paciente.odontologoId) === String(formTurno.odontologoId);
  })();

  const handleGuardar = () => {
    const solapado = haySolapamiento(
      formTurno.odontologoId,
      formTurno.fecha,
      formTurno.hora,
      formTurno.duracion,
      editandoId
    );

    if (solapado) {
      notificar(
        'warning',
        `El profesional ya tiene un turno en esa franja (${formTurno.hora}). Se guardó igual.`
      );
    }

    const datos = {
      pacienteId: parseInt(formTurno.pacienteId),
      odontologoId: parseInt(formTurno.odontologoId),
      fecha: formTurno.fecha,
      hora: formTurno.hora,
      duracion: parseInt(formTurno.duracion),
      tipo: formTurno.tipo,
      estado: formTurno.estado,
    };

    if (editandoId) {
      update('turnos', editandoId, datos);
      registrarActividad('turno', `Turno de ${getPacienteNombre(datos.pacienteId)} actualizado`);
      notificar('success', 'Turno actualizado');
    } else {
      create('turnos', datos);
      registrarActividad('turno', `Turno creado para ${getPacienteNombre(datos.pacienteId)}`);
      notificar('success', 'Turno creado exitosamente');
    }
    setDialogOpen(false);
  };

  const handleEliminar = (turno) => {
    remove('turnos', turno.id);
    setDetalle(null);
    registrarActividad('turno', `Turno de ${getPacienteNombre(turno.pacienteId)} cancelado`);
    notificar('success', 'Turno eliminado');
  };

  const handleCambiarEstado = (turno, estado) => {
    update('turnos', turno.id, { estado });
    setDetalle({ ...turno, estado });
    registrarActividad('turno', `Turno de ${getPacienteNombre(turno.pacienteId)}: ${estado}`);
    notificar('success', `Turno marcado como ${estado}`);
  };

  // ---------- Drag & drop con confirmación ----------
  const handleDragStart = (e, turno) => {
    e.dataTransfer.setData('turnoId', turno.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, fecha, hora) => {
    e.preventDefault();
    const turnoId = parseInt(e.dataTransfer.getData('turnoId'));
    const turno = turnos.find((t) => t.id === turnoId);
    if (!turno) return;
    if (turno.fecha === fecha && turno.hora === hora) return;

    const solapado = haySolapamiento(turno.odontologoId, fecha, hora, turno.duracion, turnoId);
    setMovimiento({ turno, fecha, hora, solapado });
  };

  const confirmarMovimiento = () => {
    const { turno, fecha, hora } = movimiento;
    update('turnos', turno.id, { fecha, hora });
    registrarActividad(
      'turno',
      `Turno de ${getPacienteNombre(turno.pacienteId)} movido a ${formatFechaLarga(fecha)} ${hora}`
    );
    notificar('success', `Turno movido a ${formatFechaLarga(fecha)} ${hora}`);
    setMovimiento(null);
  };

  // ---------- Render ----------
  const renderTurnoChip = (turno, compact = false) => {
    const colors = estadoColor[turno.estado] || estadoColor.pendiente;

    if (compact) {
      return (
        <Tooltip
          key={turno.id}
          title={`${getPacienteNombre(turno.pacienteId)} · ${turno.tipo} · ${turno.hora}`}
        >
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, turno)}
            onClick={() => setDetalle(turno)}
            className={`px-2 py-0.5 rounded-md text-[10px] font-medium cursor-grab active:cursor-grabbing ${colors.bg} ${colors.text} border ${colors.border} truncate hover:shadow-sm`}
          >
            {getPacienteNombre(turno.pacienteId).split(' ')[0]}
          </div>
        </Tooltip>
      );
    }

    return (
      <div
        key={turno.id}
        draggable
        onDragStart={(e) => handleDragStart(e, turno)}
        onClick={() => setDetalle(turno)}
        className={`px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing border ${colors.bg} ${colors.border} hover:shadow-md hover:scale-[1.02] transition-all`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold ${colors.text} truncate`}>
              {getPacienteNombre(turno.pacienteId)}
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              {turno.tipo} · {turno.duracion}′
            </p>
          </div>
          <DragIndicator sx={{ fontSize: 14, color: '#9ca3af' }} />
        </div>
      </div>
    );
  };

  const renderVistaSemanal = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="w-16 p-2 text-xs font-medium text-gray-500 bg-gray-50 border-b border-r border-gray-200">
              Hora
            </th>
            {semanaDates.map((date, i) => {
              const isToday = formatDate(date) === formatDate(new Date());
              return (
                <th
                  key={i}
                  className={`p-2 text-xs font-medium border-b border-r border-gray-200 ${
                    isToday ? 'bg-dental/10 text-dental' : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  <div>{DIAS_SEMANA[i]}</div>
                  <div className="text-lg font-bold">{date.getDate()}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {HORAS.map((hora) => (
            <tr key={hora}>
              <td className="p-2 text-xs text-gray-500 bg-gray-50 border-b border-r border-gray-200 text-center font-medium">
                {hora}
              </td>
              {semanaDates.map((date, i) => {
                const fecha = formatDate(date);
                const celda = turnosVisibles.filter((t) => t.fecha === fecha && t.hora === hora);
                return (
                  <td
                    key={i}
                    className="p-1 border-b border-r border-gray-200 align-top min-w-[130px] h-16 hover:bg-blue-50/60 transition-colors cursor-pointer"
                    onClick={() => abrirNuevo(fecha, hora)}
                    onDrop={(e) => {
                      e.stopPropagation();
                      handleDrop(e, fecha, hora);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {celda.map((t) => renderTurnoChip(t))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderVistaMensual = () => {
    const firstDay = mesDates[0].getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const paddedDates = [...Array(offset).fill(null), ...mesDates];

    return (
      <div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {paddedDates.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} className="h-24" />;
            const fecha = formatDate(date);
            const delDia = turnosVisibles.filter((t) => t.fecha === fecha);
            const isToday = fecha === formatDate(new Date());
            return (
              <div
                key={i}
                onClick={() => abrirNuevo(fecha, '09:00')}
                className={`h-24 p-2 rounded-lg border transition-colors cursor-pointer ${
                  isToday
                    ? 'border-dental bg-dental/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-dental' : 'text-gray-700'}`}>
                  {date.getDate()}
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  {delDia.slice(0, 3).map((t) => renderTurnoChip(t, true))}
                  {delDia.length > 3 && (
                    <p className="text-[10px] text-gray-400">+{delDia.length - 3} más</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const titulo =
    vista === 'semanal'
      ? `${formatFechaCorta(semanaDates[0])} — ${formatFechaCorta(semanaDates[5], true)}`
      : fechaActual
          .toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
          .replace(/^./, (c) => c.toUpperCase())
          .replace(/ de (\d{4})$/, ' $1');

  const turnosHoy = turnosVisibles.filter((t) => t.fecha === formatDate(new Date()));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Typography variant="h5" fontWeight="700" className="text-primary-900">
            Agenda Inteligente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestioná los turnos arrastrándolos · {turnosHoy.length} turnos hoy
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          <ToggleButtonGroup
            value={vista}
            exclusive
            onChange={(_, v) => v && setVista(v)}
            size="small"
            sx={{ '& .MuiToggleButton-root': { px: 2, py: 0.5, textTransform: 'none' } }}
          >
            <ToggleButton value="semanal">
              <ViewWeek fontSize="small" sx={{ mr: 0.5 }} /> Semanal
            </ToggleButton>
            <ToggleButton value="mensual">
              <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} /> Mensual
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => abrirNuevo(formatDate(fechaActual), '09:00')}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #4a90d9, #2c5f8a)',
            }}
          >
            Nuevo turno
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Paper elevation={0} className="p-3 rounded-xl border border-gray-200 flex items-center gap-3 flex-wrap">
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="filtro-od-label">Profesional</InputLabel>
          <Select
            labelId="filtro-od-label"
            label="Profesional"
            value={filtroOdontologo}
            onChange={(e) => setFiltroOdontologo(e.target.value)}
          >
            <MenuItem value="todos">Todos los profesionales</MenuItem>
            {odontologos.map((o) => (
              <MenuItem key={o.id} value={String(o.id)}>
                {o.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="filtro-tipo-label">Tipo de consulta</InputLabel>
          <Select
            labelId="filtro-tipo-label"
            label="Tipo de consulta"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <MenuItem value="todos">Todos los tipos</MenuItem>
            {tiposConsulta.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="body2" color="text.secondary" className="ml-auto">
          {turnosVisibles.length} turnos visibles
        </Typography>
      </Paper>

      {/* Navegación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconButton onClick={() => navigate(-1)} size="small" className="bg-gray-100 hover:bg-gray-200">
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" className="min-w-[250px] text-center">
            {titulo}
          </Typography>
          <IconButton onClick={() => navigate(1)} size="small" className="bg-gray-100 hover:bg-gray-200">
            <ChevronRight />
          </IconButton>
        </div>
        <Button
          size="small"
          onClick={() => setFechaActual(new Date())}
          sx={{ textTransform: 'none', borderRadius: '8px' }}
        >
          Hoy
        </Button>
      </div>

      {/* Leyenda */}
      <div className="flex gap-4 flex-wrap">
        {Object.entries(estadoColor).map(([estado, colors]) => (
          <div key={estado} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${colors.bg} border ${colors.border}`} />
            <span className="text-xs text-gray-600 capitalize">{estado}</span>
          </div>
        ))}
      </div>

      {/* Calendario */}
      <Paper elevation={0} className="rounded-2xl border border-gray-200 overflow-hidden">
        {vista === 'semanal' ? renderVistaSemanal() : renderVistaMensual()}
      </Paper>

      {/* ---- Dialog: nuevo / editar turno ---- */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editandoId ? 'Editar Turno' : 'Nuevo Turno'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            select
            label="Paciente"
            value={formTurno.pacienteId}
            onChange={(e) => handlePacienteChange(e.target.value)}
            size="small"
            fullWidth
            required
          >
            {pacientes.map((p) => (
              <MenuItem key={p.id} value={String(p.id)}>
                {p.nombres}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Odontólogo"
            value={formTurno.odontologoId}
            onChange={(e) => setFormTurno({ ...formTurno, odontologoId: e.target.value })}
            size="small"
            fullWidth
            required
            helperText={
              odontologoAsignadoPorFicha
                ? 'Asignado automáticamente según la ficha del paciente'
                : 'Elegí el profesional que atenderá'
            }
          >
            {odontologos.map((o) => (
              <MenuItem key={o.id} value={String(o.id)}>
                {o.nombre} — {o.especialidad}
              </MenuItem>
            ))}
          </TextField>

          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Fecha"
              type="date"
              value={formTurno.fecha}
              onChange={(e) => setFormTurno({ ...formTurno, fecha: e.target.value })}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Hora"
              value={formTurno.hora}
              onChange={(e) => setFormTurno({ ...formTurno, hora: e.target.value })}
              size="small"
            >
              {HORAS.map((h) => (
                <MenuItem key={h} value={h}>
                  {h}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextField
              select
              label="Tipo de consulta"
              value={formTurno.tipo}
              onChange={(e) => setFormTurno({ ...formTurno, tipo: e.target.value })}
              size="small"
            >
              {tiposConsulta.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Duración"
              value={formTurno.duracion}
              onChange={(e) => setFormTurno({ ...formTurno, duracion: e.target.value })}
              size="small"
            >
              {[15, 30, 45, 60, 90].map((d) => (
                <MenuItem key={d} value={d}>
                  {d} minutos
                </MenuItem>
              ))}
            </TextField>
          </div>

          {editandoId && (
            <TextField
              select
              label="Estado"
              value={formTurno.estado}
              onChange={(e) => setFormTurno({ ...formTurno, estado: e.target.value })}
              size="small"
            >
              {ESTADOS.map((s) => (
                <MenuItem key={s} value={s}>
                  <span className="capitalize">{s}</span>
                </MenuItem>
              ))}
            </TextField>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleGuardar}
            disabled={!formTurno.pacienteId || !formTurno.odontologoId || !formTurno.fecha}
            startIcon={<SaveIcon />}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            {editandoId ? 'Guardar cambios' : 'Crear turno'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---- Dialog: detalle del turno ---- */}
      <Dialog
        open={!!detalle}
        onClose={() => setDetalle(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        {detalle && (
          <>
            <DialogTitle sx={{ fontWeight: 600 }}>Detalle del turno</DialogTitle>
            <DialogContent>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <Typography variant="h6" fontWeight="700">
                    {getPacienteNombre(detalle.pacienteId)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {detalle.tipo} · {detalle.duracion} minutos
                  </Typography>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <AccessTime fontSize="small" />
                    {formatFechaLarga(detalle.fecha)} — {detalle.hora}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <Person fontSize="small" />
                    {getOdontologoNombre(detalle.odontologoId)}
                  </div>
                </div>

                <div>
                  <Typography variant="subtitle2" fontWeight="600" className="mb-1.5">
                    Cambiar estado
                  </Typography>
                  <div className="flex flex-wrap gap-1.5">
                    {ESTADOS.map((s) => {
                      const colors = estadoColor[s];
                      const activo = detalle.estado === s;
                      return (
                        <button
                          key={s}
                          onClick={() => handleCambiarEstado(detalle, s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all ${
                            activo
                              ? `${colors.bg} ${colors.text} ${colors.border} ring-2 ring-offset-1`
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Divider />

                <div className="flex gap-2">
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      abrirTurno(detalle);
                      setDetalle(null);
                    }}
                    sx={{ borderRadius: '10px', textTransform: 'none' }}
                  >
                    Editar
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleEliminar(detalle)}
                    sx={{ borderRadius: '10px', textTransform: 'none' }}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* ---- Dialog: confirmación de movimiento (drag & drop) ---- */}
      <Dialog
        open={!!movimiento}
        onClose={() => setMovimiento(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmber color={movimiento?.solapado ? 'warning' : 'primary'} />
          Confirmar movimiento
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Mover el turno de{' '}
            <strong>{movimiento && getPacienteNombre(movimiento.turno.pacienteId)}</strong> a{' '}
            <strong>
              {movimiento && formatFechaLarga(movimiento.fecha)} a las {movimiento?.hora}
            </strong>
            ?
          </Typography>
          {movimiento?.solapado && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
              <WarningAmber fontSize="small" className="text-amber-600" />
              <Typography variant="caption" className="text-amber-900">
                Ese profesional ya tiene otro turno en esa franja. Podés guardarlo igual si
                es una urgencia o un sobreturno.
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setMovimiento(null)} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={confirmarMovimiento}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Guardar cambio
          </Button>
        </DialogActions>
      </Dialog>

      <CSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </div>
  );
}
