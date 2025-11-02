import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Vite-friendly asset imports (avoid require)
import anushka from "../assets/AnushkaDey.png";
import susmita from "../assets/Susmita-Adhikary.png";
import sourashis from "../assets/Sourashis-Banerjee.png";

export default function TestimonialSection() {
  const testimonials = useMemo(
    () => [
      {
        title: "Anushka Dey",
        text:
          "Mathsense Academy makes learning math fun and easy, helping me feel confident and score better in class!",
        img: anushka,
      },
      {
        title: "Susmita Adhikary",
        text:
          "Math Sense Academy has transformed the way I understand math, making complex topics simple and enjoyable!",
        img: susmita,
      },
      {
        title: "Sourashis Banerjee",
        text:
          "Thanks to Mathsense Academy, I now find math exciting and easier to understand!",
        img: sourashis,
      },
    ],
    []
  );

  return (
    // keep the bg image in /public as testmonial_bg.png, or change to an imported asset if you prefer
    <section className="bg-[url('/testmonial_bg.png')] bg-center bg-cover">
      <div className="p-6 bg-sky-200 backdrop-blur-md">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-amber-800 text-3xl font-bold">Testimonials</h2>
          <p className="text-amber-400 text-base max-w-2xl mx-auto">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. It has survived not only five centuries but also the leap
            into electronic typesetting.
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="bg-gradient-to-r from-[#0b637756] to-[#f3a94149] p-6 rounded-xl max-w-4xl mx-auto">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, A11y]}
            slidesPerView={1}
            loop
            autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation
            pagination={{ clickable: true }}
            className="!pb-10" // space for pagination bullets
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center md:flex-row px-4">
                  {/* Profile Image */}
                  <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden shadow-md mb-4 md:mb-0 md:mr-6">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="bg-white bg-opacity-80 p-6 rounded-xl flex-1">
                    <h3 className="text-xl font-bold text-cyan-800 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.text}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
