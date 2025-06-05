
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Rocket, TestTubeDiagonal, LogIn, Search, Cpu, BarChartBig, BrainCircuit, Network, LineChart as LucideLineChart } from 'lucide-react';
import Image from 'next/image';


export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100 font-body">
      {/* Navigation Bar - Simplified for landing page */}
      <nav className="sticky top-0 z-50 w-full bg-slate-900/50 backdrop-blur-md p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent">
            QuantumGPT
          </Link>
          <div className="space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white" asChild>
              <Link href="/dashboard">Launch App</Link>
            </Button>
             <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-slate-900" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center py-16 md:py-24 px-4 text-center bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg-abstract.png')" }}>
        <div className="container mx-auto max-w-4xl space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-pink-500 animate-pulse">
              Trade Smarter.
            </span>
            <span className="block md:inline"> Analyze Deeper. </span>
            <span className="block md:inline">Act Faster.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-primary to-accent animate-pulse">
              — with QuantumGPT.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-semibold">
            Built by Blocksmith AI. Powered by Deep Learning, Market Research, and Predictive Analytics.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <Button size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300 w-full sm:w-auto group" asChild>
              <Link href="/dashboard">
                <Rocket className="mr-2 h-5 w-5 group-hover:animate-ping" /> Launch QuantumGPT
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-slate-900 shadow-md transform hover:scale-105 transition-transform duration-300 w-full sm:w-auto group" asChild>
              <Link href="/dashboard"> {/* Link to dashboard, demo mode could be a query param or separate route later */}
                <TestTubeDiagonal className="mr-2 h-5 w-5 group-hover:animate-spin" /> Try Demo Mode
              </Link>
            </Button>
            {/* Secure Login button removed as per earlier request to remove login/signup */}
          </div>
        </div>
      </section>

      {/* What QuantumGPT Does (Feature Highlights) */}
      <section id="features" className="py-16 md:py-24 bg-slate-900/70 backdrop-blur-sm px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12 md:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">What QuantumGPT Does</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Card className="bg-slate-800/50 border-slate-700 shadow-xl hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              <CardHeader className="items-center text-center">
                <div className="p-3 bg-primary/20 rounded-full mb-3">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl text-gray-100">Deep Market Scanning</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-center">
                <p>Trained on terabytes of market and macroeconomic data.</p>
                <p>Detects hidden patterns and trends in real time.</p>
                <p>Uses multi-layered neural inference to model behavior.</p>
                <Image src="https://placehold.co/600x400.png" alt="Market Scanning Visualization" width={600} height={400} className="mt-4 rounded-lg shadow-md" data-ai-hint="abstract data" />
              </CardContent>
            </Card>
            {/* Card 2 */}
            <Card className="bg-slate-800/50 border-slate-700 shadow-xl hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              <CardHeader className="items-center text-center">
                <div className="p-3 bg-accent/20 rounded-full mb-3">
                  <Cpu className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="font-headline text-2xl text-gray-100">Tailored Trading Strategies</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-center">
                <p>Adaptive strategy generator using Reinforcement Learning (RL) concepts.</p>
                <p>Backtested against historical and synthetic data constructs.</p>
                <p>Personalized suggestions (future feature).</p>
                 <Image src="https://placehold.co/600x400.png" alt="Trading Strategy Visualization" width={600} height={400} className="mt-4 rounded-lg shadow-md" data-ai-hint="futuristic graph" />
              </CardContent>
            </Card>
            {/* Card 3 */}
            <Card className="bg-slate-800/50 border-slate-700 shadow-xl hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              <CardHeader className="items-center text-center">
                <div className="p-3 bg-pink-500/20 rounded-full mb-3">
                  <BarChartBig className="h-8 w-8 text-pink-400" />
                </div>
                <CardTitle className="font-headline text-2xl text-gray-100">Advanced Data Visualization</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-center">
                <p>Real-time interactive charts and insight summaries.</p>
                <p>Predictive sentiment overlays (conceptual).</p>
                <p>Strategy confidence scores with visual heatmaps (conceptual).</p>
                 <Image src="https://placehold.co/600x400.png" alt="Data Visualization Example" width={600} height={400} className="mt-4 rounded-lg shadow-md" data-ai-hint="data dashboard" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Behind the Intelligence */}
      <section id="technology" className="py-16 md:py-24 bg-slate-900 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12 md:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Tech Behind The Intelligence</h2>
          <Card className="bg-slate-800/60 border-slate-700 p-6 md:p-10 shadow-2xl">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="font-headline text-2xl md:text-3xl text-gray-100 flex items-center gap-2">
                <BrainCircuit className="h-8 w-8 text-accent" />
                Blocksmith AI R&amp;D Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-gray-300 mb-8 text-base md:text-lg leading-relaxed">
                QuantumGPT isn&apos;t just another trading tool — it’s a research-grade intelligence system crafted through months of dedicated blockchain modeling, market psychology analysis, and financial AI simulation.
              </p>
              <h3 className="font-semibold text-xl text-gray-200 mb-4">Key Technologies:</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <Cpu className="h-5 w-5 text-accent mr-3 mt-1 shrink-0" />
                  <span><span className="font-semibold text-gray-100">Transformer-based AI models</span> for financial NLP.</span>
                </li>
                <li className="flex items-start">
                  <LucideLineChart className="h-5 w-5 text-accent mr-3 mt-1 shrink-0" />
                  <span><span className="font-semibold text-gray-100">Predictive LSTM network concepts</span> for price/time series modeling.</span>
                </li>
                <li className="flex items-start">
                  <Network className="h-5 w-5 text-accent mr-3 mt-1 shrink-0" />
                  <span><span className="font-semibold text-gray-100">Cross-chain signal feeds</span> and on-chain/off-chain oracles (conceptual).</span>
                </li>
                <li className="flex items-start">
                  <BarChartBig className="h-5 w-5 text-accent mr-3 mt-1 shrink-0" />
                  <span><span className="font-semibold text-gray-100">TradingView & Recharts</span> for real-time visualization.</span>
                </li>
                {/* Secure model isolation - more of a backend/infra detail, might be too technical for general audience here
                <li className="flex items-start">
                  <Shield className="h-5 w-5 text-accent mr-3 mt-1 shrink-0" />
                  <span><span className="font-semibold text-gray-100">Secure model isolation</span> for private strategy execution.</span>
                </li>
                */}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

    