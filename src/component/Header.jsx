import React from 'react';

export default function Header() {
  return (
    <header className="dark:bg-gray-900 shadow-md px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src="\src\assets\Scheme_image1.png" // Replace with actual logo path
          alt="Bihar Scheme Logo"
          className="h-12 w-auto rounded-full"
        />
        <span className="font-bold text-xl text-gray-100">Bihar Udyami Schemes</span>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className="flex space-x-6 text-gray-400 font-medium">
          <li><a href="#vision" className=" hover:text-white">Vision</a></li>
          <li><a href="#facilities" className="hover:text-white">Facilities</a></li>
          <li><a href="#work" className="hover:text-white">Work with Us</a></li>
          <li><a href="#contact" className="hover:text-white">Contact Us</a></li>
          <li><a href="#about" className="hover:text-white">About Us</a></li>
        </ul>
      </nav>
    </header>
  );
}
