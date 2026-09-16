import React from 'react';
import { Delete } from 'lucide-react';
import { AngleMode, CalculatorMode } from '../types';

interface KeypadProps {
  mode: CalculatorMode;
  angleMode: AngleMode;
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onCalculate: () => void;
  onFunction: (fn: string) => void;
  onToggleSign: () => void;
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  mode,
  onNumber,
  onOperator,
  onClear,
  onBackspace,
  onCalculate,
  onFunction,
  onToggleSign,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
}) => {
  return (
    <div id="calculator-keypad" className="flex flex-col gap-2.5 select-none touch-manipulation">
      {/* Memory Bar */}
      <div
        id="memory-bar"
        className="grid grid-cols-4 gap-2 px-0.5 mb-1"
      >
        <button
          id="btn-memory-clear"
          type="button"
          onClick={onMemoryClear}
          className="py-1.5 px-2 rounded-xl text-xs font-mono font-medium text-slate-400 bg-slate-900/60 hover:bg-slate-800/90 hover:text-slate-200 border border-slate-800/60 active:scale-95 transition cursor-pointer"
        >
          MC
        </button>
        <button
          id="btn-memory-recall"
          type="button"
          onClick={onMemoryRecall}
          className="py-1.5 px-2 rounded-xl text-xs font-mono font-medium text-slate-400 bg-slate-900/60 hover:bg-slate-800/90 hover:text-slate-200 border border-slate-800/60 active:scale-95 transition cursor-pointer"
        >
          MR
        </button>
        <button
          id="btn-memory-add"
          type="button"
          onClick={onMemoryAdd}
          className="py-1.5 px-2 rounded-xl text-xs font-mono font-medium text-slate-400 bg-slate-900/60 hover:bg-slate-800/90 hover:text-slate-200 border border-slate-800/60 active:scale-95 transition cursor-pointer"
        >
          M+
        </button>
        <button
          id="btn-memory-subtract"
          type="button"
          onClick={onMemorySubtract}
          className="py-1.5 px-2 rounded-xl text-xs font-mono font-medium text-slate-400 bg-slate-900/60 hover:bg-slate-800/90 hover:text-slate-200 border border-slate-800/60 active:scale-95 transition cursor-pointer"
        >
          M-
        </button>
      </div>

      {/* Scientific Functions Panel (Displayed in scientific mode) */}
      {mode === 'scientific' && (
        <div
          id="scientific-keys-grid"
          className="grid grid-cols-5 gap-2 p-2 rounded-2xl bg-slate-900/50 border border-slate-800/80 mb-1"
        >
          <button
            id="btn-sin"
            type="button"
            onClick={() => onFunction('sin(')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            sin
          </button>
          <button
            id="btn-cos"
            type="button"
            onClick={() => onFunction('cos(')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-755 active:scale-95 transition cursor-pointer"
          >
            cos
          </button>
          <button
            id="btn-tan"
            type="button"
            onClick={() => onFunction('tan(')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            tan
          </button>
          <button
            id="btn-pi"
            type="button"
            onClick={() => onNumber('π')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            π
          </button>
          <button
            id="btn-euler"
            type="button"
            onClick={() => onNumber('e')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            e
          </button>

          <button
            id="btn-power"
            type="button"
            onClick={() => onOperator('^')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            x^y
          </button>
          <button
            id="btn-sqrt"
            type="button"
            onClick={() => onFunction('√(')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            √x
          </button>
          <button
            id="btn-ln"
            type="button"
            onClick={() => onFunction('ln(')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            ln
          </button>
          <button
            id="btn-log"
            type="button"
            onClick={() => onFunction('log(')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            log
          </button>
          <button
            id="btn-factorial"
            type="button"
            onClick={() => onOperator('!')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            x!
          </button>

          <button
            id="btn-paren-open"
            type="button"
            onClick={() => onFunction('(')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            (
          </button>
          <button
            id="btn-paren-close"
            type="button"
            onClick={() => onFunction(')')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            )
          </button>
          <button
            id="btn-reciprocal"
            type="button"
            onClick={() => onFunction('1/(')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            1/x
          </button>
          <button
            id="btn-asin"
            type="button"
            onClick={() => onFunction('asin(')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            sin⁻¹
          </button>
          <button
            id="btn-acos"
            type="button"
            onClick={() => onFunction('acos(')}
            className="py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-slate-800/70 hover:bg-slate-750 text-indigo-300 border border-slate-750 active:scale-95 transition cursor-pointer"
          >
            cos⁻¹
          </button>
        </div>
      )}

      {/* Standard Keypad Grid (4 columns) */}
      <div id="standard-keys-grid" className="grid grid-cols-4 gap-2.5">
        {/* Row 1 */}
        <button
          id="btn-clear"
          type="button"
          onClick={onClear}
          className="h-13 sm:h-15 rounded-2xl text-base sm:text-lg font-semibold bg-slate-800/90 hover:bg-slate-750 text-rose-400 border border-slate-750/70 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          AC
        </button>
        <button
          id="btn-backspace"
          type="button"
          onClick={onBackspace}
          className="h-13 sm:h-15 rounded-2xl text-base sm:text-lg font-semibold bg-slate-800/90 hover:bg-slate-750 text-slate-300 border border-slate-750/70 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
          title="Delete last character"
          aria-label="Delete last character"
        >
          <Delete className="w-5 h-5 text-slate-300" />
        </button>
        <button
          id="btn-percentage"
          type="button"
          onClick={() => onOperator('%')}
          className="h-13 sm:h-15 rounded-2xl text-base sm:text-lg font-semibold bg-slate-800/90 hover:bg-slate-750 text-cyan-400 border border-slate-750/70 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          %
        </button>
        <button
          id="btn-divide"
          type="button"
          onClick={() => onOperator('÷')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-bold bg-amber-600/90 hover:bg-amber-500 active:bg-amber-700 text-white shadow-md shadow-amber-950/20 active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          id="btn-7"
          type="button"
          onClick={() => onNumber('7')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-mono font-medium bg-slate-850 hover:bg-slate-800 active:bg-slate-750 text-slate-100 border border-slate-800 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          7
        </button>
        <button
          id="btn-8"
          type="button"
          onClick={() => onNumber('8')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-mono font-medium bg-slate-850 hover:bg-slate-800 active:bg-slate-750 text-slate-100 border border-slate-800 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          8
        </button>
        <button
          id="btn-9"
          type="button"
          onClick={() => onNumber('9')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-mono font-medium bg-slate-850 hover:bg-slate-800 active:bg-slate-750 text-slate-100 border border-slate-800 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          9
        </button>
        <button
          id="btn-multiply"
          type="button"
          onClick={() => onOperator('×')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-bold bg-amber-600/90 hover:bg-amber-500 active:bg-amber-700 text-white shadow-md shadow-amber-950/20 active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          id="btn-4"
          type="button"
          onClick={() => onNumber('4')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-mono font-medium bg-slate-850 hover:bg-slate-800 active:bg-slate-750 text-slate-100 border border-slate-800 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          4
        </button>
        <button
          id="btn-5"
          type="button"
          onClick={() => onNumber('5')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-mono font-medium bg-slate-850 hover:bg-slate-800 active:bg-slate-750 text-slate-100 border border-slate-800 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          5
        </button>
        <button
          id="btn-6"
          type="button"
          onClick={() => onNumber('6')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-mono font-medium bg-slate-850 hover:bg-slate-800 active:bg-slate-750 text-slate-100 border border-slate-800 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          6
        </button>
        <button
          id="btn-subtract"
          type="button"
          onClick={() => onOperator('-')}
          className="h-13 sm:h-15 rounded-2xl text-2xl font-bold bg-amber-600/90 hover:bg-amber-500 active:bg-amber-700 text-white shadow-md shadow-amber-950/20 active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          −
        </button>

        {/* Row 4 */}
        <button
          id="btn-1"
          type="button"
          onClick={() => onNumber('1')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-mono font-medium bg-slate-850 hover:bg-slate-800 active:bg-slate-750 text-slate-100 border border-slate-800 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          1
        </button>
        <button
          id="btn-2"
          type="button"
          onClick={() => onNumber('2')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-mono font-medium bg-slate-850 hover:bg-slate-800 active:bg-slate-750 text-slate-100 border border-slate-800 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          2
        </button>
        <button
          id="btn-3"
          type="button"
          onClick={() => onNumber('3')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-mono font-medium bg-slate-850 hover:bg-slate-800 active:bg-slate-750 text-slate-100 border border-slate-800 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          3
        </button>
        <button
          id="btn-add"
          type="button"
          onClick={() => onOperator('+')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-bold bg-amber-600/90 hover:bg-amber-500 active:bg-amber-700 text-white shadow-md shadow-amber-950/20 active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          id="btn-toggle-sign"
          type="button"
          onClick={onToggleSign}
          className="h-13 sm:h-15 rounded-2xl text-lg sm:text-xl font-semibold bg-slate-800/90 hover:bg-slate-750 text-slate-300 border border-slate-750/70 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          ±
        </button>
        <button
          id="btn-0"
          type="button"
          onClick={() => onNumber('0')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-mono font-medium bg-slate-850 hover:bg-slate-800 active:bg-slate-750 text-slate-100 border border-slate-800 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          0
        </button>
        <button
          id="btn-decimal"
          type="button"
          onClick={() => onNumber('.')}
          className="h-13 sm:h-15 rounded-2xl text-xl sm:text-2xl font-mono font-bold bg-slate-850 hover:bg-slate-800 active:bg-slate-750 text-slate-100 border border-slate-800 shadow-sm active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          .
        </button>
        <button
          id="btn-equals"
          type="button"
          onClick={onCalculate}
          className="h-13 sm:h-15 rounded-2xl text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:from-amber-600 active:to-orange-600 text-white shadow-lg shadow-orange-950/40 active:scale-95 transition cursor-pointer flex items-center justify-center"
        >
          =
        </button>
      </div>
    </div>
  );
};
