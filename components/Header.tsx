import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-purple-100 shadow-sm sticky top-0 z-50 transition-all">
      <div className="max-w-4xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-700 p-1.5 md:p-2 rounded-lg text-white shadow-sm">
            <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-black leading-tight">Fake Checker By Radid</h1>
            <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-none">AI Fact & Fake Detector</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;