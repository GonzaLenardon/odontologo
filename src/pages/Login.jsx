import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined, PersonOutline } from '@mui/icons-material';
import { useUserContext } from '../context/UserContext';
import consultorio from '../assets/consultorio.jpg';

export default function Login() {
  const navigate = useNavigate();
  const { updateUser } = useUserContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateUser({
        nombre: username || 'Demo',
        apellido: 'Usuario',
        rol: 'Administrador',
      });
      localStorage.setItem('paciente', username || 'Demo');
      navigate('/dashboard');
    }, 450);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Fondo: foto del consultorio con overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${consultorio})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-primary-800/90 to-primary-900/95 backdrop-blur-sm" />

      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-dental/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] bg-dental-accent/20 rounded-full blur-3xl" />
      </div>

      {/* Tarjeta */}
      <Paper
        elevation={24}
        sx={{
          p: 5,
          width: '100%',
          maxWidth: 420,
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-dental to-dental-dark flex items-center justify-center mx-auto mb-4 shadow-lg shadow-dental/25">
            <span className="text-white text-2xl font-bold">O</span>
          </div>
          <Typography variant="h5" fontWeight="700" className="text-primary-900">
            Sistema Odontológico
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Gestión integral de pacientes
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <TextField
            fullWidth
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              background: 'linear-gradient(135deg, #4a90d9, #2c5f8a)',
              boxShadow: '0 4px 14px rgba(74, 144, 217, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a9de6, #3a6f9a)',
                boxShadow: '0 6px 20px rgba(74, 144, 217, 0.5)',
              },
            }}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 3 }}
        >
          Demo — Sistema de gestión odontológica
        </Typography>
      </Paper>
    </div>
  );
}
