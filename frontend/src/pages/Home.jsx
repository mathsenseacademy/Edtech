// src/pages/Home.jsx
import React from "react";
import Hero from '../components/Hero';
import Roles from "../components/Roles";
import FeaturesSection from '../components/FeaturesSection';
import ClassSection from '../components/ClassSection';
import TestimonialSection from '../components/TestimonialSection';

const Home = ({ heroRef, sentinelRef }) => {
  return (
    <div className="flex flex-col items-center gap-15 p-5 bg-gradient-to-r from-sky-200 to-teal-200 md:gap-10 md:p-2.5">
      <section 
        id="hero" 
        className="w-full max-w-6xl px-5 py-10 box-border md:px-4 md:py-8" 
        ref={heroRef}
      >
        <Hero />
      </section>

<section
  id="roles"
  className="w-full max-w-6xl px-5 py-10 box-border md:px-4 md:py-8"
>
  <Roles />
</section>

 <section 
        id="class" 
        className="w-full max-w-6xl px-5 py-10 box-border md:px-4 md:py-8"
      >
        <ClassSection />
      </section>

      {/* 1-pixel sentinel marks end of hero */}
      <div ref={sentinelRef} className="h-px" />
      
      <section className="w-full max-w-6xl px-5 py-10 box-border md:px-4 md:py-8">
        <FeaturesSection />
      </section>
      
      <section 
        id="testimonials" 
        className="w-full max-w-6xl px-5 py-10 box-border md:px-4 md:py-8"
      >
        <TestimonialSection />
      </section>
    </div>
  );
};

export default Home;



