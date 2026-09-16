import React from 'react';
import { Trash2, X, Clock, ArrowDownLeft } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
  onDeleteHistoryItem,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="history-overlay"
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={onClose}
    >
      <div
        id="history-drawer"
        className="w-full max-w-sm h-full bg-slate-900 border-l border-slate-800 p-4 sm:p-5 flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-semibold text-slate-100">Calculation History</h2>
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                id="clear-all-history-btn"
                type="button"
                onClick={onClearHistory}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                title="Clear All History"
                aria-label="Clear All History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              id="close-history-drawer-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close History"
              aria-label="Close History"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of History Items */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 scrollbar-thin">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Clock className="w-10 h-10 mb-2 opacity-30 stroke-1" />
              <p className="text-sm font-medium">No calculations yet</p>
              <p className="text-xs text-slate-600 mt-1">Calculations will be saved automatically here.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                className="group relative p-3 rounded-xl bg-slate-850/70 hover:bg-slate-800 border border-slate-800/80 transition-all cursor-pointer flex flex-col gap-1"
                onClick={() => onSelectHistory(item)}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="truncate pr-2">{item.expression}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHistoryItem(item.id);
                    }}
                    className="opacity-70 sm:opacity-0 group-hover:opacity-100 p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 active:scale-95 transition"
                    title="Delete item"
                    aria-label="Delete history item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold font-mono text-amber-400">
                    = {item.result}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 group-hover:text-amber-300 transition">
                    <ArrowDownLeft className="w-3 h-3" />
                    Insert
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500">
              Tap any equation to restore it into the calculator.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
