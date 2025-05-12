
import React from 'react';
import { Sparkles } from "lucide-react";

const Header = () => {
  return (
    <div className="w-full bg-gradient-to-r from-restaurant-green to-restaurant-green/90 text-white p-4 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-all duration-300 border border-restaurant-green/10 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHYtMmg0di00aC0ydi00aDJ2LTJjMC0xLjEtLjktMi0yLTJoLTRjLTEuMSAwLTIgLjktMiAydjJoMnY0aC0ydjJoNHYyaC00djJoMnY0aC0ydjJjMCAxLjEuOSAyIDIgMmg0YzEuMSAwIDItLjkgMi0ydi0yem0xNi0xNnYtMmgtNHY4aDJ2LTZoMnptLTIgMTB2LTJoMnYtMmgtNHY2aDJ6TTM0IDI4di0yaC00djJoNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
      <div className="container mx-auto relative z-10">
        <div className="relative">
          <Sparkles className="absolute -left-1 top-1 text-yellow-300/70 h-5 w-5 animate-pulse" />
          <h1 className="text-3xl md:text-4xl font-bold text-center font-poppins relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-white to-restaurant-cream tracking-wide hover:scale-[1.01] transition-transform duration-300">
            AARKAY VAISHNO DHABA
          </h1>
          <Sparkles className="absolute -right-1 top-1 text-yellow-300/70 h-5 w-5 animate-pulse" style={{animationDelay: "1s"}} />
        </div>
        <p className="text-center text-sm md:text-base opacity-90 font-poppins mt-1">Restaurant Billing System</p>
      </div>
    </div>
  );
};

export default Header;
