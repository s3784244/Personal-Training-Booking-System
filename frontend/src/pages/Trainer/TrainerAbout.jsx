import React from 'react';
import { formatDate } from '../../utils/formatDate';
const TrainerAbout = () => {
  return (
    <div>
      <div className="text-[20px] leading-[30px] text-headingColor font-semibold flex items-center gap-2">
        <h3>
          <span className="text-irisBlueColor font-bold text-[24px] leading-9">Trainer</span>
        </h3>
      </div>
      <p className="text__para">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis eius assumenda corrupti at fugiat ipsum odio laudantium quisquam veritatis consectetur velit illo ullam animi necessitatibus vero voluptatem fuga consequuntur, aspernatur perspiciatis adipisci. Necessitatibus et non sapiente sit distinctio, repellat illo totam perspiciatis, inventore ex assumenda odit natus cumque saepe nostrum?
      </p>
      <div className="mt-12">
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">Certifications</h3>
        <ul className="pt-4 md:p-5">
          <li className="flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]">
            <div>
              <span className="text-irisBlueColor text-[15px] leading-6 font-semibold">{formatDate("9-13-2014")} - {formatDate("9-13-2016")}</span>
              <p className="text-[15px] leading-6 font-medium text-textColor">Certified Personal Trainer (CPT)</p>
            </div>
            <p className="text-[14px] leading-5 font-medium text-textColor">National Academy of Sports Medicine (NASM)</p>
          </li>
          <li className="flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]">
            <div>
              <span className="text-irisBlueColor text-[15px] leading-6 font-semibold">{formatDate("9-13-2014")} - {formatDate("9-13-2016")}</span>
              <p className="text-[15px] leading-6 font-medium text-textColor">Certified Strength and Conditioning Specialist (CSCS)</p>
            </div>
            <p className="text-[14px] leading-5 font-medium text-textColor">National Strength and Conditioning Association (NSCA)</p>
          </li>
          <li className="flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]">
            <div>
              <span className="text-irisBlueColor text-[15px] leading-6 font-semibold">{formatDate("9-13-2014")} - {formatDate("9-13-2016")}</span>
              <p className="text-[15px] leading-6 font-medium text-textColor">Certified Yoga Instructor</p>
            </div>
            <p className="text-[14px] leading-5 font-medium text-textColor">Yoga Alliance</p>
          </li>
        </ul>
      </div>
      <div className="mt-12">
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">Experience</h3>
        <ul className="grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5">
          <li className="p-4 rounded bg-[#fff9ea]">
            <span className="text-yellowColor text-[15px] leading-6 font-semibold">
              {formatDate("07-04-2010")} - {formatDate("08-13-2014")}
            </span>
            <p className="text-[16px] leading-6 font-medium text-textColor">
              Personal Trainer
            </p>
            <p className="text-[14px] leading-5 font-medium text-textColor">
              Anytime Fitness, New York.
            </p>
          </li>
          <li className="p-4 rounded bg-[#fff9ea]">
            <span className="text-yellowColor text-[15px] leading-6 font-semibold">
              {formatDate("07-04-2010")} - {formatDate("08-13-2014")}
            </span>
            <p className="text-[16px] leading-6 font-medium text-textColor">
              Senior Fitness Trainer
            </p>
            <p className="text-[14px] leading-5 font-medium text-textColor">
              Gold's Gym, Los Angeles.
            </p>
          </li>
          
        </ul>

      </div>

    </div>
  );
};

export default TrainerAbout;
