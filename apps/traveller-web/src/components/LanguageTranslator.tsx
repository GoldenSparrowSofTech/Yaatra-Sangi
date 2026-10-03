'use client';
import { useEffect } from 'react';

export default function LanguageTranslator() {
  useEffect(() => {
    // Only add if not already added
    if (document.getElementById('google-translate-script')) return;

    const addScript = document.createElement('script');
    addScript.id = 'google-translate-script';
    addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    addScript.async = true;
    document.body.appendChild(addScript);

    // Provide the initialization function globally
    (window as any).googleTranslateElementInit = () => {
      // @ts-ignore
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,gu,hi', // English, Gujarati, Hindi
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-full w-12 h-12 shadow-lg shadow-black/50 hover:scale-105 transition-transform overflow-hidden cursor-pointer">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xl">🌐</span>
      </div>
      <div id="google_translate_element" className="opacity-0 w-full h-full absolute inset-0 cursor-pointer"></div>
      <style jsx global>{`
        /* Hide the top Google Translate bar that shifts the page */
        .skiptranslate > iframe.skiptranslate {
            display: none !important;
            visibility: hidden !important;
        }
        body {
            top: 0px !important; 
        }
        /* Style the dropdown */
        .goog-te-gadget-simple {
            background-color: transparent !important;
            border: none !important;
            font-size: 14px !important;
            color: #f8fafc !important;
            display: flex !important;
            align-items: center !important;
            padding: 0 !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value {
            color: #f8fafc !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value span {
            color: #f8fafc !important;
        }
        .goog-te-menu-value span:nth-child(3) {
            display: none;
        }
        .goog-te-menu-value span:nth-child(5) {
            color: #94a3b8 !important;
            margin-left: 5px;
        }
        /* Hide the Google translate logo */
        .goog-te-gadget-icon {
            display: none !important;
        }
      `}</style>
    </div>
  );
}
