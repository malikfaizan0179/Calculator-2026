import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Volume2, VolumeX } from 'lucide-react';
import { AngleMode, CalculatorMode } from '../types';

interface DisplayProps {
  expression: string;
  result: string;
  preview: string | null;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  calculatorMode: CalculatorMode;
  hasMemory: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onBackspace: () => void;
  errorMessage?: string | null;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  preview,
  angleMode,
  onToggleAngleMode,
  calculatorMode,
  hasMemory,
  isMuted,
  onToggleMute,
  onBackspace,
  errorMessage,
}) => {
  const [copied, setCopied] = useState(false);
  const expressionRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Auto-scroll expression to right edge as user inputs digits
  useEffect(() => {
    if (expressionRef.current) {
      expressionRef.current.scrollLeft = expressionRef.current.scrollWidth;
    }
  }, [expression]);

  // Touch swipe detection for mobile backspacing
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Detect intentional horizontal swipe (at least 30px and predominantly horizontal)
    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      onBackspace();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleCopy = () => {
    const textToCopy = result && result !== '0' ? result : expression;
    if (textToCopy && textToCopy !== 'Error') {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    }
  };

  // Determine dynamic font size for main display
  const getFontSize = (text: string) => {
    const len = text.length;
    if (len > 18) return 'text-xl sm:text-2xl md:text-3xl';
    if (len > 13) return 'text-2xl sm:text-3xl md:text-4xl';
    if (len > 8) return 'text-3xl sm:text-4xl md:text-5xl';
    return 'text-4xl sm:text-5xl md:text-6xl';
  };

  const displayText = errorMessage || result;

  return (
    <div
      id="calculator-display"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      title="Swipe left or right across display to delete last digit"
      className="relative flex flex-col justify-between p-3.5 sm:p-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner overflow-hidden mb-3 sm:mb-4 select-none min-h-[135px] sm:min-h-[155px] cursor-default"
    >
      {/* Top Status Bar: Angle Mode, Memory, Sound, and Copy */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 sm:mb-2">
        <div className="flex items-center gap-2">
          {calculatorMode === 'scientific' && (
            <button
              id="toggle-angle-mode-btn"
              type="button"
              onClick={onToggleAngleMode}
              className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-slate-800 text-indigo-300 hover:bg-slate-700 transition border border-slate-700/60 cursor-pointer active:scale-95"
              title="Click to toggle DEG/RAD"
            >
              {angleMode}
            </button>
          )}

          {hasMemory && (
            <span
              id="memory-indicator-badge"
              className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono"
            >
              M
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="sound-toggle-btn"
            type="button"
            onClick={onToggleMute}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 active:scale-95 transition cursor-pointer touch-manipulation"
            title={isMuted ? 'Unmute key sounds' : 'Mute key sounds'}
            aria-label={isMuted ? 'Unmute key sounds' : 'Mute key sounds'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            id="copy-result-btn"
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 active:scale-95 transition cursor-pointer text-xs touch-manipulation"
            title="Copy current value"
            aria-label="Copy result"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expression Area (Scrollable if long) */}
      <div
        ref={expressionRef}
        id="expression-view"
        className="w-full text-right font-mono text-sm sm:text-base text-slate-400 min-h-[22px] sm:min-h-[26px] overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-none tracking-wide"
      >
        {expression || <span className="opacity-0">0</span>}
      </div>

      {/* Main Result Display with live preview or final value */}
      <div className="flex flex-col items-end justify-end mt-1">
        <div
          id="main-result-view"
          className={`w-full text-right font-mono font-semibold tracking-tight text-white select-all transition-all duration-150 break-all leading-tight ${getFontSize(
            displayText
          )} ${errorMessage ? 'text-rose-400' : ''}`}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {displayText}
        </div>

        {/* Realtime calculation preview */}
        {preview && !errorMessage && (
          <div
            id="preview-result-view"
            className="text-xs sm:text-sm font-mono text-slate-500 mt-0.5 tracking-wider"
          >
            = {preview}
          </div>
        )}
      </div>
    </div>
  );
};
