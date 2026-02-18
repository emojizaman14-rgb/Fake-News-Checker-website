import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import AnalysisReport from './components/AnalysisReport';
import { AnalysisResult } from './types';
import { analyzeContent } from './services/geminiService';
import { Search, AlertOctagon } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (text: string, imageBase64?: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeContent(text, imageBase64);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-3 md:px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        
        {/* Intro / Hero */}
        <div className="text-center space-y-2 md:space-y-3 mb-4 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-slate-800 leading-snug">
            ইন্টারনেটের তথ্যে বিভ্রান্ত? <br className="hidden md:block"/> সত্য জানুন এখনি।
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto px-2">
            AI ব্যবহার করে ছবি, ভিডিও বা খবরের সত্যতা যাচাই করুন। বাংলাদেশ-কেন্দ্রিক ফ্যাক্ট চেকিংয়ের জন্য নির্ভরযোগ্য টুল।
          </p>
        </div>

        {/* Input Area */}
        <InputSection onAnalyze={handleAnalysis} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 flex items-start md:items-center gap-3 text-red-700 animate-fade-in text-sm md:text-base">
            <AlertOctagon className="flex-shrink-0 mt-0.5 md:mt-0" size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !result && (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
            <div className="h-32 md:h-40 bg-slate-200 rounded mt-4"></div>
          </div>
        )}

        {/* Results Area */}
        {result && (
          <div className="scroll-mt-20 md:scroll-mt-24" id="results">
             <AnalysisReport result={result} />
          </div>
        )}
        
        {/* Footer info features */}
        {!result && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-8 text-center text-slate-500">
            <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
              <Search className="mx-auto mb-2 text-purple-600 w-5 h-5 md:w-6 md:h-6" />
              <h3 className="font-semibold text-slate-700 text-sm md:text-base">ফ্যাক্ট চেক</h3>
              <p className="text-xs md:text-sm mt-1">জাতীয় ও আন্তর্জাতিক খবরের সত্যতা যাচাই</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
              <div className="mx-auto mb-2 text-purple-600 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center border-2 border-purple-600 rounded-md text-[10px] md:text-xs font-bold">AI</div>
              <h3 className="font-semibold text-slate-700 text-sm md:text-base">AI ডিটেকশন</h3>
              <p className="text-xs md:text-sm mt-1">AI-জেনারেটেড ছবি ও কন্টেন্ট শনাক্তকরণ</p>
            </div>
             <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
              <AlertOctagon className="mx-auto mb-2 text-purple-600 w-5 h-5 md:w-6 md:h-6" />
              <h3 className="font-semibold text-slate-700 text-sm md:text-base">গুজব প্রতিরোধ</h3>
              <p className="text-xs md:text-sm mt-1">সোশ্যাল মিডিয়ার ভাইরাল কন্টেন্ট বিশ্লেষণ</p>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-4 md:py-6 mt-8 md:mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-xs md:text-sm">
          <p>© {new Date().getFullYear()} Fake Checker By Radid. Built for Truth.</p>
          <p className="mt-1">Powered by Google Gemini 2.0 Flash</p>
        </div>
      </footer>
    </div>
  );
};

export default App;