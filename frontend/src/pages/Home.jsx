import React from 'react'
import About from '../components/About/About'
import ServiceList from '../components/Services/ServiceList'
import TrainerList from '../components/Trainers/TrainerList'
import FaqList from '../components/Faq/FaqList'
import Testimonial from '../components/Testimonial/Testimonial'
import heroImg01 from '../assets/images/hero-img01.png'
import heroImg02 from '../assets/images/hero-img02.png'
import heroImg03 from '../assets/images/hero-img03.png'
import icon01 from '../assets/images/icon01.png';
import icon02 from '../assets/images/icon02.png';
import icon03 from '../assets/images/icon03.png';
import featureImg from '../assets/images/feature-img.png'
import faqImg from '../assets/images/faq-img.png'
import videoIcon from '../assets/images/video-icon.png'
import avatarIcon from '../assets/images/avatar-icon.png'

import { Link } from "react-router-dom";
import { BsArrowRight, } from "react-icons/bs";



const Home = () => {
  return (
    <>
      {/* ===== hero section start ===== */}
     
        <section className='hero_section pt-[60px] 2xl:h[800px]'>
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between">
              {/* ------ hero content ------ */}
              <div>
                <div className="lg:w-[570px]">
                  <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]">
                    We help you achieve your fitness goals.
                  </h1>
                  <p className="text_para">
                    TrainerHub makes it easy to connect with certified trainers and book sessions that fit your lifestyle. 
                    Discover the right coach for your goals, manage your schedule, and track your progress—all in one place. 
                    Start your fitness journey today and experience a seamless way to achieve results!
                  </p>
                  <Link to="/trainers">
                    <button className="btn">Request an Consultation</button>
                  </Link>
                </div>
                {/* ------ hero counter ------ */}
                <div className="mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">
                  <div>
                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700]
                    text-headingColor">
                      30+
                    </h2>
                    <span className='w-[100px] h-2 bg-yellowColor rounded-full block mt-[-14px]'></span>
                    <p className="text_para">Years of Experience</p>
                  </div>

                  <div>
                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700]
                    text-headingColor">
                      15+
                    </h2>
                    <span className='w-[100px] h-2 bg-purpleColor rounded-full block mt-[-14px]'></span>
                    <p className="text_para">Gym locations</p>
                  </div>

                  <div>
                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700]
                    text-headingColor">
                      100%
                    </h2>
                    <span className='w-[100px] h-2 bg-irisBlueColor rounded-full block mt-[-14px]'></span>
                    <p className="text_para">Client Satisfaction</p>
                  </div>

                </div>



              </div>
              {/* ------ hero content ------ */}

              <div className="flex gap-[30px] justify-end">
                <div>
                  <img className='w-full' src={heroImg01} alt="" />
                </div>
                <div className='mt-[30px]'>
                  <img src={heroImg02} alt='' className='w-full mb-[30px]'/>
                  <img src={heroImg03} alt='' className='w-full mb-[30px]'/>

                </div>
              </div>


            </div>
          </div>
        </section>
      {/* ===== hero section end ===== */}
      <section>
        <div className="container">
          <div className="lg:w-[470px] mx-auto">
            <h2 className="heading text-center">Providing the best fitness services</h2>
            <p className="text_para text-center">
              World-class fitness training for everyone. Our trainers offer unmatched expertise and support.
            </p>          
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] 
            lg:mt-[55px]">
            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon01} alt="" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Find a Trainer
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Our platform connects you with certified personal trainers who specialize in various fitness disciplines.
                </p>
                <Link 
                  to="/trainers"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto 
                  flex items-center justify-center group hover:bg-primaryColor hover:border-none"
                >
                    <BsArrowRight className="group-hover:text-white w-6 h-5" />
                </Link>
              </div>
            </div>

            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon02} alt="" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Find a Location
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Discover top-rated gyms and fitness centers in your area to train with our personal trainers.
                </p>
                <Link 
                  to="/trainers"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto 
                  flex items-center justify-center group hover:bg-primaryColor hover:border-none"
                >
                    <BsArrowRight className="group-hover:text-white w-6 h-5" />
                </Link>
              </div>
            </div>

            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon03} alt="" />
              </div>

              <div className="mt-[30px]">
                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Book a Session
                </h2>
                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  Schedule your training sessions at your convenience with our easy booking system.
                </p>
                <Link 
                  to="/trainers"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto 
                  flex items-center justify-center group hover:bg-primaryColor hover:border-none"
                >
                    <BsArrowRight className="group-hover:text-white w-6 h-5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>
      
      {/* ===== about section ===== */}
      <About />
      
      {/* ===== services section start ===== */}
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">Our fitness services</h2>
            <p className="text_para text-center">
              Providing a variety of fitness services to meet all your training needs.
            </p>
          </div>
          <ServiceList />
        </div>
      </section>
      {/* ===== services section end ===== */}

      {/* ===== feature section start ===== */}
      <section>
        <div className="container">
          <div className="flex items-center justify-between flex-col lg:flex-row">
            {/* ------ feature content ------ */}
            <div className="xl:w-[670px]">
              <h2 className="heading">
                Get virtual training <br /> anytime.
              </h2>
              <ul className="pl-4">
                <li className="text_para">
                  1. Schedule the session directly.
                </li>
                <li className="text_para">
                  2. Search for your trainer here, and contact their office.
                </li>
                <li className="text_para">
                  3. View our trainers who are accepting new clients, use the online scheduling tool to select a session time.
                </li>
              </ul>
              <Link to="/">
                <button className='btn'>Learn More</button>
              </Link>
            </div>

             {/* ------ feature image ------ */}
             <div className="relative z-10 xl:w-[770px] flex justify-end mt-[50px] lg:mt-0">
              <img src={featureImg} className="w-3/4" alt="" />
              <div className="w-[150px] lg:w-[248px] bg-white absolute bottom-[-50px] left-0 
              md:bottom-[100px] md:left-5 z-20 p-2 pb-3 lg:pt-4 lg:px-4 lg:pb-[26px] 
              rounded-[10px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[6px] lg:gap-3">
                    <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-headingColor font-[600]">
                      Tue, 24
                    </p>
                    <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-textColor font-[400]">
                      10:00AM
                    </p>
                  </div>
                  <span className="w-5 h-5 lg:w-[34px] lg:h-[34px] flex items-center justify-center bg-yellowColor rounded py-1 px-[6px] lg:py-3 lg:px-[9px]">
                    <img src={videoIcon} alt="" />
                  </span>
                </div>

                <div className="w-[65px] lg:w-[96px] bg-[#CCF0F3] py-1 px-2 lg:py-[6px] 
                lg:px-[10px] text-[8px] leading-[8px] lg:text-[12px] lg:leading-4
                text-irisBlueColor font-[500] mt-2 lg:mt-[4px] rounded-full">
                  Consultation
                </div>

                <div className="flex items-center gap-[6px] lg:gap-[10px] mt-2 lg:mt-[18px]">
                  <img src={avatarIcon} alt="" />
                  <h4 className="text-[10px] leading-3 lg:text-[16px] lg:leading-[22px] font-[700]
                    text-headingColor">
                      Wayne Collins
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ===== feature section end ===== */}
      
      {/* ===== our great trainers start ===== */}
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">Our great trainers</h2>
            <p className="text_para text-center">
              World-class fitness training for everyone. Our trainers offer unmatched expertise and support.
            </p>
          </div>
          <TrainerList />
        </div>
      </section>
      {/* ===== our great trainers end ===== */}

      {/* ===== faq section ===== */}
      <section>
        <div className="container">
          <div className="flex justify-between gap-[50px] lg:gap-0">
            <div className="w-1/2 pr-8  lg:w-1/2 xl:w-[600px] hidden md:block">
              <img src={faqImg} alt="" />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="heading">
                Most questions by our beloved clients
              </h2>
              <FaqList />
            </div>
          </div>
        </div>
      </section>
      {/* ===== faq section end ===== */}

      {/* ===== testimonial ===== */}
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">What our clients say</h2>
            <p className="text__para text-center">
              Hear from our satisfied clients about their fitness journeys.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>
      {/* ===== testimonial end ===== */}
    </>
  )
  
}

export default Home
