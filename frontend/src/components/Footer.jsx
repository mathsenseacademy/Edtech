import React from "react";
import { Link } from "react-router-dom";
import brand1 from "../assets/imo.png";
import brand2 from "../assets/kangaroo.png";
import brand3 from "../assets/vvm.png";
import brand4 from "../assets/silver.png";
import logo from "../assets/logoWith_Name.svg";

export default function Footer() {
  return (
    <footer className="font-poppins text-[#1a1a1a] bg-gradient-to-r bg-gray-800">
      {/* ── Brand Collabs ── */}
      <div className="flex flex-wrap justify-center gap-8 px-6 pt-6">
        {[brand1, brand2, brand3, brand4].map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Brand ${i + 1}`}
            className="max-h-24 object-contain opacity-80 hover:opacity-100 transition mb-4"
          />
        ))}
      </div>

      {/* ── Main Footer ── */}
      <div className="bg-gradient-to-r bg-gray-800 text-white">
        <div className="flex flex-wrap justify-between gap-8 px-6 py-12">
          {/* Newsletter */}
          <div className="flex-1 min-w-[300px] max-w-[400px]">
            <img src={logo} alt="Math Senseacademy" className="max-w-[180px] mb-4" />
            <p className="mb-4 text-base">
              Stay in the loop and sign up for the Wardiere newsletter:
            </p>
            <form className="flex relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-black/20 outline-none"
              />
              <button
                type="submit"
                className="w-12 h-12 flex items-center justify-center bg-[#1a0a40] text-white rounded-full -ml-12 hover:bg-[#2a1a60] transition"
              >
                →
              </button>
            </form>
          </div>

          {/* Links */}
          <div className="flex-2 flex flex-wrap justify-between gap-8 min-w-[300px]">
            {/* Company */}
            <div className="flex-1 min-w-[150px]">
              <h4 className="text-lg font-semibold mb-3 text-yellow-200 hover:text-amber-400">Company</h4>
              <ul className="space-y-2 text-white">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/about" className="footer-link">About</Link></li>
                <li><Link to="/solutions" className="footer-link">Solutions</Link></li>
                <li><Link to="/pricing" className="footer-link">Pricing</Link></li>
                <li><Link to="/team" className="footer-link">Team</Link></li>
                <li><Link to="/career" className="footer-link">Career</Link></li>
              </ul>
            </div>

            {/* Documentation */}
            <div className="flex-1 min-w-[150px]">
              <h4 className="text-lg font-semibold mb-3 text-yellow-200 hover:text-amber-400">Documentation</h4>
              <ul className="space-y-2 text-white">
                <li><Link to="/help" className="footer-link">Help Centre</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
                <li><Link to="/faq" className="footer-link">FAQ</Link></li>
                <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Social */}
            <div className="flex-1 min-w-[150px]">
              <h4 className="text-lg font-semibold mb-3 text-yellow-200 hover:text-amber-400">Social</h4>
              <ul className="space-y-2 text-white">
                <li><a href="https://www.facebook.com/shomesirmath/" className="footer-link">Facebook</a></li>
                <li><a href="https://www.instagram.com/maths_ense/" className="footer-link">Instagram</a></li>
                <li><a href="https://www.youtube.com/@mathsenseacademy" className="footer-link">YouTube</a></li>
                <li><a href="https://x.com/ShomeSuvad79678/" className="footer-link">Twitter</a></li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Footer Bottom */}
        <div className="flex flex-wrap justify-between items-center px-6 py-4 text-sm font-semibold">
          <span className="opacity-70">
            ©MathSenseAcademy. All Rights Reserved {new Date().getFullYear()}
          </span>
          <Link to="/terms" className="footer-link text-white">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  );
}

/* Tailwind helper for animated links */
const footerLink =
  "relative inline-block text-[#1a1a1a] no-underline pb-0.5 transition hover:text-pink-600 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-pink-600 hover:after:w-full after:transition-all after:duration-300";
