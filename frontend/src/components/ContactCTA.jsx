import { Link } from "react-router-dom";

const ContactCTA = () => (
  <section className="bg-gradient-to-br from-[#875714] to-[#0b6477] text-white text-center px-6 py-16 overflow-hidden">
    <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-snug">
      Ready to Empower Your Child’s Math Journey?
    </h2>
    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
      Contact us today or explore our programs to get started.
    </p>

    <div className="flex flex-wrap justify-center gap-4">
      {/* Filled Primary Button */}
      <Link
        to="/contact"
        className="relative px-6 py-3 rounded-md font-semibold text-[#875714] bg-[#fab554] 
                   hover:bg-[#ffdca1] transition-all duration-300 animate-bounce-slow"
      >
        Contact Us <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>

      {/* Outline Secondary Button */}
      <Link
        to="/courses"
        className="relative px-6 py-3 rounded-md font-semibold text-white border-2 border-white 
                   hover:bg-white/20 hover:border-[#fab554] transition-all duration-300 animate-bounce-slow"
      >
        View Programs <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  </section>
);

export default ContactCTA;
