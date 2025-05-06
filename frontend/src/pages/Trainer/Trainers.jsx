import TrainerCard from './../../components/Trainers/TrainerCard'
import { trainers } from '../../assets/data/trainers'
import Testimonial from '../../components/Testimonial/Testimonial';
import { BASE_URL } from "./../../config";
import useFetchData from "./../../hooks/useFetchData";
import Loader from "./../../components/Loader/Loader";
import Error from "./../../components/Error/Error";
import { useState, useEffect } from 'react';


const Trainers = () => {
 
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const handleSearch = () => {
    setQuery(query.trim());
    console.log('handle search');
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 700);
  
    return () => clearTimeout(timeout);
  }, [query]);
  

  // NOTE - remove to get mockup data
  const { data: trainers, loading, error } = useFetchData(`${BASE_URL}trainers?query=${debouncedQuery}`);

  return (
    <>
    <section className="bg-[#fff9ea]">
      <div className="container text-center">
        <h2 className="heading">Find a Trainer</h2>
        <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
          <input
            type="search"
            className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
            placeholder="Search Trainer by name or specialisation"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button onClick={handleSearch} className="btn mt-0 rounded-[0px] rounded-r-md">
            Search
          </button>
        </div>
      </div>
    </section>
    <section>
        <div className="container">
          {loading && <Loader />}
          {error && <Error />}
          {!loading && !error && ( <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {trainers.map(trainer => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </div>)}
        </div>
      </section>
      <section className="container">
        <div className="xl:w-[470px] mx-auto">
          <h2 className="heading text-center">What our clients say</h2>
          <p className="text__para text-center">
            World-class fitness training for everyone. Our trainers offer unmatched expertise and support.
          </p>
        </div>
        <div>
          <Testimonial />
        </div>
      </section>
    </>
  );
}

export default Trainers;
