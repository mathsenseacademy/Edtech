// src/pages/Home.jsx
import React from "react";
import Hero from '../components/Hero';
import Roles from "../components/Roles";
import FeaturesSection from '../components/FeaturesSection';
import ProgramsSection from '../components/ProgramsSection';
import TestimonialSection from '../components/TestimonialSection';

const Home = ({ heroRef, sentinelRef }) => {
  return (
    <div className="flex flex-col items-center gap-15 p-5 bg-blue-50 md:gap-10 md:p-2.5">
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
        id="programs" 
        className="w-full max-w-6xl px-5 py-10 box-border md:px-4 md:py-8"
      >
        <ProgramsSection />
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



