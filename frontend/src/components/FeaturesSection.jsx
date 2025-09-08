import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import gradIcon from "../assets/hatIcon.png";
import bookIcon from "../assets/bookIcon.png";
import clockIcon from "../assets/watchIcon.png";
import graphIcon from "../assets/graphIcon.png";
import logo from "../assets/logoWithName.png";
import mentor from "../assets/teacher.png";

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: gradIcon,
      title: "Expert Tutors",
      desc: "All our instructors are math experts with years of experience.",
      bg: "bg-[#0b6477] text-white",
    },
    {
      icon: bookIcon,
      title: "Interactive Classes",
      desc: "Fun, engaging sessions that keep kids excited about learning.",
      bg: "bg-[#fab554] text-[#7d4900]",
    },
    {
      icon: clockIcon,
      title: "Flexible Scheduling",
      desc: "Weekend and evening classes available to fit your schedule.",
      bg: "bg-[#fab554] text-[#7d4900]",
    },
    {
      icon: graphIcon,
      title: "Personalized Learning",
      desc: "Courses designed to meet each student’s unique needs and learning style.",
      bg: "bg-[#0b6477] text-white",
    },
  ];

  const getDirection = (idx) => {
    const directions = [
      { x: -60, y: 0 },
      { x: 60, y: 0 },
      { x: 0, y: 60 },
      { x: 0, y: -60 },
    ];
    return directions[idx % directions.length];
  };

  return (
    <section className="bg-white px-6 py-8 md:px-12 font-poppins">
      {/* Header */}
      <div className="mx-auto w-full md:w-3/4 text-center mb-10">
        <h2 className="flex items-center justify-center gap-3 flex-wrap text-[#875714] font-bold text-3xl md:text-4xl">
          <span>Why Choose</span>
          <img src={logo} alt="Mathsense Academy" className="h-24 md:h-36" />
        </h2>
        <p className="text-[#7d4900] text-base md:text-lg mt-3">
          At MathSense Academy, we help students from{" "}
          <strong>Grade 1 to 12</strong> build strong math skills through
          expert-led, engaging, and flexible learning
        </p>
      </div>

      {/* Grid + Mentor */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-2 w-full">
          {features.map((item, idx) => {
            const direction = getDirection(idx);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, ...direction }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: idx * 0.2,
                  ease: [0.25, 0.8, 0.25, 1],
                }}
                viewport={{ once: true }}
                className={`${item.bg} shadow-md rounded-xl p-8 flex flex-col items-center gap-3`}
              >
                <img src={item.icon} alt={item.title} className="w-12 h-12" />
                <h3 className="text-xl md:text-2xl font-semibold text-center">
                  {item.title}
                </h3>
                <p className="text-center text-base md:text-lg">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Mentor Image */}
        <motion.div
          className="flex-1 text-center"
          initial={{ opacity: 0, y: 100, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ once: true }}
        >
          <img
            src={mentor}
            alt="Mentor"
            className="max-w-full h-auto mx-auto"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
