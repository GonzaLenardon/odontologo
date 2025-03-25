import React from 'react';

const Pacientes = ({ paciente }) => {
  console.log('papapapap ', paciente);

  const mayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

  return (
    <div className="max-w-4xl mt-5 mx-auto bg-[#8194CC] shadow-lg rounded-lg p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1 text-center"></h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.keys(paciente).map((key, index) =>
          !['face', 'odontologo', 'turno'].includes(key) ? (
            <div key={index} className="flex flex-col">
              <span
                htmlFor={`input-${index}`}
                className="text-gray-700 font-semibold text-lg mb-1 text-left"
              >
                {mayuscula(key)}:
              </span>
              <input
                id={`input-${index}`}
                type="text"
                value={paciente[key]}
                placeholder={`Ingrese ${key}`}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                readOnly
              />
            </div>
          ) : null
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition">
          Guardar
        </button>
      </div>
    </div>
  );
};

export default Pacientes;
