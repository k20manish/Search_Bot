import React from 'react';

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 ">
      <div className="max-w-screen-xl mx-auto px-4 py-6 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} <a href="https://flowbite.com/" className="hover:underline font-semibold">Flowbite™</a>. All rights reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-4 md:mt-0 text-sm font-medium text-gray-500 dark:text-gray-400">
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">About</a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
          </li>
          <li>
            <a href="#" className="hover:underline">Contact</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
