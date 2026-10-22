import { useState, useCallback } from 'react';
import {
  Paper,
  Typography,
  Tooltip,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popover,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { dientesSuperiores, dientesInferiores, tipoDiente } from '../../data/dientes';

const ESTADOS_CLINICOS = [
  { id: 'sano', label: 'Sano', color: '#ffffff', descripcion: 'Diente sin patología' },
  { id: 'caries', label: 'Caries', color: '#ef4444', descripcion: 'Lesión de caries activa' },
  { id: 'obturacion', label: 'Obturación', color: '#3b82f6', descripcion: 'Restauración amalgama/resina' },
  { id: 'corona', label: 'Corona', color: '#f59e0b', descripcion: 'Corona protésica' },
  { id: 'puente', label: 'Puente', color: '#8b5cf6', descripcion: 'Elemento de puente fijo' },
  { id: 'implante', label: 'Implante', color: '#06b6d4', descripcion: 'Implante osteointegrado' },
  { id: 'endodoncia', label: 'Endodoncia', color: '#ec4899', descripcion: 'Tratamiento de conducto' },
  { id: 'extraccion', label: 'Extracción', color: '#1e293b', descripcion: 'Diente extraído (ausente)' },
  { id: 'fractura', label: 'Fractura', color: '#f97316', descripcion: 'Fractura coronaria/radicular' },
  { id: 'desgaste', label: 'Desgaste', color: '#84cc16', descripcion: 'Atrición / erosión / abrasión' },
  { id: 'movilidad', label: 'Movilidad', color: '#a855f7', descripcion: 'Movilidad patológica' },
  { id: 'apiñamiento', label: 'Apiñamiento', color: '#14b8a6', descripcion: 'Malposición dentaria' },
  { id: 'gingivitis', label: 'Gingivitis', color: '#fb923c', descripcion: 'Inflamación gingival' },
  { id: 'periodontitis', label: 'Periodontitis', color: '#dc2626', descripcion: 'Enfermedad periodontal' },
  { id: 'sellante', label: 'Sellante', color: '#22d3ee', descripcion: 'Sellante de fisuras' },
  { id: 'provisional', label: 'Provisional', color: '#d4d4d8', descripcion: 'Restauración temporal' },
  { id: 'erupcion', label: 'Erupción', color: '#a3e635', descripcion: 'En erupción parcial' },
  { id: 'impactado', label: 'Impactado', color: '#7c3aed', descripcion: 'Diente retenido / impactado' },
];

const CARAS = [
  { id: 'Vestibular', desc: 'Cara hacia la mejilla' },
  { id: 'Lingual', desc: 'Cara hacia la lengua' },
  { id: 'Mesial', desc: 'Cara hacia el centro' },
  { id: 'Distal', desc: 'Cara hacia atrás' },
  { id: 'Oclusal/Incisal', desc: 'Cara masticatoria' },
];

const COLOR_TEXTO_CLARO = ['sano', 'provisional', 'erupcion', 'sellante'];

export default function Cuatro() {
  const [estadoDientes, setEstadoDientes] = useState({});
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('caries');
  const [historial, setHistorial] = useState([]);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [popover, setPopover] = useState({ anchorEl: null, diente: null });

  const estadoActual = ESTADOS_CLINICOS.find((e) => e.id === estadoSeleccionado);

  const getEstado = (diente, cara) => estadoDientes[`${diente}-${cara}`];

  const carasConHallego = (diente) =>
    CARAS.filter((c) => estadoDientes[`${diente}-${c.id}`]).map((c) => c.id);

  const handleCaraClick = useCallback(
    (diente, cara) => {
      const key = `${diente}-${cara}`;
      setEstadoDientes((prev) => {
        const nuevo = { ...prev };
        if (estadoSeleccionado === 'sano') delete nuevo[key];
        else nuevo[key] = estadoSeleccionado;
        return nuevo;
      });
      setHistorial((prev) => [
        ...prev,
        {
          fecha: new Date().toLocaleString('es-AR'),
          diente,
          cara,
          estado: estadoSeleccionado,
          estadoLabel: estadoActual.label,
        },
      ]);
    },
    [estadoSeleccionado, estadoActual]
  );

  const handleUndo = () => {
    if (historial.length === 0) return;
    const ultimo = historial[historial.length - 1];
    const key = `${ultimo.diente}-${ultimo.cara}`;
    setEstadoDientes((prev) => {
      const nuevo = { ...prev };
      delete nuevo[key];
      return nuevo;
    });
    setHistorial((prev) => prev.slice(0, -1));
  };

  const totalMarcados = Object.keys(estadoDientes).length;

  const renderDiente = (d) => {
    const hallazgos = carasConHallego(d.id);
    const tieneHallazgo = hallazgos.length > 0;
    const colorDominante = tieneHallazgo
      ? ESTADOS_CLINICOS.find((e) => e.id === estadoDientes[`${d.id}-${hallazgos[0]}`])?.color
      : null;

    return (
      <Tooltip
        key={d.id}
        title={
          tieneHallazgo ? (
            <div>
              <p className="font-semibold mb-0.5">
                Diente {d.id} — {tipoDiente(d.id)}
              </p>
              {hallazgos.map((cara) => {
                const est = ESTADOS_CLINICOS.find((e) => e.id === estadoDientes[`${d.id}-${cara}`]);
                return (
                  <p key={cara} className="text-xs">
                    {cara}: {est?.label}
                  </p>
                );
              })}
            </div>
          ) : (
            <span>
              Diente {d.id} — {tipoDiente(d.id)}
            </span>
          )
        }
        arrow
        placement="top"
      >
        <button
          onClick={(e) => setPopover({ anchorEl: e.currentTarget, diente: d.id })}
          className={`group relative flex flex-col items-center rounded-xl p-1 transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-dental ${
            tieneHallazgo ? 'bg-amber-50' : ''
          }`}
        >
          <span
            className={`absolute inset-0 rounded-xl border-2 transition-all ${
              tieneHallazgo ? 'border-amber-300' : 'border-transparent'
            }`}
          />
          <img
            src={d.img}
            alt={`Diente ${d.id}`}
            className="h-16 w-auto object-contain relative group-hover:scale-110 transition-transform duration-200"
            style={{ filter: tieneHallazgo ? 'none' : 'grayscale(0.35)' }}
          />
          {tieneHallazgo && (
            <span
              className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: colorDominante }}
            />
          )}
          <span className="text-[10px] font-semibold text-gray-600 relative mt-0.5">
            {d.id}
          </span>
        </button>
      </Tooltip>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Typography variant="h5" fontWeight="700" className="text-primary-900">
            Odontograma Interactivo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Elegí el estado clínico y hacé click en el diente para marcar la cara afectada
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<UndoIcon />}
            onClick={handleUndo}
            disabled={historial.length === 0}
            size="small"
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Deshacer
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => setDialogAbierto(true)}
            size="small"
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Guardar ({totalMarcados})
          </Button>
        </div>
      </div>

      {/* Selector de estado clínico */}
      <Paper elevation={0} className="p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <MedicalServicesIcon fontSize="small" className="text-gray-400" />
          <Typography variant="subtitle2" fontWeight="600">
            Estado clínico:
          </Typography>
          <Chip
            label={estadoActual?.label}
            size="small"
            sx={{
              bgcolor: estadoActual?.color,
              color: COLOR_TEXTO_CLARO.includes(estadoSeleccionado) ? '#1e293b' : '#fff',
              fontWeight: 600,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {estadoActual?.descripcion}
          </Typography>
        </div>
        <div className="flex flex-wrap gap-2">
          {ESTADOS_CLINICOS.map((estado) => (
            <Tooltip key={estado.id} title={estado.descripcion} arrow>
              <button
                onClick={() => setEstadoSeleccionado(estado.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all ${
                  estadoSeleccionado === estado.id
                    ? 'border-blue-500 shadow-md scale-105'
                    : 'border-transparent hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: estado.color,
                  color: COLOR_TEXTO_CLARO.includes(estado.id) ? '#1e293b' : '#fff',
                }}
              >
                {estado.label}
              </button>
            </Tooltip>
          ))}
        </div>
      </Paper>

      {/* Odontograma */}
      <Paper
        elevation={0}
        className="p-6 rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 overflow-x-auto"
      >
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight="700"
          className="mb-3 block text-center uppercase tracking-wider"
        >
          Arcada superior
        </Typography>
        <div className="flex justify-center gap-0.5 min-w-max pb-2">
          {dientesSuperiores.map(renderDiente)}
        </div>

        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            Línea media
          </span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="flex justify-center gap-0.5 min-w-max pb-2">
          {dientesInferiores.map(renderDiente)}
        </div>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight="700"
          className="mt-3 block text-center uppercase tracking-wider"
        >
          Arcada inferior
        </Typography>
      </Paper>

      {/* Popover de caras del diente */}
      <Popover
        open={!!popover.anchorEl}
        anchorEl={popover.anchorEl}
        onClose={() => setPopover({ anchorEl: null, diente: null })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{
          sx: {
            borderRadius: '14px',
            p: 1,
            minWidth: 220,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          },
        }}
      >
        {popover.diente != null && (
          <>
            <Typography variant="subtitle2" fontWeight="700" className="px-1 pb-1.5">
              Diente {popover.diente} — {tipoDiente(popover.diente)}
            </Typography>
            <div className="space-y-1">
              {CARAS.map((cara) => {
                const estadoId = getEstado(popover.diente, cara.id);
                const est = ESTADOS_CLINICOS.find((e) => e.id === estadoId);
                return (
                  <button
                    key={cara.id}
                    onClick={() => handleCaraClick(popover.diente, cara.id)}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      estadoId ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-left">
                      <span className="font-medium block">{cara.id}</span>
                      <span className="text-[10px] text-gray-400">{cara.desc}</span>
                    </span>
                    <span
                      className="w-5 h-5 rounded-full border-2 border-white shadow-sm shrink-0"
                      style={{
                        backgroundColor: est ? est.color : '#f1f5f9',
                        border: est ? 'none' : '1px solid #e2e8f0',
                      }}
                    />
                  </button>
                );
              })}
            </div>
            <Typography variant="caption" className="block text-gray-400 text-center mt-1.5">
              Estado: <strong>{estadoActual?.label}</strong>
            </Typography>
          </>
        )}
      </Popover>

      {/* Historial de cambios */}
      {historial.length > 0 && (
        <Paper elevation={0} className="p-4 rounded-xl border border-gray-200">
          <Typography variant="subtitle2" fontWeight="600" className="mb-2">
            Historial de cambios ({historial.length})
          </Typography>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {historial
              .slice()
              .reverse()
              .slice(0, 20)
              .map((h, i) => {
                const est = ESTADOS_CLINICOS.find((e) => e.id === h.estado);
                return (
                  <div key={i} className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="text-gray-400 w-32 shrink-0">{h.fecha}</span>
                    <span className="font-medium">Diente {h.diente}</span>
                    <span>—</span>
                    <span>{h.cara}</span>
                    <span>→</span>
                    <span
                      className="px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: est?.color,
                        color: COLOR_TEXTO_CLARO.includes(h.estado) ? '#1e293b' : '#fff',
                      }}
                    >
                      {h.estadoLabel}
                    </span>
                  </div>
                );
              })}
          </div>
        </Paper>
      )}

      {/* Dialog de guardado */}
      <Dialog
        open={dialogAbierto}
        onClose={() => setDialogAbierto(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Guardar Odontograma</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Se guardará el odontograma con {totalMarcados} hallazgos registrados.
          </Typography>
          <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
            {Object.entries(estadoDientes).map(([key, estadoId]) => {
              const est = ESTADOS_CLINICOS.find((e) => e.id === estadoId);
              return (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: est?.color }}
                  />
                  <span>
                    Diente {key.split('-')[0]} — {key.split('-')[1]}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium">{est?.label}</span>
                </div>
              );
            })}
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogAbierto(false)} sx={{ borderRadius: '8px', textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              alert('Odontograma guardado (simulación)');
              setDialogAbierto(false);
            }}
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Confirmar guardado
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
