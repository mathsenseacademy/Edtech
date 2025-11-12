// src/pages/HelpCenter.jsx
import React from "react";

export default function HelpCenter() {
  return (
    <main
      className="min-h-screen w-full bg-gradient-to-br from-sky-100 via-sky-200 to-sky-300 px-6 py-16 font-poppins"
      aria-label="Help Centre, Contact Support, Frequently Asked Questions and Privacy Policy"
    >
      <div className="max-w-5xl mx-auto">

        {/* PAGE TITLE */}
        <header className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900">
            Help Centre
          </h1>
          <p className="text-blue-800 text-lg md:text-xl mt-3 opacity-85">
            Find answers, reach us, and explore our policies in one place.
          </p>
        </header>

        {/* SECTION: CONTACT */}
        <section
          id="contact"
          className="bg-white shadow-lg rounded-2xl p-8 mb-12 border border-blue-100"
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Contact Us</h2>
          <p className="text-blue-800 mb-4 leading-relaxed">
            Our team is always here to help with your queries regarding classes,
            enrollment, technical issues, or general support.
          </p>

          <ul className="space-y-3 text-blue-900">
            <li><strong>Email:</strong> info@mathsenseacademy.com</li>
            <li><strong>Phone:</strong> +91 91477 18572</li>
            <li><strong>Working Hours:</strong> Mon to Sat, 9 AM to 9 PM</li>
          </ul>
        </section>

        {/* SECTION: FAQ */}
        <section
          id="faq"
          className="bg-white shadow-lg rounded-2xl p-8 mb-12 border border-blue-100"
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <details className="bg-sky-50 p-4 rounded-xl border border-sky-200 cursor-pointer">
              <summary className="font-semibold text-blue-900 text-lg">
                How do online math classes work?
              </summary>
              <p className="mt-2 text-blue-800">
                Our classes are live and interactive, conducted via Zoom/Google Meet,
                and follow a structured curriculum aligned with school boards.
              </p>
            </details>

            <details className="bg-sky-50 p-4 rounded-xl border border-sky-200 cursor-pointer">
              <summary className="font-semibold text-blue-900 text-lg">
                How do I register my child?
              </summary>
              <p className="mt-2 text-blue-800">
                Simply visit our registration page, fill basic details, and complete
                the onboarding form. You will receive confirmation instantly.
              </p>
            </details>

            <details className="bg-sky-50 p-4 rounded-xl border border-sky-200 cursor-pointer">
              <summary className="font-semibold text-blue-900 text-lg">
                Do you provide study materials?
              </summary>
              <p className="mt-2 text-blue-800">
                Yes, we offer worksheets, chapter notes, homework practice, and
                assessments for every enrolled student.
              </p>
            </details>
          </div>
        </section>

        {/* SECTION: PRIVACY POLICY */}
        <section
          id="privacy-policy"
          className="bg-white shadow-lg rounded-2xl p-8 border border-blue-100"
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Privacy Policy</h2>
          <p className="text-blue-800 leading-relaxed mb-3">
            MathSense Academy is committed to protecting your personal information.
            We collect only essential data needed for student enrollment, academic
            tracking, and communication.
          </p>
          <p className="text-blue-800 leading-relaxed mb-3">
            Your data is never shared with external parties except trusted service
            partners who help us operate the platform securely.
          </p>
          <p className="text-blue-800 leading-relaxed">
            For any privacy concerns, feel free to contact us. We respond within
            24–48 hours.
          </p>
        </section>
      </div>
    </main>
  );
}
