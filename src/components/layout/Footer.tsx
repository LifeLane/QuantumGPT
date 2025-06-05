
'use client';

import React from 'react';
import { FaTwitter, FaTelegramPlane, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DisclaimerModal } from '@/components/features/DisclaimerModal'; // Ensure correct import path
import { ShieldCheck, MessageSquare, BookOpen, Mail, BarChart2, ListChecks, Bell, LineChart as LucideLineChart, Bot } from 'lucide-react'; // Added Bot

const Footer: React.FC = () => {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = React.useState(false);

  return (
    <>
      <footer className="bg-slate-900 text-gray-400 p-6 md:p-8 mt-auto">
        <div className="container mx-auto">
          {/* Navigation Links & Quick Access */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-headline text-lg text-gray-200 mb-3">QuantumGPT</h5>
              <p className="text-sm mb-3">AI-powered crypto analysis and strategy. Built by Blocksmith AI.</p>
               <Button variant="link" className="text-accent p-0 h-auto hover:underline" asChild>
                  <Link href="/dashboard">Launch App</Link>
                </Button>
            </div>
            <div>
              <h5 className="font-semibold text-gray-200 mb-3">Core Features</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/strategy" className="hover:text-accent transition-colors flex items-center gap-2"><Bot size={16}/> AI Trading Strategy</Link></li>
                <li><Link href="/watchlist" className="hover:text-accent transition-colors flex items-center gap-2"><ListChecks size={16}/> Watchlist</Link></li>
                <li><Link href="/alerts" className="hover:text-accent transition-colors flex items-center gap-2"><Bell size={16}/> Price Alerts</Link></li>
                <li><Link href="/charting" className="hover:text-accent transition-colors flex items-center gap-2"><LucideLineChart size={16}/> Charting Tools</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-200 mb-3">Need Help?</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-accent transition-colors flex items-center gap-2"><MessageSquare size={16}/> Chat with Support (Soon)</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors flex items-center gap-2"><BookOpen size={16}/> Knowledge Base (Soon)</Link></li>
                <li><Link href="mailto:support@blocksmithai.com" className="hover:text-accent transition-colors flex items-center gap-2"><Mail size={16}/> Contact QuantumHQ</Link></li>
              </ul>
            </div>
             <div>
              <h5 className="font-semibold text-gray-200 mb-3">Trust &amp; Security</h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> Secured by HTTPS Encryption</li>
                <li className="flex items-center gap-2"><BarChart2 size={16} className="text-blue-400"/> Connected to Live Data Feeds</li>
                {/* Add other signals like "Audited model logic by BlocksmithAI Labs" when appropriate */}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-center md:text-left mb-4 md:mb-0">
                <p>&copy; {new Date().getFullYear()} Blocksmith AI. All rights reserved.</p>
                <p className="mt-1">
                  QuantumGPT is an AI-based research tool for educational use. Not financial advice. Trade responsibly.
                  <Button variant="link" onClick={() => setIsDisclaimerOpen(true)} className="text-accent p-0 h-auto ml-1 hover:underline">
                    View Full Disclaimer
                  </Button>
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="https://twitter.com/BlockSmithAI" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <FaTwitter size={22} />
                </a>
                <a href="https://t.me/BlockSmithAI" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <FaTelegramPlane size={22} />
                </a>
                <a href="https://www.youtube.com/@BlockSmithAI" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                  <FaYoutube size={22} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <DisclaimerModal isOpen={isDisclaimerOpen} onOpenChange={setIsDisclaimerOpen} />
    </>
  );
};

export default Footer;

    