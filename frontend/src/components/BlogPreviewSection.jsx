import icon1 from "../../assets/bookIcon.png";
import icon2 from "../../assets/bookIcon.png";
import icon3 from "../../assets/bookIcon.png";

export default function BlogPreviewSection() {
  return (
    <section className="bg-[#f9fbff] py-16 px-6 text-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a237e] mb-10">
          Blogs
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {/* Exam Reminder */}
          <div className="bg-white rounded-xl shadow-md w-72 text-left p-6 transition-transform duration-300 hover:-translate-y-1">
            <img src={icon1} alt="exam icon" className="w-full h-auto rounded-md mb-4" />
            <h4 className="text-xl font-semibold text-[#1a237e] mb-2">Exam reminder</h4>
            <hr className="my-3" />
            <p className="text-gray-700 mb-2">The unit exam will be on the following dates:</p>
            <p className="text-gray-900 font-bold mb-2">
              December 8: 8B <br /> December 9: 8A, 8C
            </p>
            <hr className="my-3" />
            <p className="text-sm text-gray-600">Check your class syllabus for exam coverage.</p>
          </div>

          {/* Volunteer Opportunity */}
          <div className="bg-white rounded-xl shadow-md w-72 text-left p-6 transition-transform duration-300 hover:-translate-y-1">
            <img src={icon2} alt="volunteer icon" className="w-full h-auto rounded-md mb-4" />
            <h4 className="text-xl font-semibold text-[#1a237e] mb-2">Volunteer opportunity</h4>
            <hr className="my-3" />
            <p className="text-gray-700 mb-2">
              The science department is looking for passionate students to join EcoAction.
              As a volunteer, you'll use your knowledge and skills in real-world conservation and research.
            </p>
            <hr className="my-3" />
            <p className="text-sm text-gray-600">
              Make a difference! Apply today at{" "}
              <strong>hello@reallygreatsite.com</strong>.
            </p>
          </div>

          {/* Science Fair */}
          <div className="bg-white rounded-xl shadow-md w-72 text-left p-6 transition-transform duration-300 hover:-translate-y-1">
            <img src={icon3} alt="science icon" className="w-full h-auto rounded-md mb-4" />
            <h4 className="text-xl font-semibold text-[#1a237e] mb-2">Science fair competition</h4>
            <hr className="my-3" />
            <p className="text-gray-700 mb-2">
              Are you a budding scientist? Sign up for the Annual Science Fair!
            </p>
            <p className="text-gray-900 mb-2">
              <strong>KEY DATES:</strong> <br />
              Submission: <strong>November 23, 2030</strong> <br />
              Fair: <strong>April 17, 2030</strong>
            </p>
            <hr className="my-3" />
            <p className="text-sm text-gray-600">
              Register at <strong>www.reallygreatsite.com</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
