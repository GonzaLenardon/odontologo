import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const PROVEEDORES_INICIALES = [
  { id: 1, nombre: 'Dentsply Sirona', rubro: 'Materiales e insumos', contacto: 'comercial@dentsply.com', telefono: '+54 11 4321-8800' },
  { id: 2, nombre: 'Coltene Whaledent', rubro: 'Anestesia y operatoria', contacto: 'ventas@coltene.com.ar', telefono: '+54 341 422-3344' },
  { id: 3, nombre: 'Lab Dental Rosario', rubro: 'Prótesis y laboratorio', contacto: 'pedidos@labdental.com', telefono: '+54 341 455-6677' },
  { id: 4, nombre: 'Bio-Ceram', rubro: 'Materiales de obturación', contacto: 'info@bioceram.com.ar', telefono: '+54 11 5566-7788' },
  { id: 5, nombre: 'Impladent', rubro: 'Implantes y configuración', contacto: 'soporte@impladent.com', telefono: '+54 351 489-9900' },
];

const Proveedores = () => {
  const [proveedores, setProveedores] = useState(PROVEEDORES_INICIALES);
  const [busqueda, setBusqueda] = useState('');

  const filtrados = proveedores.filter((p) =>
    `${p.nombre} ${p.rubro} ${p.contacto}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleDelete = (id) => {
    setProveedores((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Paper elevation={0} className="p-5 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <LocalShippingIcon fontSize="small" className="text-gray-400" />
          <Typography variant="subtitle1" fontWeight="600">
            Proveedores
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <TextField
            size="small"
            placeholder="Buscar proveedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }, width: 240 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Nuevo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtrados.map((p) => (
          <div
            key={p.id}
            className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all bg-white"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <Typography variant="body1" fontWeight="600" className="flex-1">
                {p.nombre}
              </Typography>
              <IconButton size="small" onClick={() => handleDelete(p.id)} className="text-gray-300 hover:text-red-500">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
            <Chip label={p.rubro} size="small" variant="outlined" className="mb-3" />
            <div className="space-y-1 text-xs text-gray-500">
              <p>{p.contacto}</p>
              <p>{p.telefono}</p>
            </div>
          </div>
        ))}
      </div>

      {filtrados.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <LocalShippingIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body2">No se encontraron proveedores</Typography>
        </div>
      )}
    </Paper>
  );
};

export default Proveedores;
