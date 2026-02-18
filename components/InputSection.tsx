import React, { useState, useRef, ChangeEvent } from 'react';
import { InputType } from '../types';
import { Image as ImageIcon, Link as LinkIcon, Type, UploadCloud, X } from 'lucide-react';

interface Props {
  onAnalyze: (text: string, imageBase64?: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<Props> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<InputType>(InputType.TEXT);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (tab: InputType) => {
    setActiveTab(tab);
    // Clear inputs when switching tabs to avoid confusion
    setInputText('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (isLoading) return;
    
    // Validation
    if (activeTab === InputType.TEXT && !inputText.trim()) return;
    if (activeTab === InputType.LINK && !inputText.trim()) return;
    if (activeTab === InputType.IMAGE && !selectedImage) return;

    let textToSend = inputText;
    // Append context if it's a link tab to help the AI understand intent
    if (activeTab === InputType.LINK) {
      textToSend = `লিংকটি যাচাই করুন: ${inputText}`;
    }

    onAnalyze(textToSend, selectedImage || undefined);
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => handleTabChange(InputType.TEXT)}
          className={`flex-1 py-3 md:py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors active:bg-purple-50 ${
            activeTab === InputType.TEXT 
              ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Type size={16} className="md:w-[18px] md:h-[18px]" />
          টেক্সট
        </button>
        <button
          onClick={() => handleTabChange(InputType.IMAGE)}
          className={`flex-1 py-3 md:py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors active:bg-purple-50 ${
            activeTab === InputType.IMAGE 
              ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <ImageIcon size={16} className="md:w-[18px] md:h-[18px]" />
          ছবি
        </button>
        <button
          onClick={() => handleTabChange(InputType.LINK)}
          className={`flex-1 py-3 md:py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors active:bg-purple-50 ${
            activeTab === InputType.LINK 
              ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <LinkIcon size={16} className="md:w-[18px] md:h-[18px]" />
          লিংক
        </button>
      </div>

      <div className="p-4 md:p-6">
        {/* Text Input */}
        {activeTab === InputType.TEXT && (
          <textarea
            className="w-full h-32 md:h-40 p-3 md:p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none text-slate-800 bg-slate-50 text-base"
            placeholder="এখানে সন্দেহজনক খবর, টেক্সট বা পোস্ট পেস্ট করুন..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        )}

        {/* Link Input */}
        {activeTab === InputType.LINK && (
          <div className="space-y-3 md:space-y-4">
            <input
              type="url"
              className="w-full p-3 md:p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-slate-800 bg-slate-50 text-base"
              placeholder="https://example.com/fake-news..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              * আমরা লিংকটির কন্টেন্ট পড়ে এর সত্যতা যাচাই করার চেষ্টা করবো।
            </p>
          </div>
        )}

        {/* Image Input */}
        {activeTab === InputType.IMAGE && (
          <div className="space-y-3 md:space-y-4">
            {!selectedImage ? (
              <div 
                className="border-2 border-dashed border-slate-300 rounded-lg h-40 md:h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 hover:border-purple-400 transition-colors active:bg-purple-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="text-purple-600 mb-2 w-8 h-8 md:w-10 md:h-10" />
                <p className="text-sm font-medium text-slate-600">ছবি আপলোড করুন</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG (Max 5MB)</p>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <img src={selectedImage} alt="Preview" className="w-full h-48 md:h-64 object-contain" />
                <button 
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-slate-700 hover:text-red-500 shadow-sm active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {/* Optional text with image */}
            <input
              type="text"
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              placeholder="ছবি সম্পর্কে প্রশ্ন (ঐচ্ছিক)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isLoading || (activeTab === InputType.IMAGE && !selectedImage) || (activeTab !== InputType.IMAGE && !inputText.trim())}
          className={`w-full mt-4 md:mt-6 py-3.5 md:py-4 rounded-lg font-bold text-base md:text-lg shadow-md transition-all ${
            isLoading || (activeTab === InputType.IMAGE && !selectedImage) || (activeTab !== InputType.IMAGE && !inputText.trim())
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              বিশ্লেষণ...
            </span>
          ) : 'যাচাই করুন'}
        </button>
      </div>
    </div>
  );
};

export default InputSection;