import React, { useEffect, useState } from 'react';
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { getUser } from '../../api/puestos/getUser';
import Loader from '../elements/Loader';

const Usuarios = () => {
  const [users, setUsers] = useState([]); // Lista de usuarios a mostrar en la tabla
  const [aux, setAux] = useState([]); // Lista original de usuarios sin filtrar
  const [look, setLook] = useState(''); // Estado para el input de búsqueda
  const [loader, setLoader] = useState(false);

  // Obtener usuarios al cargar el componente
  useEffect(() => {
    const getUsuario = async () => {
      setLoader(true);
      const resp = await getUser();
      setUsers(resp.formattedResult);
      setAux(resp.formattedResult); // Guardamos la lista original sin filtrar
      setLoader(false);
    };
    getUsuario();
  }, []);

  // Manejar cambios en el input
  const handleLook = (e) => {
    setLook(e.target.value);
  };

  // Filtrar usuarios cuando cambia `look`
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (look === '') {
        setUsers(aux); // Si está vacío, restauramos la lista original
      } else {
        setUsers(
          aux.filter((user) =>
            user.nombre_usuario.toLowerCase().includes(look.toLowerCase())
          )
        );
      }
    }, 300); // 🔹 Espera 300ms antes de aplicar el filtro

    return () => clearTimeout(delayDebounceFn); // 🔹 Limpia el timeout si el usuario sigue escribiendo
  }, [look, aux]);

  return (
    <div>
      <div className="sticky top-0  z-10 p-2 mb-2 shadow-md ">
        <TextField
          label="Buscar usuario"
          variant="outlined"
          fullWidth
          onChange={handleLook}
          value={look}
        />
      </div>

      <TableContainer
        /* component={Paper} */
        sx={{ maxHeight: '65vh', overflowY: 'auto' }}
      >
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: '#252525' }}>
            <TableRow>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  backgroundColor: '#1976D2',
                  width: '40%',
                }}
              >
                Nombre usuario
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  backgroundColor: '#1976D2',
                  width: '20%',
                }}
              >
                Legajo
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  backgroundColor: '#1976D2',
                  width: '40%',
                }}
              >
                Usuario
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((rows, index) => (
              <TableRow key={`${rows.nombre_usuario}-${index}`}>
                <TableCell>{rows.nombre_usuario}</TableCell>
                <TableCell>{rows.legajo}</TableCell>
                <TableCell>{rows.usuario}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Loader open={loader} text={'Actualizando datos'} />
      </TableContainer>
    </div>
  );
};

export default Usuarios;
