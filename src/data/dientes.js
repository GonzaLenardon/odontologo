import diente1 from '../assets/diente1.png';
import diente2 from '../assets/diente2.png';
import diente3 from '../assets/diente3.png';
import diente4 from '../assets/diente4.png';
import diente5 from '../assets/diente5.png';
import diente6 from '../assets/diente6.png';
import diente7 from '../assets/diente7.png';
import diente8 from '../assets/diente8.png';
import diente9 from '../assets/diente9.png';
import diente10 from '../assets/diente10.png';
import diente11 from '../assets/diente11.png';
import diente12 from '../assets/diente12.png';
import diente13 from '../assets/diente13.png';
import diente14 from '../assets/diente14.png';
import diente15 from '../assets/diente15.png';
import diente16 from '../assets/diente16.png';
import diente17 from '../assets/diente17.png';
import diente18 from '../assets/diente18.png';
import diente19 from '../assets/diente19.png';
import diente20 from '../assets/diente20.png';
import diente21 from '../assets/diente21.png';
import diente22 from '../assets/diente22.png';
import diente23 from '../assets/diente23.png';
import diente24 from '../assets/diente24.png';
import diente25 from '../assets/diente25.png';
import diente26 from '../assets/diente26.png';
import diente27 from '../assets/diente27.png';
import diente28 from '../assets/diente28.png';
import diente29 from '../assets/diente29.png';
import diente30 from '../assets/diente30.png';
import diente31 from '../assets/diente31.png';
import diente32 from '../assets/diente32.png';

export { };

/** Arcada superior (FDI 18..28 de derecha a izquierda). */
export const dientesSuperiores = [
  { id: 18, img: diente1 },
  { id: 17, img: diente2 },
  { id: 16, img: diente3 },
  { id: 15, img: diente4 },
  { id: 14, img: diente5 },
  { id: 13, img: diente6 },
  { id: 12, img: diente7 },
  { id: 11, img: diente8 },
  { id: 21, img: diente9 },
  { id: 22, img: diente10 },
  { id: 23, img: diente11 },
  { id: 24, img: diente12 },
  { id: 25, img: diente13 },
  { id: 26, img: diente14 },
  { id: 27, img: diente15 },
  { id: 28, img: diente16 },
];

/** Arcada inferior (FDI 48..38 de derecha a izquierda). */
export const dientesInferiores = [
  { id: 48, img: diente17 },
  { id: 47, img: diente18 },
  { id: 46, img: diente19 },
  { id: 45, img: diente20 },
  { id: 44, img: diente21 },
  { id: 43, img: diente22 },
  { id: 42, img: diente23 },
  { id: 41, img: diente24 },
  { id: 31, img: diente25 },
  { id: 32, img: diente26 },
  { id: 33, img: diente27 },
  { id: 34, img: diente28 },
  { id: 35, img: diente29 },
  { id: 36, img: diente30 },
  { id: 37, img: diente31 },
  { id: 38, img: diente32 },
];

/** Nombre descriptivo de cada pieza dental. */
export const tipoDiente = (id) => {
  if (id == null) return '';
  const ultimos = String(id).slice(-1);
  if (['6', '7'].includes(ultimos)) return 'Molar';
  if (['4', '5'].includes(ultimos)) return 'Premolar';
  if (['1', '2'].includes(ultimos)) return 'Incisivo';
  return 'Canino';
};
