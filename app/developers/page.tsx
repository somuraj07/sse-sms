// app/developers/page.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const developers = [
    {
    name: "Pranavi Reddy ",
    rollNo: "22KF1A0596",
    domain: "Fullstack Developer",
    photo: "/developers/p.jpeg",
  },
  {
    name: "N. Manikanta ",
    rollNo: "23KF1A0591 ",
    domain: "Fullstack Developer",
    photo: "/developers/mani.jpeg",
  },
  {
    name: "T. Bhanu Prakash ",
    rollNo: "23kf1a05c2",
    domain: "Devops Developer",
    photo: "/developers/banu.jpeg",
  },
  {
    name: "M.Durga Prasad Naik ",
    rollNo: "23kf1a0583",
    domain: "Frontend Developer",
    photo: "/developers/durga.jpeg",
  },
  {
    name: "kiran koushik ",
    rollNo: "23kf1a0575",
    domain: "Backend Developer",
    photo: "/developers/koushik.jpeg",
  },
  {
    name: "T Nishanth",
    rollNo: "23kf1a05c2",
    domain: "Frontend Developer",
    photo: "/developers/nishanth.jpeg",
  },
  {
    name: "P Ajay Kumar ",
    rollNo: "22KF1A0598",
    domain: "Frontend Developer",
    photo: "/developers/ajay.jpeg",
  },
  {
    name: "somu kalyankar",
    rollNo: "22KF1A0430",
    domain: "Fullstack Developer",
    photo: "/developers/somu1.jpeg",
  }
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex flex-col items-center py-12 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-purple-700 mb-12"
      >
        Our Developers
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full max-w-6xl">
        {developers.map((dev, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-b from-white to-purple-50 rounded-3xl shadow-xl p-8 flex flex-col items-center border border-purple-200 hover:shadow-2xl transition"
          >
            <motion.div
              whileHover={{ rotate: 3 }}
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg mb-4"
            >
              <Image
                src={dev.photo}
                alt={dev.name}
                width={150}
                height={150}
                className="object-cover w-full h-full"
              />
            </motion.div>

            <h2 className="text-2xl font-semibold text-purple-700">{dev.name}</h2>
            <p className="text-gray-600 mt-1">Roll No: {dev.rollNo}</p>
            <p className="text-purple-500 mt-1 font-medium">{dev.domain}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
