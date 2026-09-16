import React, { useState } from 'react';
import { History, HelpCircle, Calculator as CalcIcon, X } from 'lucide-react';
import { CalculatorMode } from '../types';

interface HeaderProps {
  mode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
  historyCount: number;
  onToggleHistory: () => void;
  isHistoryOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  historyCount,
  onToggleHistory,
  isHistoryOpen,
}) => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <header className="relative flex items-center justify-between py-3 px-1 mb-2">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-orange-950/40">
          <CalcIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-100 tracking-tight leading-tight">
            Calculator
          </h1>
          <span className="text-[11px] text-slate-400 font-medium block">
            {mode === 'scientific' ? 'Scientific Pro' : 'Standard'}
          </span>
        </div>
      </div>

      {/* Controls: Mode Switch & History & Shortcuts */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mode Toggle Switch */}
        <div className="bg-slate-900/90 border border-slate-800 p-0.5 rounded-xl flex items-center shadow-sm">
          <button
            id="mode-standard-btn"
            type="button"
            onClick={() => onModeChange('standard')}
            className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-lg transition-all cursor-pointer ${
              mode === 'standard'
                ? 'bg-slate-800 text-amber-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Basic
          </button>
          <button
            id="mode-scientific-btn"
            type="button"
            onClick={() => onModeChange('scientific')}
            className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-lg transition-all cursor-pointer ${
              mode === 'scientific'
                ? 'bg-slate-800 text-indigo-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scientific
          </button>
        </div>

        {/* History Toggle Button */}
        <button
          id="toggle-history-panel-btn"
          type="button"
          onClick={onToggleHistory}
          className={`relative p-2 rounded-xl border transition cursor-pointer flex items-center justify-center active:scale-95 touch-manipulation ${
            isHistoryOpen
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
          title="Toggle Calculation History"
          aria-label="Toggle Calculation History"
        >
          <History className="w-4 h-4" />
          {historyCount > 0 && (
            <span
              id="history-count-badge"
              className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold rounded-full bg-amber-500 text-slate-950 flex items-center justify-center"
            >
              {historyCount > 9 ? '9+' : historyCount}
            </span>
          )}
        </button>

        {/* Keyboard Shortcuts Info Button */}
        <button
          id="keyboard-shortcuts-btn"
          type="button"
          onClick={() => setShowShortcuts(true)}
          className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition cursor-pointer active:scale-95 touch-manipulation"
          title="Shortcuts & Tips"
          aria-label="Shortcuts & Tips"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Shortcuts & Tips Modal */}
      {showShortcuts && (
        <div
          id="shortcuts-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            id="shortcuts-modal"
            className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="font-semibold text-base text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" /> Shortcuts & Mobile Tips
              </h3>
              <button
                id="close-shortcuts-modal-btn"
                type="button"
                onClick={() => setShowShortcuts(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Mobile Gesture</span>
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Swipe Display to Delete</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Numbers & Operators</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">0-9, +, -, *, /</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Calculate / Equals</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">Enter or =</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400">All Clear</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">Escape or C</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Delete Backspace</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">Backspace</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Parentheses & Percentage</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">(, ), %</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Power Exponent</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">^</span>
              </div>
            </div>

            <button
              id="confirm-shortcuts-btn"
              type="button"
              onClick={() => setShowShortcuts(false)}
              className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer border border-slate-700/60"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
