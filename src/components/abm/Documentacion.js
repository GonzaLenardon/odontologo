import React from 'react';
import odontograma from '../../assets/odontograma.png';

const Documentacion = () => {
  return (
    <div className="flex  justify-center items-center h-[95%]">
      <img
        alt="imagen"
        src={odontograma}
        className="w-full max-h-[90%] object-contain"
      />
    </div>
  );
};

export default Documentacion;
