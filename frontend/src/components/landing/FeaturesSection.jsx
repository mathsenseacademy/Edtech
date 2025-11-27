import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import gradIcon from "../../assets/hatIcon.png";
import bookIcon from "../../assets/bookIcon.png";
import clockIcon from "../../assets/watchIcon.png";
import graphIcon from "../../assets/graphIcon.png";
import logo from "../../assets/logoWithName.png";
import mentor from "../../assets/teacher.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: gradIcon,
      title: t("Expert Tutors"),
      desc: t("All our instructors are math experts with years of experience."),
      bg: "bg-[#0b6477] text-white",
      border: "border-[#0b6477]",
      alt: t("Graduation hat icon representing expert math tutors")
    },
    {
      icon: bookIcon,
      title: t("Interactive Classes"),
      desc: t("Fun, engaging sessions that keep kids excited about learning."),
      bg: "bg-[#fab554] text-[#7d4900]",
      border: "border-[#fab554]",
      alt: t("Open book icon representing interactive online math learning")
    },
    {
      icon: clockIcon,
      title: t("Flexible Scheduling"),
      desc: t("Weekend and evening classes available to fit your schedule."),
      bg: "bg-[#fab554] text-[#7d4900]",
      border: "border-[#fab554]",
      alt: t("Clock icon showing flexible learning hours")
    },
    {
      icon: graphIcon,
      title: t("Personalized Learning"),
      desc: t("Courses designed to meet each student’s unique needs and learning style."),
      bg: "bg-[#0b6477] text-white",
      border: "border-[#0b6477]",
      alt: t("Graph icon representing personalized math progress")
    },
  ];

  return (
    <section
      className="bg-sky-200 px-6 py-8 md:px-12 font-poppins"
      aria-label={t("Why Choose MathSense Academy")}
    >

      {/* SEO Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalService",
          name: "MathSense Academy",
          description:
            "Online math coaching for students from Grade 1 to 12, offering expert tutors and personalized learning.",
          provider: {
            "@type": "Organization",
            name: "MathSense Academy"
          }
        })}
      </script>

      {/* Header */}
      <header className="mx-auto w-full md:w-3/4 text-center mb-12">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 flex-wrap text-[#875714] font-bold text-3xl md:text-4xl leading-tight"
        >
          <span>{t("Why Choose")}</span>
          <img
            src={logo}
            alt="MathSense Academy logo"
            className="h-20 md:h-32 drop-shadow"
            loading="lazy"
          />
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-[#7d4900] text-base md:text-lg mt-3 leading-relaxed"
        >
          {t("At MathSense Academy, we help students from Grade 1 to 12 build strong math skills through expert-led, engaging, and flexible learning programs. Here’s why parents and students choose us:")}
        </motion.p>
      </header>

      {/* Features + Mentor */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10">

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-2 w-full">
          {features.map((item, idx) => (
            <motion.article
              key={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.6, delay: idx * 0.2 }}
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
          ))}
        </div>

        {/* Mentor / Teacher Image */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex-1 text-center"
        >
          <img
            src={mentor}
            alt={t("Online math tutor teaching students")}
            className="max-w-full h-auto mx-auto drop-shadow-lg"
            loading="lazy"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturesSection;
