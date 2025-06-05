
'use client';

import React from 'react';
import { FaTwitter, FaTelegramPlane } from 'react-icons/fa';
import { ShieldCheck, BarChart2 } from 'lucide-react'; // Import new icons

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-slate-900/80 backdrop-blur-sm text-gray-400 p-3 mt-auto relative z-[5] flex-shrink-0 border-t border-slate-700">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs space-y-1 md:space-y-0">
            <div className="text-center md:text-left">
              <p>&copy; {currentYear} Blocksmith AI. QuantumGPT.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <ShieldCheck className="h-3 w-3 text-green-500" />
                <span>HTTPS Secured</span>
              </div>
              <div className="flex items-center space-x-1">
                <BarChart2 className="h-3 w-3 text-blue-500" />
                <span>Live Data</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <a href="https://twitter.com/BlockSmithAI" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <FaTwitter size={16} />
              </a>
              <a href="https://t.me/BlockSmithAI" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <FaTelegramPlane size={16} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

    