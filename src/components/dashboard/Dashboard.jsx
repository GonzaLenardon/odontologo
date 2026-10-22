import { useMemo } from 'react';
import {
  Paper,
  Typography,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  NotificationsActive as NotificationIcon,
  PendingActions as PendingIcon,
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon,
  ChevronRight as ChevronRightIcon,
  Description as DescriptionIcon,
  Payments as PaymentsIcon,
  EventAvailable as EventAvailableIcon,
  WarningAmber as WarningIcon,
} from '@mui/icons-material';
import { useDemo } from '../../context/DemoContext';
import { odontologos } from '../../data/catalogos';
import { saldoPendiente, resumenFacturacion, formatMoneda } from '../../data/presupuestos';

const formatFechaLarga = (iso) => {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
};

const hoyISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function Dashboard({ onNavegar }) {
  const { getAll } = useDemo();

  const turnos = getAll('turnos');
  const pacientes = getAll('pacientes');
  const presupuestos = getAll('presupuestos');
  const pagos = getAll('pagos');
  const envios = getAll('envios');
  const actividad = getAll('actividad');

  const hoy = hoyISO();

  const turnosHoy = useMemo(
    () => turnos.filter((t) => t.fecha === hoy && t.estado !== 'cancelado'),
    [turnos, hoy]
  );

  const confirmadosHoy = turnosHoy.filter((t) => t.estado === 'confirmado');
  const pendientesHoy = turnosHoy.filter((t) => t.estado === 'pendiente');
  const urgencias = turnos.filter((t) => t.estado === 'urgencia').length;

  const resumen = useMemo(
    () => resumenFacturacion(presupuestos, pagos),
    [presupuestos, pagos]
  );

  const porCobrar = presupuestos.filter(
    (p) => (p.estado === 'aceptado' || p.estado === 'enviado') && saldoPendiente(p, pagos) > 0
  );

  const proximos = useMemo(
    () =>
      [...turnos]
        .filter((t) => t.fecha >= hoy && t.estado !== 'cancelado')
        .sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`))
        .slice(0, 6),
    [turnos, hoy]
  );

  const getPaciente = (id) => pacientes.find((p) => p.id === id);
  const getOdontologo = (id) => odontologos.find((o) => o.id === id);

  // Mini calendario del mes
  const hoyDate = new Date();
  const year = hoyDate.getFullYear();
  const month = hoyDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const offset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const celdas = [...Array(offset).fill(null)];
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    celdas.push(new Date(d));
  }

  const kpis = [
    {
      label: 'Turnos hoy',
      value: turnosHoy.length,
      sub: `${confirmadosHoy.length} confirmados · ${pendientesHoy.length} pendientes`,
      icon: <CalendarIcon />,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
    {
      label: 'Pacientes activos',
      value: pacientes.length,
      sub: `${pacientes.filter((p) => p.odontologoId).length} con profesional asignado`,
      icon: <PeopleIcon />,
      bg: 'bg-violet-50',
      color: 'text-violet-600',
    },
    {
      label: 'Facturación del mes',
      value: formatMoneda(resumen.facturado),
      sub: `${formatMoneda(resumen.cobrado)} cobrados`,
      icon: <TrendingUpIcon />,
      bg: 'bg-emerald-50',
      color: 'text-emerald-600',
    },
    {
      label: 'Recordatorios enviados',
      value: envios.length,
      sub: '82% menos ausencias',
      icon: <NotificationIcon />,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Saludo */}
      <div>
        <Typography variant="h5" fontWeight="700" className="text-primary-900">
          Panel de control
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {MESES[month]} {year} · {turnosHoy.length} turnos para hoy ·{' '}
          {porCobrar.length} presupuestos por cobrar
        </Typography>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Paper key={kpi.label} elevation={0} className="p-4 rounded-xl border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <Typography variant="h4" fontWeight="800" className="leading-none mb-1">
                  {kpi.value}
                </Typography>
                <Typography variant="body2" fontWeight="600" color="text.primary">
                  {kpi.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {kpi.sub}
                </Typography>
              </div>
              <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                <span className={kpi.color}>{kpi.icon}</span>
              </div>
            </div>
          </Paper>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Próximos turnos */}
        <Paper elevation={0} className="p-5 rounded-xl border border-gray-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ScheduleIcon fontSize="small" className="text-gray-400" />
              <Typography variant="subtitle1" fontWeight="600">
                Próximos turnos
              </Typography>
            </div>
            <Button
              size="small"
              endIcon={<ChevronRightIcon />}
              onClick={() => onNavegar?.('/agenda')}
              sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Ver agenda
            </Button>
          </div>

          {proximos.length > 0 ? (
            <div className="space-y-2">
              {proximos.map((t) => {
                const paciente = getPaciente(t.pacienteId);
                const od = getOdontologo(t.odontologoId);
                const esHoy = t.fecha === hoy;
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 ${
                        esHoy ? 'bg-dental text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <span className="text-[10px] leading-none">
                        {esHoy ? 'HOY' : t.fecha.split('-')[2]}
                      </span>
                      <span className="text-sm font-bold leading-tight">{t.hora}</span>
                    </div>
                    <Avatar
                      src={paciente?.foto}
                      sx={{ width: 36, height: 36, bgcolor: 'primary.300', fontSize: '0.9rem' }}
                    >
                      {paciente?.nombres.charAt(0)}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {paciente?.nombres}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {t.tipo} · {od?.nombre}
                      </p>
                    </div>
                    {t.estado === 'urgencia' && (
                      <Chip
                        icon={<WarningIcon sx={{ fontSize: '14px !important' }} />}
                        label="Urgencia"
                        size="small"
                        color="error"
                        sx={{ fontSize: '0.65rem' }}
                      />
                    )}
                    {t.estado === 'confirmado' && (
                      <Chip
                        icon={<EventAvailableIcon sx={{ fontSize: '14px !important' }} />}
                        label="Confirmado"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontSize: '0.65rem' }}
                      />
                    )}
                    {t.estado === 'pendiente' && (
                      <Chip
                        label="Pendiente"
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ fontSize: '0.65rem' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <ScheduleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body2">No hay turnos programados</Typography>
            </div>
          )}
        </Paper>

        {/* Calendario + actividad */}
        <div className="space-y-4">
          <Paper elevation={0} className="p-5 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon fontSize="small" className="text-gray-400" />
              <Typography variant="subtitle1" fontWeight="600">
                {MESES[month]} {year}
              </Typography>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {DIAS.map((d) => (
                <div key={d} className="text-[10px] font-semibold text-gray-400 py-1">
                  {d}
                </div>
              ))}
              {celdas.map((d, i) => {
                if (!d) return <div key={`v${i}`} />;
                const iso = new Date(
                  d.getTime() - d.getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .split('T')[0];
                const n = turnos.filter((t) => t.fecha === iso && t.estado !== 'cancelado').length;
                const esHoy = iso === hoy;
                return (
                  <div
                    key={i}
                    className={`relative h-8 rounded-lg flex items-center justify-center text-xs ${
                      esHoy
                        ? 'bg-dental text-white font-bold'
                        : n > 0
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-500'
                    }`}
                  >
                    {d.getDate()}
                    {n > 0 && !esHoy && (
                      <span className="absolute bottom-0.5 text-[8px] leading-none text-blue-500">
                        {n}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Paper>

          <Paper elevation={0} className="p-5 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <PendingIcon fontSize="small" className="text-gray-400" />
              <Typography variant="subtitle1" fontWeight="600">
                Por cobrar
              </Typography>
              <Chip label={porCobrar.length} size="small" variant="outlined" />
            </div>

            {porCobrar.length > 0 ? (
              <div className="space-y-2">
                {porCobrar.slice(0, 4).map((p) => {
                  const paciente = getPaciente(p.pacienteId);
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-amber-900 truncate">
                          {paciente?.nombres}
                        </p>
                        <p className="text-[10px] text-amber-700">Presupuesto #{p.id}</p>
                      </div>
                      <span className="text-sm font-bold text-amber-800 shrink-0 ml-2">
                        {formatMoneda(saldoPendiente(p, pagos))}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                No hay presupuestos pendientes de cobro
              </p>
            )}

            <Button
              fullWidth
              size="small"
              startIcon={<PaymentsIcon />}
              onClick={() => onNavegar?.('/presupuestos')}
              sx={{ mt: 2, borderRadius: '8px', textTransform: 'none' }}
            >
              Ir a Presupuesto y Pagos
            </Button>
          </Paper>
        </div>
      </div>

      {/* Actividad reciente */}
      <Paper elevation={0} className="p-5 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <DescriptionIcon fontSize="small" className="text-gray-400" />
          <Typography variant="subtitle1" fontWeight="600">
            Actividad reciente
          </Typography>
        </div>

        {actividad.length > 0 ? (
          <div className="space-y-0">
            {actividad.slice(0, 8).map((a, i) => (
              <div key={a.id} className="flex items-start gap-3 pb-3 relative">
                {i < Math.min(actividad.length, 8) - 1 && (
                  <span className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-200" />
                )}
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    a.tipo === 'pago'
                      ? 'bg-emerald-100 text-emerald-600'
                      : a.tipo === 'presupuesto'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}
                >
                  {a.tipo === 'pago' ? (
                    <PaymentsIcon sx={{ fontSize: 14 }} />
                  ) : a.tipo === 'presupuesto' ? (
                    <DescriptionIcon sx={{ fontSize: 14 }} />
                  ) : (
                    <TimeIcon sx={{ fontSize: 14 }} />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-gray-800">{a.texto}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.fecha).toLocaleString('es-AR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <DescriptionIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2">
              Todavía no hay actividad registrada. Mové un turno o cobrá un presupuesto y
              vas a ver el movimiento acá.
            </Typography>
          </div>
        )}
      </Paper>
    </div>
  );
}
