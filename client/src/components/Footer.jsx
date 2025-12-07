import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-linear-to-br from-gray-900 via-gray-800 to-black text-gray-300 border-t border-gray-700 ">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-primary font-bold text-white">
            E-commerce
          </h2>
          <p className="font-primary text-sm mt-2 text-gray-400 leading-relaxed">
            Creating modern web experiences with performance, accessibility, and
            style.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-white text-lg">Quick Links</h3>
          <ul className="space-y-2 mt-3 text-sm">
            {["Home", "About", "Services", "Contact"].map((item, i) => (
              <li key={i}>
                <a
                  href="#"
                  className="relative inline-block hover:text-primary-200 transition duration-300 group"
                >
                  {item}
                  <span className="block h-0.5 w-0 bg-primary-200 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-white text-lg">Follow Us</h3>
          <div className="flex items-center space-x-5 mt-4 text-2xl">
            {[
              { icon: <FaFacebook />, color: "#1877F2" },
              { icon: <FaInstagram />, color: "#E4405F" },
              { icon: <FaLinkedin />, color: "#0077B5" },
              { icon: <FaGithub />, color: "#F5F5F5" },
            ].map((item, i) => (
              <a
                key={i}
                href="#"
                target="_blank"
                className="transition-transform duration-300 hover:scale-125"
                style={{ color: item.color }}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="border-t border-gray-700 py-5 text-center text-sm text-gray-400">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-primary-200">E-commerce</span> — All
        Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
