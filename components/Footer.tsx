"use client";

import {
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  User,
} from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

const Footer: React.FC = () => {
  const router = useRouter();

  interface SocialLink {
    icon: React.ComponentType<{ className?: string }>;
    url: string;
  }

  const socialLinks: SocialLink[] = [
    { icon: Instagram, url: "https://www.instagram.com/sanskrithigroup_ptp/?hl=en" },
    { icon: Facebook, url: "https://www.facebook.com/sseptp/" },
    { icon: Twitter, url: "https://x.com/SanskrithiGroup" },
    { icon: Linkedin, url: "https://www.linkedin.com/in/sgiputtaparthi/" },
  ];

  return (
    <footer className="bg-gradient-to-br from-white to-purple-200 text-[#1f1f1f] mt-20 rounded-t-3xl shadow-lg overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-4">
            Sanskrithi Group of Institutions
          </h2>
          <p className="text-lg text-gray-800 max-w-3xl mx-auto">
            Empowering future engineers with knowledge, skills, and values since 2010.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex flex-col md:flex-row md:justify-between gap-8 text-base">
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <MapPin className="w-6 h-6 mb-2 text-purple-600" />
              <span>
                Beedupalli Knowledgepark, Behind SSSIHMS, Puttaparthi,
                <br />
                Sri Sathya Sai District, AP - 515134
              </span>
            </div>

            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <Mail className="w-6 h-6 mb-2 text-purple-600" />
              <span>enquiry@sseptp.org</span>
            </div>
          </div>
        </div>

        {/* Project Makers / Developers Link */}
        <div className="flex flex-col items-center mt-12 gap-3">
          <span
            onClick={() => router.push("/developers")}
            className="flex items-center gap-2 text-purple-600 font-semibold cursor-pointer hover:underline text-lg"
          >
            <User className="w-5 h-5" />
            Project Makers
          </span>
        </div>

        {/* Social Media */}
        <div className="text-center mt-8">
          <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Connect With Us
          </h3>
          <div className="flex justify-center gap-4">
            {socialLinks.map(({ icon: Icon, url }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-100 hover:bg-purple-200 transition rounded-full p-3"
                aria-label={`Social link ${i}`}
              >
                <Icon className="w-6 h-6 text-purple-600" />
              </a>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="border-t border-purple-300 pt-6 text-center mt-12">
          <p className="text-gray-800 text-lg mb-2">
            For any queries or information, please contact the respective departments.
          </p>
          <p className="text-sm text-gray-700">
            © {new Date().getFullYear()} Sanskrithi Group of Institutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
