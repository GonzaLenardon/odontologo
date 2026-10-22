import { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Switch,
  TextField,
  Chip,
  Card,
  CardContent,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import ScheduleIcon from '@mui/icons-material/Schedule';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useDemo } from '../../context/DemoContext';
import { odontologos } from '../../data/catalogos';
import CSnackbar from '../elements/CSnackbar';

const PLANTILLAS = [
  {
    id: 1,
    nombre: 'Recordatorio estándar',
    mensaje:
      'Hola {paciente}, te recordamos tu turno el {fecha} a las {hora} con {odontologo}. ¿Podés confirmar?',
  },
  {
    id: 2,
    nombre: 'Confirmación de turno',
    mensaje:
      '¡Gracias {paciente}! Tu turno del {fecha} a las {hora} está confirmado. Te esperamos.',
  },
  {
    id: 3,
    nombre: 'Cancelación',
    mensaje:
      '{paciente}, lamentamos que no puedas asistir. Tu turno del {fecha} ha sido cancelado. ¿Querés reprogramar?',
  },
];

const formatFechaLarga = (iso) => {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
};

export default function Recordatorios() {
  const { getAll, create, registrarActividad } = useDemo();

  const turnos = getAll('turnos');
  const pacientes = getAll('pacientes');
  const envios = getAll('envios');

  const [config, setConfig] = useState({
    whatsappHabilitado: true,
    emailHabilitado: true,
    anticipacionHoras: 24,
    horarioEnvio: '09:00',
    plantillaActiva: 1,
  });
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const hoy = new Date();
  const hoyISO = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];

  const turnosProximos = turnos.filter((t) => {
    if (t.estado === 'cancelado') return false;
    const diff = (new Date(`${t.fecha}T${t.hora}`) - hoy) / (1000 * 60 * 60);
    return diff > -12 && diff <= config.anticipacionHoras * 3;
  });

  const getPacienteNombre = (id) => {
    const p = pacientes.find((p) => p.id === id);
    return p ? p.nombres : 'Desconocido';
  };

  const getOdontologoNombre = (id) => {
    const o = odontologos.find((o) => o.id === id);
    return o ? o.nombre : 'Desconocido';
  };

  const yaEnviado = (turnoId, canal) =>
    envios.some((e) => e.turnoId === turnoId && e.canal === canal);

  const enviar = (turno, canal) => {
    const plantilla = PLANTILLAS.find((p) => p.id === config.plantillaActiva);
    const mensaje = plantilla.mensaje
      .replace('{paciente}', getPacienteNombre(turno.pacienteId))
      .replace('{fecha}', formatFechaLarga(turno.fecha))
      .replace('{hora}', turno.hora)
      .replace('{odontologo}', getOdontologoNombre(turno.odontologoId));

    create('envios', {
      turnoId: turno.id,
      pacienteId: turno.pacienteId,
      canal,
      mensaje,
      fecha: new Date().toISOString(),
    });
    registrarActividad(
      'recordatorio',
      `Recordatorio por ${canal === 'whatsapp' ? 'WhatsApp' : 'email'} a ${getPacienteNombre(turno.pacienteId)}`
    );
    setSnackbar({
      open: true,
      severity: 'success',
      message: `Recordatorio enviado por ${
        canal === 'whatsapp' ? 'WhatsApp' : 'email'
      } a ${getPacienteNombre(turno.pacienteId)}`,
    });
  };

  const enviarTodos = () => {
    turnosProximos.forEach((t) => {
      if (config.whatsappHabilitado && !yaEnviado(t.id, 'whatsapp')) enviar(t, 'whatsapp');
      if (config.emailHabilitado && !yaEnviado(t.id, 'email')) enviar(t, 'email');
    });
  };

  const confirmar = (turno) => {
    setSnackbar({
      open: true,
      severity: 'success',
      message: `${getPacienteNombre(turno.pacienteId)} confirmó su turno. La agenda se actualizó sola.`,
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <Typography variant="h5" fontWeight="700" className="text-primary-900">
          Recordatorios Automáticos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Reducí ausencias con notificaciones automáticas por WhatsApp y email
        </Typography>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Turnos a notificar',
            value: turnosProximos.length,
            icon: <ScheduleIcon />,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Recordatorios enviados',
            value: envios.length,
            icon: <SendIcon />,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Turnos confirmados',
            value: turnos.filter((t) => t.estado === 'confirmado').length,
            icon: <CheckCircleIcon />,
            color: 'text-green-600',
            bg: 'bg-green-50',
          },
          {
            label: 'Reducción de ausencias',
            value: '82%',
            icon: <TrendingDownIcon />,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
          },
        ].map((stat, i) => (
          <Paper key={i} elevation={0} className="p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <div>
                <Typography variant="h6" fontWeight="700" className="leading-tight">
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </div>
            </div>
          </Paper>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Configuración */}
        <Paper elevation={0} className="p-5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon fontSize="small" className="text-gray-500" />
            <Typography variant="subtitle1" fontWeight="600">
              Configuración
            </Typography>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WhatsAppIcon fontSize="small" className="text-green-600" />
                <Typography variant="body2">WhatsApp</Typography>
              </div>
              <Switch
                checked={config.whatsappHabilitado}
                onChange={(e) => setConfig({ ...config, whatsappHabilitado: e.target.checked })}
                size="small"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EmailIcon fontSize="small" className="text-blue-600" />
                <Typography variant="body2">Email</Typography>
              </div>
              <Switch
                checked={config.emailHabilitado}
                onChange={(e) => setConfig({ ...config, emailHabilitado: e.target.checked })}
                size="small"
              />
            </div>

            <Divider />

            <TextField
              label="Anticipación (horas antes)"
              type="number"
              value={config.anticipacionHoras}
              onChange={(e) => setConfig({ ...config, anticipacionHoras: parseInt(e.target.value) })}
              size="small"
              fullWidth
              inputProps={{ min: 1, max: 72 }}
            />

            <TextField
              label="Horario de envío"
              type="time"
              value={config.horarioEnvio}
              onChange={(e) => setConfig({ ...config, horarioEnvio: e.target.value })}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <Divider />

            <Typography variant="caption" color="text.secondary" fontWeight="600">
              Plantilla activa
            </Typography>
            {PLANTILLAS.map((p) => (
              <div
                key={p.id}
                onClick={() => setConfig({ ...config, plantillaActiva: p.id })}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  config.plantillaActiva === p.id
                    ? 'border-dental bg-dental/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Typography variant="body2" fontWeight="600" fontSize="0.8rem">
                  {p.nombre}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                  {p.mensaje.substring(0, 62)}…
                </Typography>
              </div>
            ))}
          </div>
        </Paper>

        {/* Turnos a notificar */}
        <Paper elevation={0} className="p-5 rounded-xl border border-gray-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="subtitle1" fontWeight="600">
              Turnos a notificar ({turnosProximos.length})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<SendIcon />}
              size="small"
              onClick={enviarTodos}
              disabled={turnosProximos.length === 0}
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              Enviar a todos
            </Button>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto">
            {turnosProximos.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <ScheduleIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2">No hay turnos en el rango configurado</Typography>
              </div>
            ) : (
              turnosProximos.map((turno) => {
                const enviadoW = yaEnviado(turno.id, 'whatsapp');
                const enviadoE = yaEnviado(turno.id, 'email');
                const todosEnviados = enviadoW && enviadoE;
                return (
                  <Card
                    key={turno.id}
                    elevation={0}
                    className="border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                  >
                    <CardContent sx={{ p: '16px !important' }}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Typography variant="body2" fontWeight="600">
                              {getPacienteNombre(turno.pacienteId)}
                            </Typography>
                            <Chip
                              label={turno.estado}
                              size="small"
                              color={turno.estado === 'confirmado' ? 'success' : 'warning'}
                              sx={{ fontSize: '0.65rem', height: 20 }}
                            />
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <AccessTimeIcon fontSize="inherit" />
                              {formatFechaLarga(turno.fecha)} — {turno.hora}
                            </span>
                            <span>{getOdontologoNombre(turno.odontologoId)}</span>
                            <span>{turno.tipo}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {todosEnviados ? (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="Notificado"
                              size="small"
                              color="success"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ) : (
                            <>
                              {config.whatsappHabilitado && (
                                <Tooltip title={enviadoW ? 'Ya enviado' : 'Enviar WhatsApp'}>
                                  <span>
                                    <IconButton
                                      size="small"
                                      disabled={enviadoW}
                                      onClick={() => enviar(turno, 'whatsapp')}
                                      className={enviadoW ? 'opacity-40' : 'bg-green-50 hover:bg-green-100'}
                                    >
                                      <WhatsAppIcon fontSize="small" className="text-green-600" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              )}
                              {config.emailHabilitado && (
                                <Tooltip title={enviadoE ? 'Ya enviado' : 'Enviar email'}>
                                  <span>
                                    <IconButton
                                      size="small"
                                      disabled={enviadoE}
                                      onClick={() => enviar(turno, 'email')}
                                      className={enviadoE ? 'opacity-40' : 'bg-blue-50 hover:bg-blue-100'}
                                    >
                                      <EmailIcon fontSize="small" className="text-blue-600" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              )}
                            </>
                          )}
                          <Tooltip title="Simular respuesta del paciente">
                            <IconButton
                              size="small"
                              onClick={() => confirmar(turno)}
                              className="bg-purple-50 hover:bg-purple-100"
                            >
                              <CheckCircleIcon fontSize="small" className="text-purple-600" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </Paper>
      </div>

      {/* Historial */}
      {envios.length > 0 && (
        <Paper elevation={0} className="p-5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <NotificationsActiveIcon fontSize="small" className="text-gray-400" />
            <Typography variant="subtitle1" fontWeight="600">
              Historial de envíos ({envios.length})
            </Typography>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {envios.map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-3 text-sm text-gray-600 border-b border-gray-100 pb-2 last:border-0"
              >
                {e.canal === 'whatsapp' ? (
                  <WhatsAppIcon fontSize="small" className="text-green-600 mt-0.5" />
                ) : (
                  <EmailIcon fontSize="small" className="text-blue-600 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800">
                    {getPacienteNombre(e.pacienteId)}{' '}
                    <span className="text-gray-400">
                      · {new Date(e.fecha).toLocaleString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 italic truncate">“{e.mensaje}”</p>
                </div>
              </div>
            ))}
          </div>
        </Paper>
      )}

      <CSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </div>
  );
}
