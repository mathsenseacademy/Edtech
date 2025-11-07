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
      title: t("Expert Tutors"),
      desc:   t("All our instructors are math experts with years of experience."),
      bg: "bg-[#0b6477] text-white",
      border: "border-[#0b6477]",
      alt: t("Graduation hat icon representing expert math tutors")
    },
    {
      icon: bookIcon,
      title: t("Interactive Classes"),
      desc:   t("Fun, engaging sessions that keep kids excited about learning."),
      bg: "bg-[#fab554] text-[#7d4900]",
      border: "border-[#fab554]",
      alt: t("Open book icon representing interactive online math learning")
    },
    {
      icon: clockIcon,
      title: t("Flexible Scheduling"),
      desc:   t("Weekend and evening classes available to fit your schedule."),
      bg: "bg-[#fab554] text-[#7d4900]",
      border: "border-[#fab554]",
      alt: t("Clock icon showing flexible learning hours")
    },
    {
      icon: graphIcon,
      title: t("Personalized Learning"),
      desc:   t("Courses designed to meet each student’s unique needs and learning style."),
      bg: "bg-[#0b6477] text-white",
      border: "border-[#0b6477]",
      alt: t("Graph icon representing personalized math progress")
    },
  ];

  const getDirection = (idx) => {
    const directions = [
      { x: -60, y: 0 },
      { x: 60, y: 0 },
      { x: 0, y: 60 },
      { x: 0, y: -60 }
    ];
    return directions[idx % directions.length];
  };

  return (
    <section
      className="bg-sky-200 px-6 py-8 md:px-12 font-poppins"
      aria-label="Why choose MathSense Academy - Online Math Coaching"
    >
      {/* Header */}
      <header className="mx-auto w-full md:w-3/4 text-center mb-12">
        <h2 className="flex items-center justify-center gap-3 flex-wrap text-[#875714] font-bold text-3xl md:text-4xl leading-tight">
          <span>{t("Why Choose ")}</span>
          <img
            src={logo}
            alt="MathSense Academy official logo"
            className="h-20 md:h-32 drop-shadow"
            loading="lazy"
          />
        </h2>

        <p className="text-[#7d4900] text-base md:text-lg mt-3 leading-relaxed">
          {t("At MathSense Academy, we help students from Grade 1 to 12 build strong math skills through expert-led, engaging, and flexible learning programs. Here’s why parents and students choose us:")}
        </p>
      </header>

      {/* Grid + Mentor */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-2 w-full">
          {features.map((item, idx) => {
            const direction = getDirection(idx);
            return (
              <motion.article
                key={idx}
                initial={{ opacity: 0, ...direction }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: idx * 0.2,
                  ease: [0.25, 0.8, 0.25, 1]
                }}
                viewport={{ once: true }}
                className={`${item.bg} shadow-md rounded-2xl p-8 flex flex-col items-center gap-3 hover:scale-[1.04] hover:shadow-xl transition-all duration-300`}
              >
                <img
                  src={item.icon}
                  alt={item.alt}
                  className="w-12 h-12"
                  loading="lazy"
                />
                <h3 className="text-xl md:text-2xl font-semibold text-center">
                  {item.title}
                </h3>
                <p className="text-center text-base md:text-lg leading-relaxed">
                  {item.desc}
                </p>
              </motion.article>
            );
          })}
        </div>

        {/* Mentor Image */}
        <motion.div
          className="flex-1 text-center"
          initial={{ opacity: 0, y: 100, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1]
          }}
          viewport={{ once: true }}
        >
          <img
            src={mentor}
            alt="Online math tutor teaching students on a virtual whiteboard"
            className="max-w-full h-auto mx-auto drop-shadow-lg"
            loading="lazy"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturesSection;
