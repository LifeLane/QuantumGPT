import React from 'react';
import { FaTwitter, FaTelegramPlane, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-8">
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} BlockSmithAI. All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          <a href="https://twitter.com/BlockSmithAI" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <FaTwitter size={24} />
          </a>
          <a href="https://t.me/BlockSmithAI" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            <FaTelegramPlane size={24} />
          </a>
          <a href="https://www.youtube.com/BlockSmithAI" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
            <FaYoutube size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;