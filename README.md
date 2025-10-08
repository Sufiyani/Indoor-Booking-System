# 🏏 Indoor Booking System (MERN Stack)

A **Full-Stack MERN Web Application** that streamlines indoor sports bookings.  
Users can explore and book available time slots for **Cricket**, **Futsal**, and **Padel**, while admins can manage slots, bookings, and payments — all in one unified system.

---

## 🚀 Features

### 👥 User Panel
- View available **Cricket**, **Futsal**, and **Padel** grounds.
- Browse **dates and time slots** using an interactive calendar.
- **Book slots** and proceed to a **secure payment** page.
- Redirected to a **confirmation page** after payment.
- Download a **PDF receipt** of the booking confirmation.

### 🛠️ Admin Panel
- View all bookings across all sports.
- Filter bookings by **date**.
- **Add, edit, or cancel** available slots.
- Manage all booking and user data efficiently.

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| PDF Generation | jsPDF |
| Architecture | Monolithic MERN Stack |

---

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/indoor-booking-system.git
   cd indoor-booking-system
   
Install dependencies
```bash
npm install
   ```bash

Add environment variables
Create a .env file in the root directory:

MONGO_URI=your_mongodb_connection_string
PORT=5000

Start the development server
npm run dev

Frontend: http://localhost:3000

Backend: http://localhost:5000

🗄️ Database Overview

users → Stores user information

admins → Stores admin credentials

bookings → Stores booking details

slots → Manages available time slots for each ground

📄 PDF Booking Confirmation

Each successful booking automatically generates a PDF receipt including:

User details

Selected ground

Booking date and time

Payment confirmation

👨‍💻 Author

Sufiyan Imran
Full-Stack Web Developer | MERN Stack
📧 Email: sufiyanimran55@gmail.com

🐙 GitHub: sufiyanimran

💼 LinkedIn: sufiyanimran

🏁 Summary

The Indoor Booking System is a fully functional, database-driven MERN Stack web app built with a monolithic architecture.
It provides a seamless experience for users to book indoor sports facilities and for admins to manage bookings, payments, and availability — all in one place.
