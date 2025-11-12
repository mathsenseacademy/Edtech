import React from "react";
import { Helmet } from "react-helmet-async";
import aboutUs from "../assets/aboutUs.png";
import teacherImg from "../assets/teacher.png";
// import devImg from "../assets/developer.png";
import shapeMask from "../assets/aboulUsShape.png";

export default function AboutSection() {
  // Structured data for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "MathSense Academy",
    "description": "Premier online math learning platform offering classes from Class 1 to 12, JEE preparation, and Olympiad training in Kolkata, India.",
    "url": "https://www.mathsenseacademy.com",
    "logo": "https://www.mathsenseacademy.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-98765-43210",
      "contactType": "customer service",
      "email": "support@mathsenseacademy.com",
      "availableLanguage": ["English", "Hindi", "Bengali"]
    },
    "sameAs": [
      "https://www.facebook.com/mathsenseacademy",
      "https://www.instagram.com/mathsenseacademy",
      "https://www.youtube.com/@mathsenseacademy"
    ],
    "founder": {
      "@type": "Person",
      "name": "Chief Math Instructor",
      "jobTitle": "Chief Math Instructor"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.mathsenseacademy.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About Us",
        "item": "https://www.mathsenseacademy.com/about"
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>About MathSense Academy | Expert Math Education in Kolkata</title>
        <meta 
          name="title" 
          content="About MathSense Academy | Expert Math Education in Kolkata" 
        />
        <meta 
          name="description" 
          content="Learn about MathSense Academy - Kolkata's premier math learning platform. Expert instruction for Class 1-12, JEE, NTSE, NMTC, and Olympiad preparation. Meet our experienced team." 
        />
        <meta 
          name="keywords" 
          content="MathSense Academy, math tuition Kolkata, online math classes, JEE preparation, Olympiad coaching, NTSE training, NMTC classes, math academy India" 
        />
        <link rel="canonical" href="https://www.mathsenseacademy.com/about" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mathsenseacademy.com/about" />
        <meta 
          property="og:title" 
          content="About MathSense Academy | Expert Math Education in Kolkata" 
        />
        <meta 
          property="og:description" 
          content="Discover MathSense Academy - Expert math instruction for students from Class 1 to 12. Specialized training for JEE, NTSE, NMTC, and Olympiad competitions." 
        />
        <meta property="og:image" content={aboutUs} />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="MathSense Academy" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.mathsenseacademy.com/about" />
        <meta 
          property="twitter:title" 
          content="About MathSense Academy | Expert Math Education in Kolkata" 
        />
        <meta 
          property="twitter:description" 
          content="Discover MathSense Academy - Expert math instruction for students from Class 1 to 12. Specialized training for JEE, NTSE, NMTC, and Olympiad competitions." 
        />
        <meta property="twitter:image" content={aboutUs} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>

        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="MathSense Academy" />
        <meta name="geo.region" content="IN-WB" />
        <meta name="geo.placename" content="Kolkata" />
      </Helmet>

      <article className="w-full bg-gradient-to-br from-sky-50 via-orange-50 to-teal-50 px-6 py-20 font-sans">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto mb-8">
          <ol className="flex items-center gap-2 text-sm text-blue-800">
            <li>
              <a href="/" className="hover:text-teal-600 transition">Home</a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-semibold text-teal-600" aria-current="page">About</span>
            </li>
          </ol>
        </nav>

        <div className="max-w-7xl mx-auto space-y-20">
          {/* ABOUT SECTION */}
          <section aria-labelledby="about-heading">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* TEXT */}
              <div className="w-full lg:w-1/2">
                <h1 id="about-heading" className="text-4xl font-bold text-blue-900 mb-6 leading-tight">
                  About <span className="text-teal-600">MathSense Academy</span>
                </h1>

                <p className="leading-relaxed text-blue-800 mb-4">
                  MathSense Academy was created to redefine how students experience mathematics. 
                  We teach with clarity, intention, and creativity so learners from Class 1 
                  to 12 can build a strong foundation and long-lasting confidence in math.
                </p>

                <p className="leading-relaxed text-blue-800 mb-4">
                  Our comprehensive programs blend expert instruction, interactive live sessions, and 
                  structured learning paths designed for school board exams as well as competitive 
                  goals like NTSE, NMTC, Math Olympiads, and JEE preparation.
                </p>

                <div className="mt-6">
                  <h2 className="font-semibold text-blue-900 mb-2 text-xl">Our Commitment</h2>
                  <ul className="list-disc list-inside space-y-2 text-blue-800">
                    <li>Making mathematics fun, visual, and relatable for all students</li>
                    <li>Providing small-group live classes with personalized attention</li>
                    <li>Building strong problem-solving and logical reasoning skills</li>
                    <li>Preparing students for academic excellence and competitive success</li>
                  </ul>
                </div>
              </div>

              {/* IMAGE */}
              <div className="w-full lg:w-1/2">
                <figure>
                  <div
                    className="w-full aspect-[1.25] shadow-xl rounded-3xl overflow-hidden"
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
                    role="img"
                    aria-label="MathSense Academy students learning mathematics"
                  />
                  <figcaption className="sr-only">
                    Students engaged in interactive math learning at MathSense Academy
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          {/* TEAM SECTION */}
          <section aria-labelledby="team-heading">
            <h2 id="team-heading" className="text-center text-3xl font-bold text-blue-900 mb-10">
              Meet Our Expert Team
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Teacher Card */}
              <article className="bg-white p-8 rounded-3xl shadow-lg border border-orange-200 hover:shadow-xl transition-all">
                <img
                  src={teacherImg}
                  alt="Chief Math Instructor at MathSense Academy"
                  className="w-40 h-40 object-cover rounded-full mx-auto mb-6 shadow"
                  loading="lazy"
                  width="160"
                  height="160"
                />
                <h3 className="text-xl font-semibold text-center text-blue-900">
                  Chief Math Instructor
                </h3>
                <p className="text-center text-blue-800 mt-2">
                  Expert mathematics teacher with years of classroom and online teaching 
                  experience. Specializes in building strong mathematical concepts, Olympiad training, 
                  and exam-focused coaching for students across all grades.
                </p>
              </article>

              {/* Developer Card */}
              <article className="bg-white p-8 rounded-3xl shadow-lg border border-blue-200 hover:shadow-xl transition-all">
                {/* <img
                  src={devImg}
                  alt="Full Stack Developer of MathSense Academy platform"
                  className="w-40 h-40 object-cover rounded-full mx-auto mb-6 shadow"
                  loading="lazy"
                  width="160"
                  height="160"
                /> */}
                <h3 className="text-xl font-semibold text-center text-blue-900">
                  Full Stack Developer
                </h3>
                <p className="text-center text-blue-800 mt-2">
                  Technology expert behind MathSense Academy's learning platform, ensuring smooth 
                  performance, secure systems, and a fast, seamless learning experience for 
                  every student across all devices.
                </p>
              </article>
            </div>
          </section>

          {/* CONTACT SECTION */}
          <section 
            aria-labelledby="contact-heading"
            className="bg-white p-10 rounded-3xl shadow-lg border border-sky-200"
          >
            <h2 id="contact-heading" className="text-3xl font-bold text-blue-900 mb-6 text-center">
              Contact Us
            </h2>

            <address className="not-italic space-y-3 text-center text-blue-800">
              <p>
                Email: <a href="mailto:support@mathsenseacademy.com" className="font-semibold hover:text-teal-600 transition">info@mathsenseacademy.com</a>
              </p>
              <p>
                Phone: <a href="tel:+919876543210" className="font-semibold hover:text-teal-600 transition">+91 91477 18572</a>
              </p>
              <p>
                Website: <a href="https://www.mathsenseacademy.com" className="font-semibold hover:text-teal-600 transition">www.mathsenseacademy.com</a>
              </p>
              <p className="font-semibold">Location: Kolkata, West Bengal, India</p>
            </address>
          </section>
        </div>
      </article>
    </>
  );
}