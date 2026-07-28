import React from 'react';

export const SundanesePattern: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Mega Mendung & Kujang Subtle Decorative Wireframe Grid */}
      <svg
        className="absolute top-0 right-0 w-[800px] h-[800px] opacity-[0.07] dark:opacity-[0.12] text-amber-500 dark:text-emerald-400 transform translate-x-1/3 -translate-y-1/4"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Kujang Abstract Blade Geometry */}
        <path
          d="M250 30 C 280 120, 320 180, 420 220 C 350 250, 300 320, 280 440 C 260 380, 220 310, 150 290 C 200 240, 230 150, 250 30 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        {/* Concentric Traditional Geometric Rings */}
        <circle cx="250" cy="230" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="250" cy="230" r="120" stroke="currentColor" strokeWidth="1" />
        <circle cx="250" cy="230" r="60" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        
        {/* Mega Mendung Stylized Wavy Curves */}
        <path
          d="M 50 100 C 150 60, 250 140, 350 100 C 450 60, 480 120, 500 150"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M 20 180 C 120 140, 220 220, 320 180 C 420 140, 460 200, 490 230"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M 80 260 C 180 220, 280 300, 380 260 C 450 230, 480 280, 500 310"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      {/* Radial Gradient Subtle Light Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-[#09090b] opacity-90" />
    </div>
  );
};

export const AksaraSundaBadge: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-semibold tracking-wider bg-amber-500/10 dark:bg-emerald-500/10 text-amber-700 dark:text-emerald-400 border border-amber-500/20 dark:border-emerald-500/30 ${sizeClasses[size]}`}
      title="Aksara Sunda: Rancago (ᮛᮔ᮪ᮎᮌ᮰)"
    >
      <span className="text-amber-600 dark:text-emerald-400">ᮛᮔ᮪ᮎᮌ᮰</span>
    </span>
  );
};
