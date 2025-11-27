import { FaLightbulb } from "react-icons/fa";
import teacher_img from "../assets/subhadeepshome.png"; // Teacher image

export default function MeetTheTeacher() {
  return (
    <section className="w-full py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center bg-yellow-400 border-2 border-black rounded px-4 py-2">
          <div className="bg-orange-400 border-2 border-black rounded w-10 h-10 mr-3 flex items-center justify-center">
            <FaLightbulb className="text-white text-lg" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold uppercase">
            Meet The Teacher
          </h2>
        </div>
      </div>

      {/* Teacher Section */}
      <div className="flex flex-col md:flex-row-reverse items-center md:items-start gap-6 md:gap-12 px-4 md:px-20">
        {/* Right photo */}
        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src={teacher_img}
            alt="Teacher"
            className="max-w-sm md:max-w-md rounded-lg shadow-lg border-2 border-black"
          />
        </div>

        {/* Left details */}
        <div className="flex flex-col flex-1 gap-6 font-[Lexend]">
          {/* Top details */}
          <div className="border-2 border-black bg-sky-300 p-6 rounded-lg">
            <h2 className="text-center text-xl font-bold mb-3">
              Suvadip Shome
            </h2>
            <p className="text-lg mb-3">
              Let&apos;s get to know our teacher! Share some fun information:
            </p>
            <ul className="list-disc list-inside text-lg space-y-2">
              <li>Favorite subject: Math</li>
              <li>Years of experience: 15+</li>
              <li>Hobbies: Reading, Hiking</li>
            </ul>
          </div>

          {/* Bottom contact */}
          <div className="border-2 border-black bg-pink-300 p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-2">Contact Information</h2>
            <p className="text-lg">+91 7003 416 272</p>
          </div>
        </div>
      </div>
    </section>
  );
}
