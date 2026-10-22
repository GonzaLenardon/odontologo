import { useState, useMemo } from 'react';
import {
  Typography,
  TextField,
  MenuItem,
  Paper,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  MedicalServices as MedicalIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import Historial from '../components/abm/Historial';
import Pacientes from '../components/abm/Pacientes';
import Cuatro from '../components/abm/Cuadrado';
import Estudios from '../components/abm/Estudios';
import { useDemo } from '../context/DemoContext';
import { odontologos } from '../data/catalogos';

const tabs = [
  { title: 'Datos Personales', abm: 'datos', icon: <PersonIcon fontSize="small" /> },
  { title: 'Historial', abm: 'historial', icon: <CalendarIcon fontSize="small" /> },
  { title: 'Ficha Clínica', abm: 'ficha', icon: <MedicalIcon fontSize="small" /> },
  { title: 'Estudios', abm: 'estudios', icon: <ImageIcon fontSize="small" /> },
];

export default function HomeNew() {
  const { getAll } = useDemo();
  const [currentTab, setCurrentTab] = useState('datos');
  const [busqueda, setBusqueda] = useState('');

  const pacientes = getAll('pacientes');
  const historial = getAll('historial');

  const pacienteSeleccionado = useMemo(
    () => pacientes.find((p) => p.nombres.toLowerCase().includes(busqueda.toLowerCase())),
    [pacientes, busqueda]
  );

  const historialFiltrado = useMemo(
    () =>
      pacienteSeleccionado
        ? historial.filter((h) => h.pacienteId === pacienteSeleccionado.id)
        : [],
    [historial, pacienteSeleccionado]
  );

  const odontologo = pacienteSeleccionado
    ? odontologos.find((o) => o.id === pacienteSeleccionado.odontologoId)
    : null;

  const renderContent = () => {
    if (!pacienteSeleccionado) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <PersonIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body2">Seleccioná un paciente para ver su información</Typography>
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case 'datos':
        return <Pacientes paciente={pacienteSeleccionado} />;
      case 'historial':
        return <Historial historial={historialFiltrado} />;
      case 'ficha':
        return <Cuatro />;
      case 'estudios':
        return <Estudios />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Selector de paciente */}
      <Paper elevation={0} className="p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-4 flex-wrap">
          <TextField
            select
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setCurrentTab('datos');
            }}
            size="small"
            sx={{ minWidth: 300, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            label="Seleccionar paciente"
          >
            <MenuItem value="">
              <em>Seleccionar paciente...</em>
            </MenuItem>
            {pacientes.map((p) => (
              <MenuItem key={p.id} value={p.nombres}>
                {p.nombres}
              </MenuItem>
            ))}
          </TextField>
          <Typography variant="body2" color="text.secondary">
            {pacientes.length} pacientes en la clínica
          </Typography>
        </div>
      </Paper>

      {/* Info del paciente seleccionado */}
      {pacienteSeleccionado && (
        <Paper
          elevation={0}
          className="p-5 rounded-xl border border-gray-200 bg-gradient-to-r from-primary-800 to-primary-900"
        >
          <div className="flex items-center gap-5 flex-wrap">
            <Avatar
              src={pacienteSeleccionado.foto}
              sx={{ width: 72, height: 72, bgcolor: '#4a90d9', fontSize: '1.5rem', fontWeight: 700 }}
            >
              {pacienteSeleccionado.nombres.charAt(0)}
            </Avatar>
            <div className="flex-1 min-w-0">
              <Typography variant="h6" fontWeight="700" className="text-white">
                {pacienteSeleccionado.nombres}
              </Typography>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <Chip
                  label={pacienteSeleccionado.obraSocialId ? 'Obra social registrada' : 'Particular'}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '0.75rem' }}
                />
                <span className="text-primary-200 text-sm">
                  Nro. {pacienteSeleccionado.nroAfiliado}
                </span>
              </div>
            </div>
            <div className="flex gap-6 flex-wrap">
              <div className="text-center">
                <p className="text-primary-300 text-xs mb-1">Tratamiento</p>
                <p className="text-white font-semibold text-sm">
                  {pacienteSeleccionado.tratamiento}
                </p>
              </div>
              <div className="text-center">
                <p className="text-primary-300 text-xs mb-1">Odontólogo</p>
                <p className="text-white font-semibold text-sm">
                  {odontologo ? odontologo.nombre : 'Sin asignar'}
                </p>
              </div>
            </div>
          </div>
        </Paper>
      )}

      {/* Tabs */}
      {pacienteSeleccionado && (
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.abm;
            return (
              <button
                key={tab.abm}
                onClick={() => setCurrentTab(tab.abm)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                  isActive ? 'bg-dental text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.title}
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      <div>{renderContent()}</div>
    </div>
  );
}
