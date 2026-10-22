import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { seedData } from '../data/seed';

const STORAGE_KEY = 'odontologo_demo_store';

const DemoContext = createContext(null);

function cargarEstado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Las fotos de paciente no son serializables: se restauran del seed
      // (la foto de un paciente es dato de referencia, no algo editable).
      const seedFotos = {};
      seedData.pacientes.forEach((p) => {
        seedFotos[p.id] = p.foto;
      });
      return {
        ...parsed,
        pacientes: (parsed.pacientes || []).map((p) => ({
          ...p,
          foto: seedFotos[p.id] || null,
        })),
      };
    }
  } catch {
    // estado corrupto -> regenerar desde el seed
  }
  return JSON.parse(JSON.stringify(seedData, (k, v) => (k === 'foto' ? undefined : v)));
}

function persistir(estado) {
  try {
    // Las fotos (data URLs / imports) no son serializables de forma confiable.
    const { pacientes, ...resto } = estado;
    const pacientesLivianos = pacientes.map(({ foto, ...p }) => ({
      ...p,
      foto: foto ? 1 : 0,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...resto, pacientes: pacientesLivianos }));
  } catch {
    // sin persistencia -> seguir solo en memoria
  }
}

export function DemoProvider({ children }) {
  const [estado, setEstado] = useState(cargarEstado);

  const guardar = useCallback((updater) => {
    setEstado((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      persistir(next);
      return next;
    });
  }, []);

  // --- Colecciones ---
  const getAll = useCallback((coleccion) => estado[coleccion] || [], [estado]);

  const getById = useCallback(
    (coleccion, id) => (estado[coleccion] || []).find((i) => String(i.id) === String(id)),
    [estado]
  );

  const create = useCallback(
    (coleccion, data) => {
      const items = estado[coleccion] || [];
      const maxId = items.reduce((acc, i) => Math.max(acc, Number(i.id) || 0), 0);
      const nuevo = { ...data, id: maxId + 1 };
      guardar((prev) => ({
        ...prev,
        [coleccion]: [...(prev[coleccion] || []), nuevo],
      }));
      return nuevo;
    },
    [estado, guardar]
  );

  const update = useCallback(
    (coleccion, id, data) => {
      guardar((prev) => ({
        ...prev,
        [coleccion]: (prev[coleccion] || []).map((i) =>
          String(i.id) === String(id) ? { ...i, ...data } : i
        ),
      }));
    },
    [guardar]
  );

  const remove = useCallback(
    (coleccion, id) => {
      guardar((prev) => ({
        ...prev,
        [coleccion]: (prev[coleccion] || []).filter((i) => String(i.id) !== String(id)),
      }));
    },
    [guardar]
  );

  /** Registra un evento en la bitácora de actividad (visible en el Dashboard). */
  const registrarActividad = useCallback(
    (tipo, texto, refId = null) => {
      guardar((prev) => ({
        ...prev,
        actividad: [
          { id: Date.now(), tipo, texto, refId, fecha: new Date().toISOString() },
          ...(prev.actividad || []),
        ].slice(0, 50),
      }));
    },
    [guardar]
  );

  const reset = useCallback(() => {
    const limpio = JSON.parse(JSON.stringify(seedData, (k, v) => (k === 'foto' ? undefined : v)));
    seedData.pacientes.forEach((p) => {
      limpio.pacientes.find((c) => c.id === p.id).foto = p.foto;
    });
    guardar(limpio);
  }, [guardar]);

  const value = useMemo(
    () => ({
      estado,
      getAll,
      getById,
      create,
      update,
      remove,
      registrarActividad,
      reset,
    }),
    [estado, getAll, getById, create, update, remove, registrarActividad, reset]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo debe usarse dentro de <DemoProvider>');
  return ctx;
}
