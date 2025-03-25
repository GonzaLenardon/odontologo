import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/sesion/login';
import { useUserContext } from '../context/UserContext';
import CSnackbar from '../components/elements/CSnackbar';
import ReCAPTCHA from 'react-google-recaptcha';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Home from './Home';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState(''); // Estado para el token de CAPTCHA
  const [error, setError] = useState(''); // Estado para errores relacionados con el CAPTCHA
  const siteKey = '6Lei_6MqAAAAAEYx4HduPOICA4QWOuLCeLWSLLcC'; //producción nueva clave
  const system_id = parseInt(process.env.REACT_APP_ID_SISTEMA);

  const { updateUser } = useUserContext();

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // Guarda el token generado por reCAPTCHA
    setError(''); // Limpia errores previos si se ha completado correctamente
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async () => {
    navigate('/home');
    localStorage.setItem('paciente', username);
  };

  return (
    <>
      <div className="alturafull flex login ">
        <div className="ccontainer login-form">
          <h2 className="mb-[8px] m-auto font-bold  text-2xl ">
            Iniciar Sesión
          </h2>
          <form className="flex flex-col m-auto  gap-2" onSubmit={handleSubmit}>
            <TextField
              className="white"
              type="text"
              required
              label="Usuario"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
            <TextField
              className="white"
              required
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      title={
                        showPassword
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <div
              style={{
                margin: '20px 0',
                width: '300px',
              }}
            >
              {window.location.pathname === '/login' && (
                <ReCAPTCHA sitekey={siteKey} onChange={handleCaptchaChange} />
              )}

              {error && (
                <p style={{ color: 'red', fontSize: '16px' }}>{error}</p>
              )}
            </div>

            <Button
              variant="contained"
              type="submit"
              sx={{ height: '50px', backgroundColor: ' rgb(71 85 105)' }}
            >
              {' '}
              Ingresar{' '}
            </Button>
          </form>
        </div>
        <CSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
      </div>
    </>
  );
}
