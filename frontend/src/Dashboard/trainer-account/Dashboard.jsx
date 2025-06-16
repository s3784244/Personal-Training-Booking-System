import Error from "../../components/Error/Error";
import Loader from "../../components/Loader/Loader";
import useGetProfile from "../../hooks/useFetchData";
import { useState } from "react";
import { BASE_URL } from "../../config";
import Tabs from "./Tabs";
import starIcon from "../../assets/images/Star.png";
import TrainerAbout from "../../pages/Trainer/TrainerAbout";
import Profile from "./Profile";
import Bookings from "./Bookings";

const Dashboard = () => {
  const { data, loading, error } = useGetProfile(
    `${BASE_URL}trainers/profile/me`
  );

  const [tab, setTab] = useState("overview");

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {loading && !error && <Loader />}
        {error && !loading && <Error />}

        {!loading && !error && (
          <div className="grid lg:grid-cols-3 gap-[30px] lg:gap-[50px]">
            <Tabs tab={tab} setTab={setTab} />
            <div className="lg:col-span-2">
              <div className="mt-8">
                {tab === "overview" && (
                  <div>
                    <div className="flex items-center gap-4 mb-10">
                      <figure className="max-w-[200px] max-h-[200px]">
                        <img src={data?.photo} alt="" className="w-full" />
                      </figure>
                      <div>
                      {Array.isArray(data.qualifications) && data.qualifications.length > 0 && (
                        <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-4 lg:py-2 lg:px-6 rounded 
                                        text-[12px] leading-4 lg:text-[16px] lg:leading-6 font-semibold">
                          {data.qualifications.map((q) => q.certification).join(", ")}
                        </span>
                      )}

                        <h3 className="text-[22px] leading-9 font-bold text-headingColor mt-3">
                          {data.name}
                        </h3>

                        <div className="flex items-center gap-[6px]">
                          <span className="flex items-center gap-[6px] text-headingColor text-[14px] 
                                          leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                            <img src={starIcon} alt="" />
                            {Number(data.averageRating).toFixed(1)}
                          </span>
                          <span className="text-textColor text-[14px] 
                                          leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                            {data.totalRating}
                          </span>
                        </div>
                        <p className="text__para font-[15px] lg:max-w-[390px] leading-6">
                          {data?.bio}
                        </p>
                      </div>
                    </div>
                    <TrainerAbout
                      name={data.name}
                      about={data.about}
                      qualifications={data.qualifications || []}
                      experiences={data.experiences || []}
                    />
                  </div>
                )}
                {tab === "bookings" && (
                  <Bookings bookings={data?.bookings || []} />
                )}
                {tab === "profile" && <Profile trainerData={data}/>}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
