// src/pages/Home.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../components/Hero";
import Roles from "../components/Roles";
import FeaturesSection from "../components/FeaturesSection";
import ClassSection from "../components/ClassSection";
import TestimonialSection from "../components/TestimonialSection";

const Home = ({ heroRef, sentinelRef }) => {
  return (
    <div className="flex flex-col items-center gap-15 p-5 bg-gradient-to-r from-sky-200 to-teal-700 md:gap-10 md:p-2.5">

      {/* ✅ SEO META TAGS */}
      <Helmet>
  {/* Core SEO */}
  <title>Online Math Classes for Class 1–12 | Olympiad & JEE Foundation | MathSense Academy</title>
  <meta
    name="description"
    content="Live, concept-first math classes for Class 1–12 with Olympiad & JEE foundation. Small batches, progress reports, and doubt support. Book a free demo."
  />
  <link rel="canonical" href="https://mathsenseacademy.com/" />

  {/* Optional: remove; Google ignores meta keywords */}
  {/* <meta name="keywords" content="online math classes, class 1 to 12, olympiad, jee foundation" /> */}

  <meta name="author" content="MathSense Academy" />
  <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />

  {/* Open Graph */}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="MathSense Academy" />
  <meta property="og:title" content="Online Math Classes for Class 1–12 | Olympiad & JEE Foundation" />
  <meta property="og:description" content="Concept-first math teaching for Class 1–12. Small batches, reports, Olympiad & JEE foundation." />
  <meta property="og:url" content="https://mathsenseacademy.com/" />
  <meta property="og:image" content="https://mathsenseacademy.com/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="en_IN" />

  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Online Math Classes for Class 1–12 | Olympiad & JEE Foundation" />
  <meta name="twitter:description" content="Live online classes, small batches, progress reports. Book a free demo." />
  <meta name="twitter:image" content="https://mathsenseacademy.com/og-image.jpg" />
  {/* Optional handles */}
  {/* <meta name="twitter:site" content="@yourhandle" />
  <meta name="twitter:creator" content="@yourhandle" /> */}

  {/* Structured Data: EducationalOrganization */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "MathSense Academy",
      "url": "https://mathsenseacademy.com/",
      "logo": "https://mathsenseacademy.com/logo.png",
      "sameAs": [
        "https://www.facebook.com/yourpage",
        "https://www.instagram.com/yourpage",
        "https://www.youtube.com/@yourchannel",
        "https://www.linkedin.com/company/yourpage"
      ],
      "areaServed": "IN",
      "contactPoint": [{
        "@type": "ContactPoint",
        "telephone": "+91-9147718572",
        "contactType": "customer support",
        "areaServed": "IN",
        "availableLanguage": ["en", "bn"]
      }]
    })}
  </script>

  {/* Structured Data: WebSite + SearchAction */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "MathSense Academy",
      "url": "https://mathsenseacademy.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://mathsenseacademy.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    })}
  </script>
</Helmet>

      {/* ✅ Content Sections */}
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

      {/* Sentinel for sticky navbar */}
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
