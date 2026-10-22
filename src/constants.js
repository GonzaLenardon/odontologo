/**
 * Rutas base de la app.
 * Debe coincidir con `base` de vite.config.js y con el `basename`
 * del BrowserRouter, para que los deep-links funcionen en GitHub Pages.
 */
export const BASENAME = '/odontologo';

/**
 * Quita el basename del pathname de la location.
 * react-router v6 devuelve `location.pathname` con el basename incluido,
 * por lo que hay que normalizarlo para comparar contra las rutas del menú.
 */
export function stripBasename(pathname, basename = BASENAME) {
  let p = pathname || '/';

  if (basename) {
    if (p === basename) p = '/';
    else if (p.startsWith(`${basename}/`)) p = p.slice(basename.length);
  }

  // Normalizar trailing slash: '/agenda/' -> '/agenda'
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);

  return p || '/';
}
