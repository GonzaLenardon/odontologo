import { useState } from 'react';
import {
  Paper,
  Typography,
  Chip,
  Avatar,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  Badge as BadgeIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import odontologo1 from '../../assets/odontologo1.jpeg';
import odontologo2 from '../../assets/odontologo2.jpeg';
import { useDemo } from '../../context/DemoContext';
import { odontologos } from '../../data/catalogos';

const FOTOS = { 1: odontologo1, 2: odontologo2 };

const Odontologos = () => {
  const { getAll } = useDemo();
  const [seleccionado, setSeleccionado] = useState(null);

  const turnos = getAll('turnos');
  const pacientes = getAll('pacientes');

  const getTurnosOdontologo = (id) => turnos.filter((t) => t.odontologoId === id);
  const getPacientesOdontologo = (id) => pacientes.filter((p) => p.odontologoId === id);

  return (
    <div className="space-y-4">
      <Paper elevation={0} className="p-5 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <HospitalIcon fontSize="small" className="text-gray-400" />
          <Typography variant="subtitle1" fontWeight="600">
            Equipo Odontológico
          </Typography>
          <Chip label={odontologos.length} size="small" variant="outlined" />
        </div>
        <Typography variant="body2" color="text.secondary">
          Profesionales de la clínica, con su especialidad, horario y cartera de pacientes.
        </Typography>
      </Paper>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {odontologos.map((o) => {
          const turnosOd = getTurnosOdontologo(o.id);
          const pacientesOd = getPacientesOdontologo(o.id);
          const esSeleccionado = seleccionado === o.id;

          return (
            <Card
              key={o.id}
              elevation={0}
              onClick={() => setSeleccionado(esSeleccionado ? null : o.id)}
              className={`cursor-pointer border-2 rounded-2xl transition-all ${
                esSeleccionado
                  ? 'border-dental shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <CardContent sx={{ p: '20px !important' }}>
                <div className="flex items-start gap-4">
                  <Avatar
                    src={FOTOS[o.id]}
                    sx={{ width: 64, height: 64, bgcolor: 'primary.700' }}
                  >
                    {o.nombre.charAt(0)}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Typography variant="h6" fontWeight="700" className="leading-tight">
                      {o.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {o.especialidad}
                    </Typography>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Chip
                        label={`Mat. ${o.matricula}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                      <Chip
                        icon={<ScheduleIcon sx={{ fontSize: '14px !important' }} />}
                        label={`${o.horarios.inicio} - ${o.horarios.fin}`}
                        size="small"
                        sx={{ fontSize: '0.7rem', bgcolor: 'primary.50' }}
                      />
                      <Chip
                        label={`${pacientesOd.length} pacientes`}
                        size="small"
                        sx={{ fontSize: '0.7rem', bgcolor: 'emerald.50' }}
                      />
                    </div>
                  </div>
                </div>

                {esSeleccionado && (
                  <>
                    <Divider className="my-4" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <PhoneIcon sx={{ fontSize: 14 }} /> Teléfono
                        </p>
                        <p className="text-sm font-medium">{o.telefono}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <EmailIcon sx={{ fontSize: 14 }} /> Email
                        </p>
                        <p className="text-sm font-medium break-all">{o.email}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <BadgeIcon sx={{ fontSize: 14 }} /> Turnos asignados ({turnosOd.length})
                      </p>
                      {turnosOd.length > 0 ? (
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {turnosOd.map((t) => {
                            const paciente = pacientes.find((p) => p.id === t.pacienteId);
                            return (
                              <div
                                key={t.id}
                                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm"
                              >
                                <span className="font-medium">
                                  {paciente ? paciente.nombres : 'Paciente'}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  {t.fecha.split('-').reverse().join('/')} · {t.hora}
                                </span>
                                <Chip
                                  label={t.estado}
                                  size="small"
                                  color={t.estado === 'confirmado' ? 'success' : 'warning'}
                                  sx={{ fontSize: '0.6rem', height: 18 }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">Sin turnos asignados</p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Odontologos;
