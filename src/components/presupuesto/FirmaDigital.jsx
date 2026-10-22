import { useRef, useState, useEffect, useCallback } from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import DrawIcon from '@mui/icons-material/Draw';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * Firma digital del paciente.
 *
 * Implementada con <canvas> + Pointer Events (sin dependencias externas:
 * react-signature-canvas@1.1.0-alpha.1 cuelga el build de Vite 8).
 * Exporta el trazo como dataURL PNG para guardarlo en el presupuesto.
 */
export default function FirmaDigital({ onChange, onCancel, titulo = 'Firma del paciente' }) {
  const canvasRef = useRef(null);
  const dibujando = useRef(false);
  const [tieneFirma, setTieneFirma] = useState(false);

  // Escalado por devicePixelRatio para que la firma no salga borrosa.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#1e293b';
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const posicion = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    dibujando.current = true;
    canvasRef.current.setPointerCapture(e.pointerId);
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = posicion(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e) => {
    if (!dibujando.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = posicion(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = useCallback(
    (e) => {
      if (!dibujando.current) return;
      dibujando.current = false;
      if (canvasRef.current.hasPointerCapture?.(e.pointerId)) {
        canvasRef.current.releasePointerCapture(e.pointerId);
      }
      setTieneFirma(true);
      onChange?.(canvasRef.current.toDataURL('image/png'));
    },
    [onChange]
  );

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTieneFirma(false);
    onChange?.(null);
  };

  const handleCancel = () => {
    handleClear();
    onCancel?.();
  };

  return (
    <Paper elevation={0} className="p-5 rounded-xl border border-gray-200">
      <Typography variant="subtitle1" fontWeight="600" className="mb-1">
        {titulo}
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-3">
        El paciente firma en el mostrador la aceptación del presupuesto.
      </Typography>

      <Box
        sx={{
          border: '2px dashed #cbd5e1',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#fff',
          position: 'relative',
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{
            width: '100%',
            height: 180,
            display: 'block',
            touchAction: 'none',
            cursor: 'crosshair',
          }}
        />
        {!tieneFirma && (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              fontSize: '0.85rem',
              pointerEvents: 'none',
            }}
          >
            <DrawIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
            Firmá dentro del recuadro
          </span>
        )}
      </Box>

      <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
        <Typography variant="caption" color={tieneFirma ? 'success.main' : 'text.secondary'}>
          {tieneFirma ? 'Firma capturada correctamente' : 'Firmá dentro del recuadro'}
        </Typography>
        <div className="flex gap-2">
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            disabled={!tieneFirma}
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Limpiar
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={handleCancel}
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Paper>
  );
}
