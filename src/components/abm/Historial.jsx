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
import HistoryIcon from '@mui/icons-material/History';

const Historial = ({ historial = [] }) => {
  const [busqueda, setBusqueda] = useState('');

  const registrosFiltrados = historial.filter((registro) =>
    Object.values(registro)
      .filter((v) => typeof v === 'string')
      .some((valor) => valor.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <Paper elevation={0} className="p-5 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <HistoryIcon fontSize="small" className="text-gray-400" />
          <Typography variant="subtitle1" fontWeight="600">
            Historial Odontológico
          </Typography>
          <Chip label={registrosFiltrados.length} size="small" variant="outlined" />
        </div>
        <TextField
          size="small"
          placeholder="Buscar en historial..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }, width: 260 }}
        />
      </div>

      <TableContainer className="rounded-xl border border-gray-200" sx={{ maxHeight: '60vh' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>Código</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>Diente</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>Cara</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>Observación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((registro, index) => (
                <TableRow key={registro.id ?? index} hover>
                  <TableCell sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {registro.fecha} {registro.hora && `· ${registro.hora}`}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    {registro.codigo}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{registro.diente}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem' }}>{registro.cara}</TableCell>
                  <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                    {registro.observacion}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  {busqueda ? 'Sin resultados para la búsqueda' : 'No hay registros en el historial'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Historial;
