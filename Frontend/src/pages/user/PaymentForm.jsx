// // PaymentPage.jsx
// import React, { useEffect, useState } from "react";

// const PaymentPage = () => {
//   const [booking, setBooking] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     paymentMethod: "",
//   });

//   // ✅ Time slots (24-hour format converted to 12-hour with AM/PM)
//   const timeSlots = Array.from({ length: 24 }, (_, i) => {
//     const startHour = i % 12 === 0 ? 12 : i % 12;
//     const endHour = (i + 1) % 12 === 0 ? 12 : (i + 1) % 12;
//     const startPeriod = i < 12 ? "AM" : "PM";
//     const endPeriod = i + 1 < 12 ? "AM" : "PM";
//     return `${startHour} ${startPeriod} - ${endHour} ${endPeriod}`;
//   });

//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("pendingBooking"));
//     setBooking(data);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.email || !formData.paymentMethod) {
//       alert("Please fill all fields before proceeding.");
//       return;
//     }

//     console.log("Payment submitted:", formData);
//     alert("Payment successful! Thank you for your booking.");
//     localStorage.removeItem("pendingBooking");
//   };

//   return (
//     <div
//       id="payment-method"
//       className="min-h-screen flex flex-col items-center justify-center text-white bg-black px-6 py-10 mt-15"
//     >
//       <h1 className="text-3xl font-bold mb-8">Payment Page</h1>

//       {booking ? (
//         <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
//           {/* ✅ Booking Summary */}
//           <p className="text-center text-lg mb-2">
//             You’re booking for{" "}
//             <span className="font-semibold text-orange-400">
//               {booking.court ? booking.court : "Cricket"} Court
//             </span>
//           </p>

//           <p className="text-center text-lg mb-4">
//             You are booking{" "}
//             <span className="font-semibold text-orange-400">
//               {booking.slots.length}
//             </span>{" "}
//             slot(s) for{" "}
//             <span className="font-semibold text-orange-400">
//               {booking.date}-{booking.month + 1}-{booking.year}
//             </span>
//           </p>

//           {/* ✅ Display Time Range */}
//           {(() => {
//             const sortedSlots = [...booking.slots].sort((a, b) => a - b);
//             const firstSlot = sortedSlots[0];
//             const lastSlot = sortedSlots[sortedSlots.length - 1];

//             const [startTime] = timeSlots[firstSlot].split(" - ");
//             const [, endTime] = timeSlots[lastSlot].split(" - ");

//             return (
//               <p className="text-center text-orange-400 font-semibold mb-6">
//                 Booked from {startTime} to {endTime}
//               </p>
//             );
//           })()}

//           {/* ✅ Payment Form */}
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Name Field */}
//             <div>
//               <label className="block mb-2 text-gray-300">Full Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Enter your name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />
//             </div>

//             {/* Email Field */}
//             <div>
//               <label className="block mb-2 text-gray-300">Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
//               />
//             </div>

//             {/* Payment Method */}
//             <div>
//               <label className="block mb-2 text-gray-300">Payment Method</label>
//               <select
//                 name="paymentMethod"
//                 value={formData.paymentMethod}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
//               >
//                 <option value="">Select a payment method</option>
//                 <option value="Cash">Cash</option>
//                 <option value="Online">Online</option>
//               </select>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-2 rounded-lg font-semibold hover:opacity-90 transition duration-300"
//             >
//               Confirm Payment
//             </button>
//           </form>
//         </div>
//       ) : (
//         <p className="text-gray-400">No pending booking found.</p>
//       )}
//     </div>
//   );
// };

// export default PaymentPage;


// src/pages/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { createBooking } from "../../services/bookingService"; // ✅ use your backend API
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    paymentMethod: "",
  });

  const navigate = useNavigate();

  // ✅ Generate time slots
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const startHour = i % 12 === 0 ? 12 : i % 12;
    const endHour = (i + 1) % 12 === 0 ? 12 : (i + 1) % 12;
    const startPeriod = i < 12 ? "AM" : "PM";
    const endPeriod = i + 1 < 12 ? "AM" : "PM";
    return `${startHour} ${startPeriod} - ${endHour} ${endPeriod}`;
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("pendingBooking"));
    if (!data) return;
    setBooking(data);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.paymentMethod) {
      alert("Please fill all fields before proceeding.");
      return;
    }

    if (!booking) {
      alert("No booking found. Please select a slot again.");
      return;
    }

    try {
      // ✅ Create booking with backend API
      const payload = {
        name: formData.name,
        email: formData.email,
        paymentMethod: formData.paymentMethod,
        ...booking, // includes date, slots, court, etc.
      };

      const res = await createBooking(payload);

      if (res.success) {
        alert("✅ Payment successful and booking confirmed!");
        localStorage.removeItem("pendingBooking");
        navigate("/booking-success");
      } else {
        alert("⚠️ Booking failed. Try again later.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error creating booking. Check console for details.");
    }
  };

  return (
    <div
      id="payment-method"
      className="min-h-screen flex flex-col items-center justify-center text-white bg-black px-6 py-10"
    >
      <h1 className="text-3xl font-bold mb-8">Payment Page</h1>

      {booking ? (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <p className="text-center text-lg mb-2">
            You’re booking for{" "}
            <span className="font-semibold text-orange-400">
              {booking.court || "Cricket"} Court
            </span>
          </p>

          <p className="text-center text-lg mb-4">
            You are booking{" "}
            <span className="font-semibold text-orange-400">
              {booking.slots.length}
            </span>{" "}
            slot(s) for{" "}
            <span className="font-semibold text-orange-400">
              {booking.date}-{booking.month + 1}-{booking.year}
            </span>
          </p>

          {/* ✅ Display Time Range */}
          {(() => {
            const sortedSlots = [...booking.slots].sort((a, b) => a - b);
            const firstSlot = sortedSlots[0];
            const lastSlot = sortedSlots[sortedSlots.length - 1];

            const [startTime] = timeSlots[firstSlot].split(" - ");
            const [, endTime] = timeSlots[lastSlot].split(" - ");

            return (
              <p className="text-center text-orange-400 font-semibold mb-6">
                Booked from {startTime} to {endTime}
              </p>
            );
          })()}

          {/* ✅ Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select a payment method</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-2 rounded-lg font-semibold hover:opacity-90 transition duration-300"
            >
              Confirm Payment
            </button>
          </form>
        </div>
      ) : (
        <p className="text-gray-400">No pending booking found.</p>
      )}
    </div>
  );
};

export default PaymentPage;
