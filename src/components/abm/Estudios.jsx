import { useState } from 'react';
import {
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';

import pano from '../../assets/panoramica.jpeg';
import pano1 from '../../assets/panoramica1.jpeg';
import pano2 from '../../assets/panoramica2.jpeg';
import pano3 from '../../assets/panoramica4.jpeg';
import pano4 from '../../assets/panoramica5.jpg';

const ESTUDIOS = [
  { id: 1, src: pano, titulo: 'Panorámica 2023', descripcion: 'Estudio panorámico anual de control' },
  { id: 2, src: pano1, titulo: 'Panorámica 2024', descripcion: 'Seguimiento de tratamiento de ortodoncia' },
  { id: 3, src: pano2, titulo: 'Panorámica 2024 - Control', descripcion: 'Control trimestral post-operatorio' },
  { id: 4, src: pano3, titulo: 'Panorámica 2025', descripcion: 'Estudio previo a implantes superiores' },
  { id: 5, src: pano4, titulo: 'Panorámica 2025 - Pre-ortodoncia', descripcion: 'Planificación de brackets inferiores' },
];

const DETALLES = [
  'Dientes superiores e inferiores',
  'Mandíbula y maxilar',
  'Senos paranasales',
  'Articulación temporomandibular (ATM)',
];

const Estudios = () => {
  const [estudioSeleccionado, setEstudioSeleccionado] = useState(null);

  return (
    <>
      <Paper elevation={0} className="p-5 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <ImageIcon fontSize="small" className="text-gray-400" />
          <Typography variant="subtitle1" fontWeight="600">
            Estudios por imagen
          </Typography>
        </div>
        <Typography variant="body2" color="text.secondary" className="mb-4">
          Radiografías panorámicas del paciente. Hacé click para ver el detalle.
        </Typography>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {ESTUDIOS.map((estudio) => (
            <button
              key={estudio.id}
              onClick={() => setEstudioSeleccionado(estudio)}
              className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white hover:border-dental hover:shadow-md transition-all"
            >
              <div className="h-[160px] flex items-center justify-center bg-gray-50 overflow-hidden">
                <img
                  alt={estudio.titulo}
                  src={estudio.src}
                  className="w-auto h-[200px] max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-left">
                <p className="text-xs font-semibold text-gray-800 leading-tight">
                  {estudio.titulo}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                  {estudio.descripcion}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Paper>

      <Dialog
        open={!!estudioSeleccionado}
        onClose={() => setEstudioSeleccionado(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ImageIcon fontSize="small" className="text-dental" />
          <span className="font-semibold flex-1">{estudioSeleccionado?.titulo}</span>
          <IconButton onClick={() => setEstudioSeleccionado(null)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="flex justify-center bg-gray-900 rounded-xl p-4 mb-4">
            <img
              alt={estudioSeleccionado?.titulo}
              src={estudioSeleccionado?.src}
              className="max-h-[380px] w-auto object-contain"
            />
          </div>
          <Typography variant="body2" color="text.secondary" className="mb-3">
            {estudioSeleccionado?.descripcion}. Estudio de imagen que muestra una vista
            completa de la boca, incluyendo:
          </Typography>
          <div className="flex flex-wrap gap-2">
            {DETALLES.map((d) => (
              <Chip key={d} label={d} size="small" variant="outlined" />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Estudios;
