import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const O_SOCIALES = [
  { nombre: 'IOSPER', tel: '343-4555555', contacto: 'Juan Bello', correo: 'iosper@hotmail.com' },
  { nombre: 'OSDE', tel: '011-1234567', contacto: 'María López', correo: 'osde@gmail.com' },
  { nombre: 'Swiss Medical', tel: '011-7654321', contacto: 'Carlos Pérez', correo: 'swiss@med.com' },
  { nombre: 'Galeno', tel: '0343-4567890', contacto: 'Ana Rodríguez', correo: 'galeno@salud.com' },
  { nombre: 'Medife', tel: '0342-1234567', contacto: 'Pedro Gómez', correo: 'medife@correo.com' },
  { nombre: 'OMINT', tel: '011-9876543', contacto: 'Laura Fernández', correo: 'omint@servicios.com' },
  { nombre: 'Sancor Salud', tel: '0343-6543210', contacto: 'Federico Sánchez', correo: 'sancor@salud.com' },
  { nombre: 'ASE Nacional', tel: '011-3214567', contacto: 'Marta Silva', correo: 'asenacional@arg.com' },
  { nombre: 'Accord Salud', tel: '0342-9871234', contacto: 'Ricardo Torres', correo: 'accord@med.com' },
  { nombre: 'PAMI', tel: '011-5556677', contacto: 'Graciela Gómez', correo: 'pami@estado.com' },
];

const OSociales = () => {
  const [busqueda, setBusqueda] = useState('');

  const filtradas = O_SOCIALES.filter((os) =>
    `${os.nombre} ${os.contacto} ${os.correo}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Paper elevation={0} className="p-5 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <HealthAndSafetyIcon fontSize="small" className="text-gray-400" />
          <Typography variant="subtitle1" fontWeight="600">
            Obras Sociales y Prepagas
          </Typography>
          <Chip label={filtradas.length} size="small" variant="outlined" />
        </div>
        <TextField
          size="small"
          placeholder="Buscar obra social..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }, width: 260 }}
        />
      </div>

      <TableContainer className="rounded-xl border border-gray-200">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>Contacto</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>Correo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtradas.map((os) => (
              <TableRow key={os.nombre} hover>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{os.nombre}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem' }}>{os.tel}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem' }}>{os.contacto}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{os.correo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OSociales;
