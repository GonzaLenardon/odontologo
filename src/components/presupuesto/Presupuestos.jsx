import { useState, useMemo } from 'react';
import {
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Payments as PaymentsIcon,
  Draw as DrawIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  Print as PrintIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalanceWallet as WalletIcon,
  PendingActions as PendingIcon,
} from '@mui/icons-material';
import { useDemo } from '../../context/DemoContext';
import {
  odontologos,
  catalogoTratamientos,
  categoriasTratamiento,
  metodosPago,
  estadosPresupuesto,
} from '../../data/catalogos';
import {
  desglose,
  totalPagado,
  saldoPendiente,
  resumenFacturacion,
  formatMoneda,
} from '../../data/presupuestos';
import FirmaDigital from './FirmaDigital';
import CSnackbar from '../elements/CSnackbar';

const ESTADOS_FILTRABLES = [
  { id: 'todos', label: 'Todos' },
  { id: 'borrador', label: 'Borrador' },
  { id: 'enviado', label: 'Enviados' },
  { id: 'aceptado', label: 'Aceptados' },
  { id: 'pagado', label: 'Pagados' },
  { id: 'rechazado', label: 'Rechazados' },
];

const formatFechaLarga = (iso) => {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
};

export default function Presupuestos() {
  const { getAll, create, update, remove, registrarActividad } = useDemo();

  const presupuestos = getAll('presupuestos');
  const pagos = getAll('pagos');
  const pacientes = getAll('pacientes');

  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);
  const [dialogNuevo, setDialogNuevo] = useState(false);
  const [dialogPago, setDialogPago] = useState(false);
  const [dialogFirma, setDialogFirma] = useState(false);
  const [firmaTmp, setFirmaTmp] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const [formNuevo, setFormNuevo] = useState({
    pacienteId: '',
    odontologoId: '',
    items: [],
    descuento: 0,
    usaObraSocial: true,
    observaciones: '',
  });
  const [formPago, setFormPago] = useState({ monto: '', metodo: 'efectivo', recibe: 'Recepción' });
  const [nuevoItem, setNuevoItem] = useState({ concepto: '', precio: '', cantidad: 1 });

  const notificar = (severity, message) => setSnackbar({ open: true, severity, message });

  const resumen = useMemo(
    () => resumenFacturacion(presupuestos, pagos),
    [presupuestos, pagos]
  );

  const visibles = presupuestos.filter((p) => {
    if (filtroEstado !== 'todos' && p.estado !== filtroEstado) return false;
    if (!busqueda.trim()) return true;
    const paciente = pacientes.find((x) => x.id === p.pacienteId);
    const texto = `${paciente?.nombres || ''} ${p.id}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const getPaciente = (id) => pacientes.find((p) => p.id === id);
  const getOdontologo = (id) => odontologos.find((o) => o.id === id);

  // ---------- Crear presupuesto ----------
  const agregarItem = () => {
    if (!nuevoItem.concepto || !nuevoItem.precio) return;
    setFormNuevo((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          concepto: nuevoItem.concepto,
          precio: Number(nuevoItem.precio),
          cantidad: Number(nuevoItem.cantidad) || 1,
        },
      ],
    }));
    setNuevoItem({ concepto: '', precio: '', cantidad: 1 });
  };

  const totalNuevo = useMemo(() => {
    const suma = formNuevo.items.reduce(
      (acc, i) => acc + i.precio * (Number(i.cantidad) || 0),
      0
    );
    return Math.max(0, suma - (Number(formNuevo.descuento) || 0));
  }, [formNuevo.items, formNuevo.descuento]);

  const guardarNuevo = () => {
    const paciente = getPaciente(parseInt(formNuevo.pacienteId));
    const nuevo = create('presupuestos', {
      pacienteId: parseInt(formNuevo.pacienteId),
      odontologoId: parseInt(formNuevo.odontologoId),
      obraSocialId: paciente ? paciente.obraSocialId : null,
      fecha: new Date().toISOString().split('T')[0],
      vencimiento: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      estado: 'borrador',
      items: formNuevo.items,
      descuento: Number(formNuevo.descuento) || 0,
      usaObraSocial: formNuevo.usaObraSocial,
      firma: null,
      observaciones: formNuevo.observaciones,
    });
    registrarActividad('presupuesto', `Presupuesto creado para ${paciente?.nombres}`);
    notificar('success', 'Presupuesto creado');
    setDialogNuevo(false);
    setFormNuevo({
      pacienteId: '',
      odontologoId: '',
      items: [],
      descuento: 0,
      usaObraSocial: true,
      observaciones: '',
    });
    setSeleccionado(nuevo.id);
  };

  // ---------- Acciones de estado ----------
  const enviarPresupuesto = (p) => {
    update('presupuestos', p.id, { estado: 'enviado' });
    registrarActividad('presupuesto', `Presupuesto #${p.id} enviado al paciente`);
    notificar('success', 'Presupuesto enviado al paciente por WhatsApp y email');
  };

  const aceptarPresupuesto = (p, firma) => {
    update('presupuestos', p.id, { estado: 'aceptado', firma });
    registrarActividad('presupuesto', `Presupuesto #${p.id} aceptado y firmado`);
    notificar('success', 'Presupuesto aceptado por el paciente');
    setDialogFirma(false);
  };

  const rechazarPresupuesto = (p) => {
    update('presupuestos', p.id, { estado: 'rechazado' });
    registrarActividad('presupuesto', `Presupuesto #${p.id} rechazado`);
    notificar('info', 'Presupuesto marcado como rechazado');
  };

  // ---------- Pagos ----------
  const abrirPago = (p) => {
    const saldo = saldoPendiente(p, pagos);
    setFormPago({ monto: String(saldo), metodo: 'efectivo', recibe: 'Recepción' });
    setDialogPago(true);
  };

  const registrarPago = () => {
    const monto = Number(formPago.monto);
    if (!monto || monto <= 0) return;

    create('pagos', {
      presupuestoId: seleccionado.id,
      monto,
      metodo: formPago.metodo,
      fecha: new Date().toISOString().split('T')[0],
      recibe: formPago.recibe,
    });

    const pagado = totalPagado(pagos, seleccionado.id) + monto;
    const { aPagar } = desglose(seleccionado);
    if (pagado >= aPagar) {
      update('presupuestos', seleccionado.id, { estado: 'pagado' });
    }

    registrarActividad('pago', `Pago de ${formatMoneda(monto)} registrado — presupuesto #${seleccionado.id}`);
    notificar('success', `Pago de ${formatMoneda(monto)} registrado`);
    setDialogPago(false);
  };

  const borrarPresupuesto = (p) => {
    remove('presupuestos', p.id);
    setSeleccionado(null);
    registrarActividad('presupuesto', `Presupuesto #${p.id} eliminado`);
    notificar('success', 'Presupuesto eliminado');
  };

  const presupuestoSeleccionado = presupuestos.find((p) => p.id === seleccionado);
  const pagosDelPresupuesto = pagos.filter((p) => String(p.presupuestoId) === String(seleccionado));

  // ---------------- Render ----------------
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Typography variant="h5" fontWeight="700" className="text-primary-900">
            Presupuesto y Pagos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Planes de tratamiento, cobertura de obra social y cobros
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogNuevo(true)}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #4a90d9, #2c5f8a)',
          }}
        >
          Nuevo presupuesto
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Facturado',
            value: formatMoneda(resumen.facturado),
            icon: <TrendingUpIcon />,
            bg: 'bg-blue-50',
            color: 'text-blue-600',
          },
          {
            label: 'Cobrado',
            value: formatMoneda(resumen.cobrado),
            icon: <WalletIcon />,
            bg: 'bg-emerald-50',
            color: 'text-emerald-600',
          },
          {
            label: 'Pendiente de cobro',
            value: formatMoneda(resumen.pendiente),
            icon: <PendingIcon />,
            bg: 'bg-amber-50',
            color: 'text-amber-600',
          },
        ].map((kpi) => (
          <Paper key={kpi.label} elevation={0} className="p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <span className={kpi.color}>{kpi.icon}</span>
              </div>
              <div>
                <Typography variant="h6" fontWeight="700" className="leading-tight">
                  {kpi.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {kpi.label}
                </Typography>
              </div>
            </div>
          </Paper>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Listado */}
        <Paper elevation={0} className="p-4 rounded-xl border border-gray-200 lg:w-[42%] shrink-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <TextField
              size="small"
              placeholder="Buscar presupuesto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }, flex: 1, minWidth: 180 }}
            />
          </div>

          <div className="flex gap-1 flex-wrap mb-3">
            {ESTADOS_FILTRABLES.map((e) => (
              <button
                key={e.id}
                onClick={() => setFiltroEstado(e.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filtroEstado === e.id
                    ? 'bg-dental text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto">
            {visibles.length > 0 ? (
              visibles.map((p) => {
                const paciente = getPaciente(p.pacienteId);
                const est = estadosPresupuesto[p.estado];
                const saldo = saldoPendiente(p, pagos);
                return (
                  <div
                    key={p.id}
                    onClick={() => setSeleccionado(p.id)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      seleccionado === p.id
                        ? 'border-dental bg-dental/5 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {paciente?.nombres || 'Paciente'}
                        </p>
                        <p className="text-xs text-gray-500">
                          #{p.id} · {formatFechaLarga(p.fecha)}
                        </p>
                      </div>
                      <Chip
                        label={est?.label || p.estado}
                        size="small"
                        className={`${est?.bg} ${est?.text} ${est?.border} border`}
                        sx={{ fontSize: '0.65rem', height: 20 }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700">
                        {formatMoneda(desglose(p).aPagar)}
                      </span>
                      {saldo > 0 ? (
                        <span className="text-amber-600 font-medium">
                          debe {formatMoneda(saldo)}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium">Cancelado</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">
                <DescriptionIcon sx={{ fontSize: 40, mb: 1 }} />
                No hay presupuestos para mostrar
              </div>
            )}
          </div>
        </Paper>

        {/* Detalle */}
        <Paper elevation={0} className="p-5 rounded-xl border border-gray-200 flex-1">
          {!presupuestoSeleccionado ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <DescriptionIcon sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="body2">
                  Seleccioná un presupuesto para ver el detalle
                </Typography>
              </div>
            </div>
          ) : (
            <PresupuestoDetalle
              presupuesto={presupuestoSeleccionado}
              pagos={pagosDelPresupuesto}
              paciente={getPaciente(presupuestoSeleccionado.pacienteId)}
              odontologo={getOdontologo(presupuestoSeleccionado.odontologoId)}
              onEnviar={() => enviarPresupuesto(presupuestoSeleccionado)}
              onFirmar={() => setDialogFirma(true)}
              onRechazar={() => rechazarPresupuesto(presupuestoSeleccionado)}
              onPagar={() => abrirPago(presupuestoSeleccionado)}
              onEliminar={() => borrarPresupuesto(presupuestoSeleccionado)}
              onImprimir={() => window.print()}
            />
          )}
        </Paper>
      </div>

      {/* ---- Dialog: nuevo presupuesto ---- */}
      <Dialog
        open={dialogNuevo}
        onClose={() => setDialogNuevo(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Nuevo presupuesto</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <TextField
              select
              label="Paciente"
              value={formNuevo.pacienteId}
              onChange={(e) => {
                const p = getPaciente(parseInt(e.target.value));
                setFormNuevo((prev) => ({
                  ...prev,
                  pacienteId: e.target.value,
                  odontologoId: p ? String(p.odontologoId) : prev.odontologoId,
                }));
              }}
              size="small"
              required
            >
              {pacientes.map((p) => (
                <MenuItem key={p.id} value={String(p.id)}>
                  {p.nombres}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Odontólogo"
              value={formNuevo.odontologoId}
              onChange={(e) => setFormNuevo({ ...formNuevo, odontologoId: e.target.value })}
              size="small"
              required
            >
              {odontologos.map((o) => (
                <MenuItem key={o.id} value={String(o.id)}>
                  {o.nombre}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <Typography variant="subtitle2" fontWeight="600" className="mb-2">
            Items del tratamiento
          </Typography>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3">
            <TextField
              select
              label="Tratamiento"
              value={nuevoItem.concepto}
              onChange={(e) => {
                const t = catalogoTratamientos.find((c) => c.concepto === e.target.value);
                setNuevoItem({
                  ...nuevoItem,
                  concepto: e.target.value,
                  precio: t ? String(t.precio) : nuevoItem.precio,
                });
              }}
              size="small"
              sx={{ gridColumn: { sm: 'span 2' } }}
            >
              {categoriasTratamiento.map((cat) => (
                <optgroup key={cat} label={cat}>
                  {catalogoTratamientos
                    .filter((t) => t.categoria === cat)
                    .map((t) => (
                      <MenuItem key={t.id} value={t.concepto}>
                        {t.concepto}
                      </MenuItem>
                    ))}
                </optgroup>
              ))}
            </TextField>
            <TextField
              label="Precio"
              type="number"
              value={nuevoItem.precio}
              onChange={(e) => setNuevoItem({ ...nuevoItem, precio: e.target.value })}
              size="small"
            />
            <TextField
              label="Cant."
              type="number"
              value={nuevoItem.cantidad}
              onChange={(e) => setNuevoItem({ ...nuevoItem, cantidad: e.target.value })}
              size="small"
            />
          </div>

          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={agregarItem}
            disabled={!nuevoItem.concepto || !nuevoItem.precio}
            sx={{ borderRadius: '8px', textTransform: 'none', mb: 3 }}
          >
            Agregar item
          </Button>

          {formNuevo.items.length > 0 && (
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
              {formNuevo.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 text-sm border-b border-gray-100 last:border-0"
                >
                  <span className="flex-1">{item.concepto}</span>
                  <span className="text-gray-500 mr-4">
                    {item.cantidad} × {formatMoneda(item.precio)}
                  </span>
                  <span className="font-semibold w-24 text-right">
                    {formatMoneda(item.precio * item.cantidad)}
                  </span>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setFormNuevo((prev) => ({
                        ...prev,
                        items: prev.items.filter((_, idx) => idx !== i),
                      }))
                    }
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="Descuento"
              type="number"
              value={formNuevo.descuento}
              onChange={(e) => setFormNuevo({ ...formNuevo, descuento: e.target.value })}
              size="small"
            />
            <TextField
              select
              label="Cobertura"
              value={formNuevo.usaObraSocial ? 'obra' : 'particular'}
              onChange={(e) =>
                setFormNuevo({ ...formNuevo, usaObraSocial: e.target.value === 'obra' })
              }
              size="small"
            >
              <MenuItem value="obra">Aplicar obra social</MenuItem>
              <MenuItem value="particular">Paciente particular</MenuItem>
            </TextField>
          </div>

          <TextField
            label="Observaciones"
            value={formNuevo.observaciones}
            onChange={(e) => setFormNuevo({ ...formNuevo, observaciones: e.target.value })}
            size="small"
            fullWidth
            multiline
            rows={2}
            className="mt-3"
          />

          <div className="mt-4 bg-primary-900 text-white rounded-xl p-4 flex justify-between items-center">
            <span className="text-sm">Total del presupuesto</span>
            <span className="text-xl font-bold">{formatMoneda(totalNuevo)}</span>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogNuevo(false)} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={guardarNuevo}
            disabled={!formNuevo.pacienteId || !formNuevo.odontologoId || formNuevo.items.length === 0}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Crear presupuesto
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---- Dialog: registrar pago ---- */}
      <Dialog
        open={dialogPago}
        onClose={() => setDialogPago(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Registrar pago</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          {presupuestoSeleccionado && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">Saldo pendiente</p>
              <p className="text-2xl font-bold text-primary-900">
                {formatMoneda(saldoPendiente(presupuestoSeleccionado, pagos))}
              </p>
            </div>
          )}
          <TextField
            label="Monto"
            type="number"
            value={formPago.monto}
            onChange={(e) => setFormPago({ ...formPago, monto: e.target.value })}
            size="small"
            fullWidth
            autoFocus
          />
          <TextField
            select
            label="Método de pago"
            value={formPago.metodo}
            onChange={(e) => setFormPago({ ...formPago, metodo: e.target.value })}
            size="small"
            fullWidth
          >
            {metodosPago.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Recibido por"
            value={formPago.recibe}
            onChange={(e) => setFormPago({ ...formPago, recibe: e.target.value })}
            size="small"
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogPago(false)} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={registrarPago}
            disabled={!formPago.monto || Number(formPago.monto) <= 0}
            startIcon={<PaymentsIcon />}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Registrar pago
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---- Dialog: firma digital ---- */}
      <Dialog
        open={dialogFirma}
        onClose={() => setDialogFirma(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Aceptación del presupuesto</DialogTitle>
        <DialogContent>
          <FirmaDigital
            titulo={
              presupuestoSeleccionado
                ? `Presupuesto #${presupuestoSeleccionado.id} — ${getPaciente(presupuestoSeleccionado.pacienteId)?.nombres}`
                : 'Firma del paciente'
            }
            onChange={setFirmaTmp}
            onCancel={() => {
              setFirmaTmp(null);
              setDialogFirma(false);
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogFirma(false)} sx={{ borderRadius: '10px', textTransform: 'none' }}>
            Cerrar
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={() => {
              if (!firmaTmp) {
                notificar('warning', 'El paciente debe firmar antes de aceptar');
                return;
              }
              aceptarPresupuesto(presupuestoSeleccionado, firmaTmp);
              setFirmaTmp(null);
            }}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Aceptar presupuesto
          </Button>
        </DialogActions>
      </Dialog>

      <CSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </div>
  );
}

function PresupuestoDetalle({
  presupuesto,
  pagos,
  paciente,
  odontologo,
  onEnviar,
  onFirmar,
  onRechazar,
  onPagar,
  onEliminar,
  onImprimir,
}) {
  const desgl = desglose(presupuesto);
  const pagado = totalPagado(pagos, presupuesto.id);
  const saldo = Math.max(0, desgl.aPagar - pagado);
  const est = estadosPresupuesto[presupuesto.estado];

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-3 flex-wrap no-print">
        <div>
          <div className="flex items-center gap-2">
            <Typography variant="h6" fontWeight="700">
              Presupuesto #{presupuesto.id}
            </Typography>
            <Chip
              label={est?.label || presupuesto.estado}
              size="small"
              className={`${est?.bg} ${est?.text} ${est?.border} border`}
              sx={{ fontSize: '0.65rem' }}
            />
          </div>
          <Typography variant="body2" color="text.secondary">
            {paciente?.nombres} · {formatFechaLarga(presupuesto.fecha)} · Vence{' '}
            {formatFechaLarga(presupuesto.vencimiento)}
          </Typography>
          {odontologo && (
            <Typography variant="caption" color="text.secondary">
              {odontologo.nombre} — {odontologo.especialidad}
            </Typography>
          )}
        </div>
        <Tooltip title="Imprimir / exportar a PDF">
          <IconButton onClick={onImprimir} className="bg-gray-100 hover:bg-gray-200">
            <PrintIcon />
          </IconButton>
        </Tooltip>
      </div>

      <Divider />

      {/* Items */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>
                Concepto
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>
                Cant.
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>
                Precio
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'primary.900', color: 'white' }}>
                Subtotal
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {presupuesto.items.map((item, i) => (
              <TableRow key={i}>
                <TableCell sx={{ fontSize: '0.85rem' }}>{item.concepto}</TableCell>
                <TableCell align="right" sx={{ fontSize: '0.85rem' }}>
                  {item.cantidad}
                </TableCell>
                <TableCell align="right" sx={{ fontSize: '0.85rem' }}>
                  {formatMoneda(item.precio)}
                </TableCell>
                <TableCell align="right" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {formatMoneda(item.precio * item.cantidad)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Totales */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatMoneda(desgl.total)}</span>
        </div>
        {desgl.obraSocial && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Cobertura {desgl.obraSocial.nombre} ({desgl.obraSocial.cobertura}%)
              </span>
              <span className="font-medium text-emerald-700">
                − {formatMoneda(desgl.cubierto)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Copago</span>
              <span className="font-medium">{formatMoneda(desgl.copago)}</span>
            </div>
          </>
        )}
        {presupuesto.descuento > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Descuento</span>
            <span className="font-medium text-emerald-700">
              − {formatMoneda(presupuesto.descuento)}
            </span>
          </div>
        )}
        <Divider />
        <div className="flex justify-between">
          <span className="font-semibold">Total a pagar</span>
          <span className="text-xl font-bold text-primary-900">
            {formatMoneda(desgl.aPagar)}
          </span>
        </div>
        {pagado > 0 && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pagado</span>
              <span className="font-medium text-emerald-700">{formatMoneda(pagado)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Saldo</span>
              <span
                className={`text-lg font-bold ${saldo > 0 ? 'text-amber-600' : 'text-emerald-600'}`}
              >
                {formatMoneda(saldo)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Pagos registrados */}
      {pagos.length > 0 && (
        <div>
          <Typography variant="subtitle2" fontWeight="600" className="mb-1.5">
            Pagos registrados
          </Typography>
          <div className="space-y-1">
            {pagos.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-sm"
              >
                <span className="font-medium text-emerald-900">
                  {formatMoneda(p.monto)} — {p.metodo}
                </span>
                <span className="text-emerald-700 text-xs">
                  {formatFechaLarga(p.fecha)} · {p.recibe}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Firma */}
      {presupuesto.firma && (
        <div>
          <Typography variant="subtitle2" fontWeight="600" className="mb-1.5">
            Firma del paciente
          </Typography>
          <div className="bg-white border border-gray-200 rounded-xl p-2">
            <img src={presupuesto.firma} alt="Firma del paciente" className="h-20 object-contain" />
          </div>
        </div>
      )}

      {presupuesto.observaciones && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <Typography variant="body2" className="text-blue-900">
            {presupuesto.observaciones}
          </Typography>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2 flex-wrap no-print">
        {presupuesto.estado === 'borrador' && (
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={onEnviar}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Enviar al paciente
          </Button>
        )}
        {presupuesto.estado === 'enviado' && (
          <>
            <Button
              variant="contained"
              startIcon={<DrawIcon />}
              onClick={onFirmar}
              sx={{ borderRadius: '10px', textTransform: 'none' }}
            >
              Firma y aceptación
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={onRechazar}
              sx={{ borderRadius: '10px', textTransform: 'none' }}
            >
              Rechazar
            </Button>
          </>
        )}
        {(presupuesto.estado === 'aceptado' || presupuesto.estado === 'pagado') && saldo > 0 && (
          <Button
            variant="contained"
            startIcon={<PaymentsIcon />}
            onClick={onPagar}
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Registrar pago
          </Button>
        )}
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onEliminar}
          sx={{ borderRadius: '10px', textTransform: 'none', ml: 'auto' }}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
}
