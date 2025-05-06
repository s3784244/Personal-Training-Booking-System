import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import TrainerCard from "../../components/Trainers/TrainerCard";
import Loading from "../../components/Loader/Loader";
import Error from "../../components/Error/Error";

const MyBookings = () => {
  const {
    data: bookings,
    loading,
    error,
  } = useFetchData(`${BASE_URL}users/bookings/my-bookings`);

  return (
    <div>
      {loading && !error && <Loading />}

      {error && !loading && <Error errMessage={error} />}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {bookings.map(trainer => (
            <TrainerCard trainer={trainer} key={trainer._id} />
          ))}
        </div>
      )}
      {!loading && !error && bookings.length === 0 && 
        <h2 className="mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor">
          You do not have any bookings
        </h2>}
    </div>
  );
};

export default MyBookings;
