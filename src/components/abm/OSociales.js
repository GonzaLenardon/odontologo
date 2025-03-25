import React from 'react';

const OSociales = () => {
  const osociales = [
    {
      nombre: 'IOSPER',
      tel: '343-4555555',
      contacto: 'Juan Bello',
      correo: 'iosper@hotmail.com',
    },
    {
      nombre: 'OSDE',
      tel: '011-1234567',
      contacto: 'María López',
      correo: 'osde@gmail.com',
    },
    {
      nombre: 'Swiss Medical',
      tel: '011-7654321',
      contacto: 'Carlos Pérez',
      correo: 'swiss@med.com',
    },
    {
      nombre: 'Galeno',
      tel: '0343-4567890',
      contacto: 'Ana Rodríguez',
      correo: 'galeno@salud.com',
    },
    {
      nombre: 'Medife',
      tel: '0342-1234567',
      contacto: 'Pedro Gómez',
      correo: 'medife@correo.com',
    },
    {
      nombre: 'OMINT',
      tel: '011-9876543',
      contacto: 'Laura Fernández',
      correo: 'omint@servicios.com',
    },
    {
      nombre: 'Sancor Salud',
      tel: '0343-6543210',
      contacto: 'Federico Sánchez',
      correo: 'sancor@salud.com',
    },
    {
      nombre: 'ASE Nacional',
      tel: '011-3214567',
      contacto: 'Marta Silva',
      correo: 'asenacional@arg.com',
    },
    {
      nombre: 'Accord Salud',
      tel: '0342-9871234',
      contacto: 'Ricardo Torres',
      correo: 'accord@med.com',
    },
    {
      nombre: 'PAMI',
      tel: '011-5556677',
      contacto: 'Graciela Gómez',
      correo: 'pami@estado.com',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-5">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Lista de Obras Sociales
      </h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Teléfono</th>
            <th className="border border-gray-300 p-2">Contacto</th>
            <th className="border border-gray-300 p-2">Correo</th>
          </tr>
        </thead>
        <tbody>
          {osociales.map((os, index) => (
            <tr
              key={index}
              className="text-center odd:bg-gray-100 even:bg-white"
            >
              <td className="border border-gray-300 p-2">{os.nombre}</td>
              <td className="border border-gray-300 p-2">{os.tel}</td>
              <td className="border border-gray-300 p-2">{os.contacto}</td>
              <td className="border border-gray-300 p-2">{os.correo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OSociales;
