# 📌 SSE-SMS 
A role-based complaint management system built with **Next.js, TypeScript, React, PostgreSQL, and Prisma**.  
This project is designed for **tracking latecomers, shoe/beard violations, and other hostel/student-related issues**.  
Each student has a **unique QR code** (printed on their ID card). By scanning this QR code, admins can instantly fetch the student’s details and raise complaints.  

## 🚀 Features

- 🔐 **Authentication & Authorization**  
  - Signup & Signin with **role-based access** (Admin, Student).  
  - Protected routes based on user roles.  

- 🎫 **Unique QR Codes**  
  - Each student gets a QR code linked to their profile.  
  - QR scan fetches real-time student details.  

- 📋 **Complaint System**  
  - Admins can raise complaints (latecomers, beard, shoes, etc.).  
  - Complaints linked directly to student profiles.  

- 📊 **Student Profiles**  
  - Store and retrieve complete student information.  
  - Complaints history tracking.  

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)  
- **Backend**: API Routes in Next.js  
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)  
- **Authentication**: JWT / Role-based Access Control  
- **QR Code**: QR generation & scanning for student identification
