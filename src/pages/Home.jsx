import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  MedicalServices as MedicalIcon,
  Receipt as ReceiptIcon,
  LocalHospital as HospitalIcon,
  Business as BusinessIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Notifications as NotificationsIcon,
  PersonSearch as PersonSearchIcon,
  Web as WebIcon,
  Payments as PaymentsIcon,
} from '@mui/icons-material';
import HomeNew from './HomeNew';
import OSociales from '../components/abm/OSociales';
import Odontologos from '../components/abm/Odontologos';
import Proveedores from '../components/abm/Proveedores';
import Cuatro from '../components/abm/Cuadrado';
import Agenda from '../components/agenda/Agenda';
import Recordatorios from '../components/recordatorios/Recordatorios';
import PortalPaciente from '../components/portal/PortalPaciente';
import Presupuestos from '../components/presupuesto/Presupuestos';
import Dashboard from '../components/dashboard/Dashboard';
import { stripBasename } from '../constants';

const menuSections = [
  {
    label: 'Principal',
    items: [
      {
        title: 'Panel',
        path: '/dashboard',
        icon: <DashboardIcon fontSize="small" />,
      },
      {
        title: 'Pacientes',
        path: '/pacientes',
        icon: <PeopleIcon fontSize="small" />,
      },
      {
        title: 'Agenda',
        path: '/agenda',
        icon: <CalendarIcon fontSize="small" />,
      },
      {
        title: 'Odontograma',
        path: '/odontograma',
        icon: <MedicalIcon fontSize="small" />,
      },
      {
        title: 'Recordatorios',
        path: '/recordatorios',
        icon: <NotificationsIcon fontSize="small" />,
      },
    ],
  },
  {
    label: 'Clínico',
    items: [
      {
        title: 'Obras Sociales',
        path: '/obras-sociales',
        icon: <ReceiptIcon fontSize="small" />,
      },
      {
        title: 'Odontólogos',
        path: '/odontologos',
        icon: <HospitalIcon fontSize="small" />,
      },
      {
        title: 'Proveedores',
        path: '/proveedores',
        icon: <BusinessIcon fontSize="small" />,
      },
    ],
  },
  {
    label: 'Financiero',
    items: [
      {
        title: 'Presupuesto y Pagos',
        path: '/presupuestos',
        icon: <PaymentsIcon fontSize="small" />,
      },
    ],
  },
  {
    label: 'Portal Paciente',
    items: [
      {
        title: 'Reservar Turno',
        path: '/portal',
        icon: <WebIcon fontSize="small" />,
      },
    ],
  },
];

const componentMap = {
  '/dashboard': <Dashboard />,
  '/pacientes': <HomeNew />,
  '/agenda': <Agenda />,
  '/odontograma': <Cuatro />,
  '/recordatorios': <Recordatorios />,
  '/obras-sociales': <OSociales />,
  '/odontologos': <Odontologos />,
  '/proveedores': <Proveedores />,
  '/presupuestos': <Presupuestos />,
  '/portal': <PortalPaciente />,
};

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const paciente = localStorage.getItem('paciente') || 'Usuario';

  // La ruta determina el módulo visible (URLs compartibles / deep-link)
  // OJO: location.pathname incluye el basename -> hay que normalizarlo.
  const path = stripBasename(location.pathname);
  const currentPath = componentMap[path] ? path : '/dashboard';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dental to-dental-dark flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="font-semibold text-gray-800 text-sm">
                Odontológico{' '}
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {collapsed ? (
              <ChevronRightIcon fontSize="small" />
            ) : (
              <ChevronLeftIcon fontSize="small" />
            )}
          </button>
        </div>

        {/* User greeting */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-dental/10 flex items-center justify-center">
                <PersonSearchIcon fontSize="small" className="text-dental" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Bienvenido </p>
                <p className="text-sm font-medium text-gray-800 truncate max-w-[160px]">
                  {paciente}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu sections */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {menuSections.map((section) => (
            <div key={section.label} className="mb-3">
              {!collapsed && (
                <p className="px-3 mb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {section.label}
                </p>
              )}
              {section.items.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-all duration-150 text-sm ${
                      isActive
                        ? 'bg-dental/10 text-dental font-medium shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                    title={collapsed ? item.title : undefined}
                  >
                    <span
                      className={isActive ? 'text-dental' : 'text-gray-400'}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.title}</span>}
                    {isActive && !collapsed && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-dental" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 text-center">
              v3.0.0 — Demo
            </p>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {currentPath === '/dashboard' ? (
            <Dashboard onNavegar={navigate} />
          ) : (
            componentMap[currentPath] || <Dashboard onNavegar={navigate} />
          )}
        </div>
      </main>
    </div>
  );
}
