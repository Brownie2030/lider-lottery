import React from 'react';
import { LOTTERY_CONFIG } from '../types';

interface NumberSelectorProps {
  selectedNumbers: number[];
  onToggleNumber: (num: number) => void;
}

export const NumberSelector: React.FC<NumberSelectorProps> = ({ selectedNumbers, onToggleNumber }) => {
  const numbers = Array.from({ length: LOTTERY_CONFIG.maxNumber }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-3 p-6 bg-black/20 rounded-2xl border border-white/5 shadow-inner">
      {numbers.map((num) => {
        const isSelected = selectedNumbers.includes(num);
        return (
          <button
            key={num}
            onClick={() => onToggleNumber(num)}
            className={`
              relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center 
              text-sm sm:text-base font-bold transition-all duration-200
              ${isSelected ? 'ball-selected text-black -translate-y-1' : 'ball-gradient text-slate-300 hover:text-white hover:scale-105'}
            `}
          >
            <span className="relative z-10 font-display drop-shadow-md">{num}</span>
            
            {/* Specular highlight for 3D effect */}
            <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-gradient-to-br from-white/40 to-transparent rounded-full pointer-events-none"></div>
            
            {isSelected && (
                <div className="absolute inset-0 rounded-full ring-2 ring-yellow-400 ring-offset-2 ring-offset-black/50 animate-pulse"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};