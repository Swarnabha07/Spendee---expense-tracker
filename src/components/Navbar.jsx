import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-950 text-white">
        <div className="flex justify-center items-center gap-3 py-2">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide text-white drop-shadow-sm transition-all duration-300 hover:scale-105">Spendee</h1>
        <span className="material-symbols-outlined mt-1.5 transition-transform duration-300 hover:rotate-12">money_bag</span>
        </div>
    </nav>
  );
};

export default Navbar;