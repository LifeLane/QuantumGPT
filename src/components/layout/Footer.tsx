
'use client';

import React from 'react';
import { FaTwitter, FaTelegramPlane } from 'react-icons/fa';
import { ShieldCheck, BarChart2 } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-slate-900 text-gray-400 p-4 mt-auto relative z-[5] flex-shrink-0">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="text-center md:text-left mb-2 md:mb-0">
              <p>&copy; {currentYear} Blocksmith AI. QuantumGPT.</p>
            </div>
            <div className="flex items-center space-x-4 my-2 md:my-0">
              <div className="flex items-center space-x-2 text-xs">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>Secured by HTTPS Encryption</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <BarChart2 className="h-4 w-4 text-blue-500" />
                <span>Connected to Live Data Feeds</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="https://twitter.com/BlockSmithAI" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://t.me/BlockSmithAI" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <FaTelegramPlane size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
