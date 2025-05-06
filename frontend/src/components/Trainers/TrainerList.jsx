import TrainerCard from "./TrainerCard";

import { BASE_URL } from "./../../config";
import useFetchData from "./../../hooks/useFetchData";
import Loader from "./../../components/Loader/Loader";
import Error from "./../../components/Error/Error";

const TrainerList = () => {
  const { data: trainers, loading, error } = useFetchData(`${BASE_URL}trainers`);

  return (
    <>
      {loading && <Loader />}
      {error && <Error />}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
          {trainers.map(trainer => (
            <TrainerCard key={trainer._id} trainer={trainer} />
          ))}
        </div>
      )}
    </>
  );
};

export default TrainerList;

// import React from 'react';
// import { trainers } from '../../assets/data/trainers';
// import TrainerCard from './TrainerCard';
// import { BASE_URL } from './../../config';

// const TrainerList = () => {
//   return (
//     <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] 
//       mt-[30px] lg:mt-[55px]'>
//       {trainers.map((trainer) => (
//         <TrainerCard key={trainer.id} trainer={trainer} />
//       ))}
//     </div>
//   );
// };

// export default TrainerList;
