import React from 'react';

import pano from '../../assets/panoramica.jpeg';
import pano1 from '../../assets/panoramica1.jpeg';
import pano2 from '../../assets/panoramica2.jpeg';
import pano3 from '../../assets/panoramica4.jpeg';
import pano4 from '../../assets/panoramica5.jpg';

const Estudios = () => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      <div className=" p-4 flex justify-center">
        <img alt="pano1" src={pano} className="w-auto h-[200px] rounded-lg" />
      </div>
      <div className=" p-4 flex justify-center">
        <img alt="pano2" src={pano1} className="w-auto h-[200px] rounded-lg" />
      </div>
      <div className="p-4 flex justify-center">
        <img alt="pano3" src={pano2} className="w-auto h-[200px] rounded-lg" />
      </div>
      <div className="p-4 flex justify-center">
        <img alt="pano4" src={pano3} className="w-auto h-[200px rounded-lg" />
      </div>
      <div className="p-4 flex justify-center">
        <img alt="pano5" src={pano4} className="w-auto h-[200px] rounded-lg" />
      </div>
    </div>
  );
};

export default Estudios;
