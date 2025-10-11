import React, { useEffect, useState } from "react";
import { createBooking } from "../../services/bookingService";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { CheckCircle, XCircle, AlertCircle, Download } from "lucide-react";

const PaymentPage = () => {
  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    paymentMethod: "",
  });
  const [paymentDone, setPaymentDone] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const startHour = i % 12 === 0 ? 12 : i % 12;
    const endHour = (i + 1) % 12 === 0 ? 12 : (i + 1) % 12;
    const startPeriod = i < 12 ? "AM" : "PM";
    const endPeriod = i + 1 < 12 ? "AM" : "PM";
    return `${startHour} ${startPeriod} - ${endHour} ${endPeriod}`;
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("pendingBooking"));
    if (data) setBooking(data);
  }, []);

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: "", message: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.paymentMethod) {
      showPopup("error", "Please fill all fields before proceeding.");
      return;
    }
    if (!booking) {
      showPopup("error", "No booking found. Please select a slot again.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        paymentMethod: formData.paymentMethod,
        paymentStatus: "Paid",
        ...booking,
      };

      const res = await createBooking(payload);
      if (res.success) {
        setPaymentDone(true);
        showPopup("success", "Payment successful and booking confirmed!");
        localStorage.removeItem("pendingBooking");
      } else {
        showPopup("error", "Booking failed. Try again later.");
      }
    } catch (error) {
      console.error(error);
      showPopup("error", "Error creating booking. Check console for details.");
    }
  };

  const generatePDF = async () => {
    try {
      console.log("Starting PDF generation...");
      
      if (!booking) {
        showPopup("error", "No booking data available!");
        return;
      }

      if (!formData.name || !formData.email) {
        showPopup("error", "User information missing!");
        return;
      }

      console.log("Creating PDF document...");
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 750]);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const { name, email } = formData;
      const { court, slots, date, month, year } = booking;
      
      const sortedSlots = [...slots].sort((a, b) => a - b);
      const groupedSlots = [];
      let currentGroup = [sortedSlots[0]];

      for (let i = 1; i < sortedSlots.length; i++) {
        if (sortedSlots[i] === sortedSlots[i - 1] + 1) {
          currentGroup.push(sortedSlots[i]);
        } else {
          groupedSlots.push(currentGroup);
          currentGroup = [sortedSlots[i]];
        }
      }
      groupedSlots.push(currentGroup);

      const bookedTimeSlots = groupedSlots.map(group => {
        const firstSlot = group[0];
        const lastSlot = group[group.length - 1];
        const [startTime] = timeSlots[firstSlot].split(" - ");
        const [, endTime] = timeSlots[lastSlot].split(" - ");
        return `${startTime} - ${endTime}`;
      });

      console.log("Drawing PDF design...");
      
      page.drawText("BOOKING CONFIRMATION", {
        x: 50,
        y: 700,
        size: 24,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      page.drawLine({
        start: { x: 50, y: 690 },
        end: { x: 550, y: 690 },
        thickness: 2,
        color: rgb(1, 0.4, 0),
      });

      page.drawText("Status: CONFIRMED", {
        x: 50,
        y: 660,
        size: 14,
        font: fontBold,
        color: rgb(0, 0.6, 0),
      });

      let yPos = 620;

      page.drawText("Customer Details", {
        x: 50,
        y: yPos,
        size: 16,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      yPos -= 30;
      page.drawText("Name:", {
        x: 70,
        y: yPos,
        size: 12,
        font: fontBold,
        color: rgb(0.4, 0.4, 0.4),
      });
      page.drawText(name, {
        x: 200,
        y: yPos,
        size: 12,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });

      yPos -= 25;
      page.drawText("Email:", {
        x: 70,
        y: yPos,
        size: 12,
        font: fontBold,
        color: rgb(0.4, 0.4, 0.4),
      });
      page.drawText(email, {
        x: 200,
        y: yPos,
        size: 12,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });

      yPos -= 25;
      page.drawText("Payment Method:", {
        x: 70,
        y: yPos,
        size: 12,
        font: fontBold,
        color: rgb(0.4, 0.4, 0.4),
      });
      page.drawText(formData.paymentMethod, {
        x: 200,
        y: yPos,
        size: 12,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });

      yPos -= 25;
      page.drawText("Payment Status:", {
        x: 70,
        y: yPos,
        size: 12,
        font: fontBold,
        color: rgb(0.4, 0.4, 0.4),
      });
      page.drawText("Paid", {
        x: 200,
        y: yPos,
        size: 12,
        font: fontRegular,
        color: rgb(0, 0.6, 0),
      });

      yPos -= 50;
      page.drawText("Booking Details", {
        x: 50,
        y: yPos,
        size: 16,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      yPos -= 30;
      page.drawText("Court:", {
        x: 70,
        y: yPos,
        size: 12,
        font: fontBold,
        color: rgb(0.4, 0.4, 0.4),
      });
      page.drawText(court || "Cricket", {
        x: 200,
        y: yPos,
        size: 12,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });

      yPos -= 25;
      page.drawText("Date:", {
        x: 70,
        y: yPos,
        size: 12,
        font: fontBold,
        color: rgb(0.4, 0.4, 0.4),
      });
      page.drawText(`${date}-${month + 1}-${year}`, {
        x: 200,
        y: yPos,
        size: 12,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });

      yPos -= 25;
      page.drawText("Booked Time Slots:", {
        x: 70,
        y: yPos,
        size: 12,
        font: fontBold,
        color: rgb(0.4, 0.4, 0.4),
      });

      yPos -= 22;
      bookedTimeSlots.forEach((slot, index) => {
        page.drawText(`${index + 1}. ${slot}`, {
          x: 90,
          y: yPos,
          size: 11,
          font: fontRegular,
          color: rgb(0, 0, 0),
        });
        yPos -= 20;
      });

      page.drawLine({
        start: { x: 50, y: 100 },
        end: { x: 550, y: 100 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });

      page.drawText("Thank you for booking with Indoor Arena!", {
        x: 150,
        y: 70,
        size: 12,
        font: fontRegular,
        color: rgb(0.5, 0.5, 0.5),
      });

      page.drawText("For support: info@indoorarena.com", {
        x: 180,
        y: 50,
        size: 10,
        font: fontRegular,
        color: rgb(0.6, 0.6, 0.6),
      });

      console.log("Saving PDF...");
      const pdfBytes = await pdfDoc.save();
      
      console.log("Creating blob and download link...");
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `BookingConfirmation_${Date.now()}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      console.log("PDF downloaded successfully!");
      showPopup("success", "PDF downloaded successfully!");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      showPopup("error", `Failed to generate PDF: ${error.message}`);
    }
  };

  const PopupMessage = () => {
    if (!popup.show) return null;

    const getPopupStyles = () => {
      switch (popup.type) {
        case "success":
          return {
            bg: "bg-gradient-to-r from-green-500 to-emerald-500",
            icon: <CheckCircle className="w-6 h-6" />,
          };
        case "error":
          return {
            bg: "bg-gradient-to-r from-red-500 to-rose-500",
            icon: <XCircle className="w-6 h-6" />,
          };
        default:
          return {
            bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
            icon: <AlertCircle className="w-6 h-6" />,
          };
      }
    };

    const styles = getPopupStyles();

    return (
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
        <div
          className={`${styles.bg} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px] max-w-md`}
        >
          {styles.icon}
          <p className="font-medium text-sm">{popup.message}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-[#1e9797] px-6 py-10">
      <PopupMessage />
      
      <h1 className="text-3xl font-bold mb-8">Payment Page</h1>

      {booking ? (
        <div className="bg-[#1e9797]/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
          {!paymentDone ? (
            <>
              <p className="text-center text-lg mb-2">
                You're booking for{" "}
                <span className="font-semibold text-orange-400">
                  {booking.court || "Cricket"} Court
                </span>
              </p>

              <p className="text-center text-lg mb-4">
                Booking {booking.slots.length} slot(s) for{" "}
                <span className="font-semibold text-orange-400">
                  {booking.date}-{booking.month + 1}-{booking.year}
                </span>
              </p>

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

              <div className="space-y-5">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#1e9797]/30 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#1e9797]/30 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#1e9797]/30 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select a payment method</option>
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                </select>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-[#1a6868] to-[#89cfcf] text-white font-bold py-2 rounded-lg hover:opacity-90 transition duration-300"
                >
                  Confirm Payment
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl text-[#1e9797] font-bold mb-4">
                Payment Successful!
              </h2>
              <p className="text-gray-800 mb-6">
                Your booking has been confirmed successfully.
              </p>
              <button
                onClick={generatePDF}
                className="bg-gradient-to-r from-[#1a6868] to-[#9de9e9] text-white font-bold px-6 py-2 rounded-lg hover:opacity-90 transition duration-300 flex items-center gap-2 mx-auto"
              >
                <Download className="w-5 h-5" />
                Download Booking PDF
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-400">No pending booking found.</p>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -100%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;