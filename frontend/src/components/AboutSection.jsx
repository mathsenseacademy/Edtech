import React from "react";
import aboutUs from "../assets/aboutUs.png";
import shapeMask from "../assets/aboulUsShape.png";

export default function AboutSection() {
  return (
    <section className="w-full bg-[#fffdf6] px-4 py-16 font-sans">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
        
        {/* TEXT SIDE */}
        <div className="w-full lg:w-1/2 px-6">
          <h2 className="text-3xl font-bold mb-6">
            <strong>About</strong>{" "}
            <span className="text-[#fc7c5f]">Math Senseacademy</span>
          </h2>
          <p className="mb-4 leading-relaxed font-ibm">
            Founded with a vision to redefine math education, MathSense Academy
            empowers students from Class 1 to 12 through structured,
            curriculum-aligned online learning.
          </p>
          <p className="mb-4 leading-relaxed font-ibm">
            Our programs combine expert-led instruction, interactive class
            formats, and adaptive learning to support students at every level—
            whether they’re building basics, preparing for school exams, or
            aiming for NTSE, NMTC, Olympiads, or JEE.
          </p>
          <p className="mb-2">We are committed to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Making math fun, logical, and relatable</li>
            <li>Providing small-group classes with focused attention</li>
            <li>Equipping learners with the skills to think, solve, and succeed</li>
          </ul>
        </div>

        {/* IMAGE SIDE */}
        <div className="w-full lg:w-1/2">
          <div
            className="w-full aspect-[1.25] overflow-hidden"
            style={{
              backgroundImage: `url(${aboutUs})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
              WebkitMaskImage: `url(${shapeMask})`,
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "300% 300%",
              WebkitMaskPosition: "center",
              maskImage: `url(${shapeMask})`,
              maskRepeat: "no-repeat",
              maskSize: "300% 300%",
              maskPosition: "center",
            }}
          />
        </div>
      </div>
    </section>
  );
}
