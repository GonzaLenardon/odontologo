import { obrasSociales } from './catalogos';

/**
 * Cálculos de presupuesto. Compartidos entre el módulo de Presupuesto,
 * el Dashboard y el Portal del Paciente para que las cifras coincidan.
 */

/** Suma de los ítems de un presupuesto, ya aplicado el descuento. */
export function totalBruto(presupuesto) {
  const suma = (presupuesto.items || []).reduce(
    (acc, item) => acc + (Number(item.precio) || 0) * (Number(item.cantidad) || 0),
    0
  );
  return Math.max(0, suma - (Number(presupuesto.descuento) || 0));
}

/**
 * Desglose de un presupuesto.
 * Si usa obra social: la cobertura cubre un % y el paciente abona el copago.
 */
export function desglose(presupuesto, obraSocialesList = obrasSociales) {
  const total = totalBruto(presupuesto);
  const obra = obraSocialesList.find((o) => o.id === presupuesto.obraSocialId);

  if (!presupuesto.usaObraSocial || !obra) {
    return {
      total,
      cubierto: 0,
      copago: 0,
      aPagar: total,
      obraSocial: null,
    };
  }

  const cubierto = Math.round(total * (obra.cobertura / 100));
  const copago = Math.min(obra.copago, total - cubierto);
  const aPagar = Math.max(0, total - cubierto);

  return {
    total,
    cubierto,
    copago,
    aPagar,
    obraSocial: obra,
  };
}

/** Suma de los pagos asociados a un presupuesto. */
export function totalPagado(pagos, presupuestoId) {
  return (pagos || [])
    .filter((p) => String(p.presupuestoId) === String(presupuestoId))
    .reduce((acc, p) => acc + (Number(p.monto) || 0), 0);
}

/** Saldo que falta cobrar de un presupuesto. */
export function saldoPendiente(presupuesto, pagos) {
  const { aPagar } = desglose(presupuesto);
  return Math.max(0, aPagar - totalPagado(pagos, presupuesto.id));
}

/** Totales de facturación de un conjunto de presupuestos. */
export function resumenFacturacion(presupuestos, pagos) {
  let facturado = 0;
  let cobrado = 0;
  let pendiente = 0;

  presupuestos.forEach((p) => {
    const { aPagar } = desglose(p);
    const pagado = totalPagado(pagos, p.id);
    facturado += aPagar;
    cobrado += pagado;
    pendiente += Math.max(0, aPagar - pagado);
  });

  return { facturado, cobrado, pendiente };
}

/** Formatea un monto a moneda local sin decimales. */
export function formatMoneda(monto) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(monto || 0);
}
