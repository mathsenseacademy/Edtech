import React from "react";
import heroImage from "../assets/hero.png";

const Hero = () => {
  return (
    <section
      className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-sky-200 to-sky-300 font-poppins py-10 overflow-hidden"
      aria-labelledby="hero-heading"
      role="region"
    >
      {/* SEO: JSON-LD schema for better rich snippets */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "MathSense Academy",
          description:
            "Expert-led math learning programs for school students with personalized learning support.",
          url: "https://mathsenseacademy.com",
          sameAs: [
            "https://www.facebook.com",
            "https://www.instagram.com",
            "https://www.youtube.com"
          ]
        })}
      </script>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 flex flex-col md:flex-row items-center gap-14">

        {/* LEFT CONTENT */}
        <div className="flex-1 text-center md:text-left animate-fadeInUp">
          
          {/* SEO: Proper H1 for homepage */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-900 leading-tight drop-shadow-sm"
          >
            Unlock Your Child’s{" "}
            <span className="text-amber-600">Math Potential</span>
          </h1>

          {/* SEO: supporting paragraph */}
          <p className="mt-5 text-lg sm:text-xl text-blue-800 max-w-xl mx-auto md:mx-0 opacity-90">
            Fun, engaging, and expert-led math programs designed to boost
            confidence, curiosity, logical thinking, and long-term problem-solving skills.
          </p>

          {/* ✅ Use <a> instead of JS button for SEO + crawling */}
          <a
            href="https://mathsenseacademy.com/login/student"
            className="
              inline-block mt-8 bg-amber-500 hover:bg-amber-600 
              text-white font-semibold text-lg px-10 py-4 rounded-full 
              shadow-xl hover:shadow-2xl transition-all duration-300 
              hover:scale-105 border-2 border-white focus:outline-none 
              focus:ring-4 focus:ring-amber-300
            "
          >
            🚀 Register Student
          </a>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-1 relative flex justify-center animate-fadeInUp md:animate-fadeInRight">
          <div className="w-[85%] md:w-[80%] lg:w-[70%] rounded-[40px_0_40px_0] border-4 border-white shadow-2xl overflow-hidden">
            
            {/* ✅ SEO: descriptive alt text, lazy loading, width & height for CLS */}
            <img
              src={heroImage}
              alt="Students engaging in interactive math learning at MathSense Academy"
              loading="lazy"
              width="600"
              height="500"
              className="w-full h-auto object-cover rounded-[40px_0_40px_0]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
