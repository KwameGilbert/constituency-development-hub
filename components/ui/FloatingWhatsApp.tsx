"use client";

import React from "react";
import clsx from "clsx";
import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
  phoneNumber: string;
  message?: string;
  className?: string; // Add className prop
}

const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber,
  message = "Hello! I would like to get in touch.",
  className,
}) => {
  const handleClick = () => {
    // Format number: remove + and spaces, ensure it has country code if needed or just use as is if local format works for user
    // User provided 0247730625. For international format it should likely be 233247730625
    // Converting local Ghana number to international format:
    // Remove leading '0', prepend '233'
    let formattedNumber = phoneNumber.replace(/\D/g, ""); // strip non-digits
    if (formattedNumber.startsWith("0")) {
      formattedNumber = "233" + formattedNumber.substring(1);
    }

    const url = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "fixed bottom-6 right-6 z-50 flex items-center justify-center p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2",
        className,
      )}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={32} />
    </button>
  );
};

export default FloatingWhatsApp;
