import React from "react";
import aboutImg from "../../assets/images/about.png";
import aboutCardImg from "../../assets/images/about-card.png";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section>
      <div className="container">
        <div className="flex justify-between gap-[50px] lg:gap-[130px] xl:gap-0 flex-col lg:flex-row">
          {/* ------ about img ------ */}
          <div className="relative w-3/4 lg:w-1/2 xl:w-[600px] z-10 order-2 lg:order-1">
            <img src={aboutImg} alt="" />
            <div className="absolute z-20 bottom-4 w-[200px] md:w-[300px] right-[-30%] md:right-[-20%] lg:left-50">
              <img src={aboutCardImg} alt="" />
            </div>
          </div>

          {/* ------ about content ------ */}
          <div className="w-full pl-8 lg:w-1/2 xl:w-[670px] order-1 lg:order-2">
            <h2 className="heading">Proud to be one of the nation's best</h2>
            <p className="text_para">
            TrainerHub connects you with certified personal trainers to help you achieve your fitness goals. 
            Whether you're looking to build strength, improve flexibility, or start a new wellness routine, 
            our platform makes it easy to find the right trainer and book sessions that fit your schedule.

            </p>
            <p className="text_para mt-[30px]">
                We believe in making fitness accessible and personalised for 
                everyone. With secure online booking, real-time scheduling, 
                and verified reviews, TrainerHub ensures a seamless experience 
                from your first session to your next milestone. Start your 
                journey to a healthier, stronger you today!

            </p>
            <Link to="/">
              <button className="btn">Learn More</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
