import React from 'react';
import { trainers } from '../../assets/data/trainers';
import TrainerCard from './TrainerCard';

const TrainerList = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] 
      mt-[30px] lg:mt-[55px]'>
      {trainers.map((trainer) => (
        <TrainerCard key={trainer.id} trainer={trainer} />
      ))}
    </div>
  );
};

export default TrainerList;

