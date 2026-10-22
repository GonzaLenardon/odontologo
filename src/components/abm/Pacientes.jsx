import { useState } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import { useDemo } from '../../context/DemoContext';
import { obrasSociales, odontologos } from '../../data/catalogos';

const CAMPOS = [
  { name: 'nombres', label: 'Nombre completo' },
  { name: 'dni', label: 'DNI' },
  { name: 'domicilio', label: 'Domicilio' },
  { name: 'localidad', label: 'Localidad' },
  { name: 'nroAfiliado', label: 'Nro. de afiliado' },
  { name: 'telefono', label: 'Teléfono' },
  { name: 'email', label: 'Email' },
];

const EDITABLES = CAMPOS.map((c) => c.name).concat(['observaciones']);

const Pacientes = ({ paciente, onSave }) => {
  const { update } = useDemo();
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState(paciente);

  if (!paciente) return null;

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    update('pacientes', paciente.id, formData);
    onSave?.(formData);
    setEditando(false);
  };

  const handleCancel = () => {
    setFormData(paciente);
    setEditando(false);
  };

  const obra = obrasSociales.find((o) => o.id === paciente.obraSocialId);
  const odontologo = odontologos.find((o) => o.id === paciente.odontologoId);

  return (
    <Paper elevation={0} className="p-5 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MedicalInformationIcon fontSize="small" className="text-dental" />
          <Typography variant="subtitle1" fontWeight="600">
            Datos del paciente
          </Typography>
        </div>
        {!editando ? (
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => {
              setFormData(paciente);
              setEditando(true);
            }}
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="small" onClick={handleCancel} sx={{ borderRadius: '8px', textTransform: 'none' }}>
              Cancelar
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              Guardar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {CAMPOS.map((campo) =>
          editando ? (
            <div key={campo.name} className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 mb-1">{campo.label}</label>
              <TextField
                size="small"
                value={formData[campo.name] ?? ''}
                onChange={(e) => updateFormData(campo.name, e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.875rem' } }}
              />
            </div>
          ) : (
            <div key={campo.name} className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 mb-1">{campo.label}</span>
              <Typography
                variant="body2"
                className="bg-gray-50 rounded-lg px-3 py-2 font-medium text-gray-800"
              >
                {paciente[campo.name] || '—'}
              </Typography>
            </div>
          )
        )}
      </div>

      {/* Cobertura y asignación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 mb-1">Obra social</span>
          {obra ? (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <Typography variant="body2" className="font-medium text-gray-800">
                {obra.nombre} — {obra.plan}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cobertura {obra.cobertura}% · Copago {formatCosto(obra.copago)}
              </Typography>
            </div>
          ) : (
            <Typography variant="body2" className="bg-gray-50 rounded-lg px-3 py-2 text-gray-500">
              Particular
            </Typography>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 mb-1">Odontólogo asignado</span>
          {odontologo ? (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <Typography variant="body2" className="font-medium text-gray-800">
                {odontologo.nombre}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {odontologo.especialidad} · {odontologo.horarios.inicio} a {odontologo.horarios.fin}
              </Typography>
            </div>
          ) : (
            <Typography variant="body2" className="bg-gray-50 rounded-lg px-3 py-2 text-gray-500">
              Sin asignar
            </Typography>
          )}
        </div>
      </div>

      {/* Observaciones */}
      <div className="mt-4">
        <span className="text-xs font-semibold text-gray-500 mb-1 block">Observaciones clínicas</span>
        {editando ? (
          <TextField
            fullWidth
            multiline
            rows={2}
            size="small"
            value={formData.observaciones ?? ''}
            onChange={(e) => updateFormData('observaciones', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
        ) : (
          <Box className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <Typography variant="body2" className="text-amber-900">
              {paciente.observaciones || 'Sin observaciones'}
            </Typography>
          </Box>
        )}
      </div>
    </Paper>
  );
}

function formatCosto(n) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export default Pacientes;
