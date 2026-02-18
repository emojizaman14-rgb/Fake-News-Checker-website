import React from 'react';
import { AnalysisResult, VerdictType } from '../types';
import { ExternalLink, CheckCircle, AlertTriangle, XCircle, Bot, HelpCircle, ArrowRight } from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

const AnalysisReport: React.FC<Props> = ({ result }) => {
  const { verdict, title, reason, groundingUrls, confidenceScore } = result;

  // Visual Configuration based on Verdict
  const getVerdictConfig = (type: VerdictType) => {
    switch (type) {
      case 'AI_GENERATED':
        return {
          color: 'purple',
          icon: <Bot className="w-10 h-10 md:w-12 md:h-12" />,
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-800',
          badge: 'bg-purple-600',
          label: 'AI জেনারেটেড'
        };
      case 'FAKE':
      case 'MISLEADING':
        return {
          color: 'red',
          icon: <XCircle className="w-10 h-10 md:w-12 md:h-12" />,
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          badge: 'bg-red-600',
          label: 'মিথ্যা তথ্য / ভুয়া'
        };
      case 'REAL':
        return {
          color: 'green',
          icon: <CheckCircle className="w-10 h-10 md:w-12 md:h-12" />,
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          badge: 'bg-green-600',
          label: 'সত্য তথ্য'
        };
      case 'UNSURE':
      default:
        return {
          color: 'slate',
          icon: <HelpCircle className="w-10 h-10 md:w-12 md:h-12" />,
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-800',
          badge: 'bg-slate-600',
          label: 'নিশ্চিত নয়'
        };
    }
  };

  const config = getVerdictConfig(verdict);

  return (
    <div className={`rounded-2xl shadow-xl overflow-hidden border-2 ${config.border} bg-white animate-fade-in-up`}>
      
      {/* Header / Verdict Banner */}
      <div className={`${config.bg} p-6 md:p-8 flex flex-col items-center text-center space-y-3 md:space-y-4`}>
        <div className={`p-3 md:p-4 rounded-full bg-white shadow-sm ${config.text}`}>
          {config.icon}
        </div>
        
        <div className="space-y-2 w-full">
          <span className={`inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full text-white text-xs md:text-sm font-bold tracking-wide uppercase shadow-sm ${config.badge}`}>
            {config.label}
          </span>
          <h2 className={`text-xl md:text-3xl font-bold leading-tight ${config.text}`}>
            {title}
          </h2>
        </div>

        {/* Confidence Meter (Visual only) */}
        <div className="w-full max-w-xs mt-1">
           <div className="flex justify-between text-[10px] md:text-xs font-semibold text-slate-400 mb-1">
             <span>Confidence</span>
             <span>{confidenceScore}%</span>
           </div>
           <div className="w-full bg-white/50 rounded-full h-2">
             <div 
                className={`h-2 rounded-full ${config.badge}`} 
                style={{ width: `${confidenceScore}%` }}
             ></div>
           </div>
        </div>
      </div>

      {/* Concise Content */}
      <div className="p-5 md:p-8 space-y-5 md:space-y-6">
        <div>
          <h3 className="text-xs md:text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">কারণ</h3>
          <p className="text-base md:text-lg text-slate-700 font-medium leading-relaxed">
            {reason}
          </p>
        </div>

        {/* Sources Section - Only if available */}
        {groundingUrls && groundingUrls.length > 0 && (
          <div className="pt-5 md:pt-6 border-t border-slate-100">
            <h3 className="text-xs md:text-sm uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-2">
              তথ্যসূত্র (Sources)
            </h3>
            <div className="grid gap-2">
              {groundingUrls.slice(0, 3).map((url, idx) => (
                <a 
                  key={idx}
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-2.5 md:p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-white p-1 md:p-1.5 rounded-md border border-slate-200 text-slate-500">
                      <ExternalLink size={12} className="md:w-3.5 md:h-3.5" />
                    </div>
                    <span className="text-xs md:text-sm text-slate-600 truncate font-medium group-hover:text-blue-600 transition-colors">
                      {new URL(url).hostname.replace('www.', '')}
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-start md:items-center gap-2 text-[10px] md:text-xs text-slate-400 bg-slate-50 p-2 md:p-3 rounded-lg">
           <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 md:mt-0" />
           <p className="leading-tight">AI ১০০% নির্ভুল নাও হতে পারে। অনুগ্রহ করে নিজে যাচাই করুন।</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;