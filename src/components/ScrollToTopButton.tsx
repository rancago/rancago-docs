import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton: React.FC<{ label?: string }> = ({ label = 'Top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#8C4A27] dark:bg-[#E58A3C] text-white dark:text-[#0C0A09] font-bold text-xs shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-[#A85C32] dark:border-[#F2A25B] group"
    >
      <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
      <span className="hidden sm:inline font-mono">{label}</span>
    </button>
  );
};
