import React from 'react';
import { LOTTERY_CONFIG } from '../types';

interface NumberSelectorProps {
  selectedNumbers: number[];
  onToggleNumber: (num: number) => void;
}

export const NumberSelector: React.FC<NumberSelectorProps> = ({ selectedNumbers, onToggleNumber }) => {
  const numbers = Array.from({ length: LOTTERY_CONFIG.maxNumber }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 p-4 glass-panel rounded-2xl">
      {numbers.map((num) => {
        const isSelected = selectedNumbers.includes(num);
        return (
          <button
            key={num}
            onClick={() => onToggleNumber(num)}
            className={`
              relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300
              ${isSelected 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black scale-110 shadow-[0_0_15px_rgba(251,191,36,0.5)]' 
                : 'bg-slate-700/50 hover:bg-slate-600 text-slate-300 hover:text-white border border-slate-600'
              }
            `}
          >
            {num}
            {isSelected && (
                <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-pulse"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};