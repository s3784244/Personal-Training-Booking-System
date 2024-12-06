import TrainerCard from './../../components/Trainers/TrainerCard'
import { trainers } from '../../assets/data/trainers'
import Testimonial from '../../components/Testimonial/Testimonial';

const Trainers = () => {
  return (
    <>
    <section className="bg-[#fff9ea]">
      <div className="container text-center">
        <h2 className="heading">Find a Trainer</h2>
        <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
          <input
            type="search"
            className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
            placeholder="Search Trainer"
          />
          <button className="btn mt-0 rounded-[0px] rounded-r-md">
            Search
          </button>
        </div>
      </div>
    </section>
    <section className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {trainers.map(trainer => (
            <TrainerCard key={trainer.id} trainer={trainer} />
          ))}
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
