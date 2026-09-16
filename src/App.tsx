import { useState, useEffect, useCallback } from 'react';
import { AngleMode, CalculatorMode, HistoryItem } from './types';
import { evaluateExpression, previewEvaluation } from './utils/mathEvaluator';
import { soundManager } from './utils/sound';
import { Header } from './components/Header';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { HistoryPanel } from './components/HistoryPanel';

export default function App() {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [preview, setPreview] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calculator_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());
  const [justCalculated, setJustCalculated] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update preview whenever expression changes
  useEffect(() => {
    if (!expression) {
      setPreview(null);
      return;
    }
    const prev = previewEvaluation(expression, angleMode);
    setPreview(prev);
  }, [expression, angleMode]);

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('calculator_history', JSON.stringify(history));
    } catch {
      // storage quota or disabled
    }
  }, [history]);

  // Sound handler
  const playKeySound = (type: 'number' | 'operator' | 'action' | 'equals' = 'number') => {
    soundManager.playClick(type);
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Angle mode toggle
  const handleToggleAngleMode = () => {
    playKeySound('action');
    setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
  };

  // Clear all
  const handleClear = useCallback(() => {
    playKeySound('action');
    setExpression('');
    setResult('0');
    setPreview(null);
    setErrorMessage(null);
    setJustCalculated(false);
  }, []);

  // Backspace / Delete last character
  const handleBackspace = useCallback(() => {
    playKeySound('action');
    setErrorMessage(null);

    if (justCalculated) {
      setExpression('');
      setResult('0');
      setJustCalculated(false);
      return;
    }

    if (expression.length > 0) {
      // Check if ends with multi-character function like "sin(", "cos(", "log(" etc.
      const match = expression.match(/(sin\(|cos\(|tan\(|asin\(|acos\(|atan\(|ln\(|log\(|√\(|1\/\()$/);
      let newExpr = '';
      if (match) {
        newExpr = expression.slice(0, -match[0].length);
      } else {
        newExpr = expression.slice(0, -1);
      }
      setExpression(newExpr);
      setResult(newExpr === '' ? '0' : newExpr);
    } else {
      setResult('0');
    }
  }, [expression, justCalculated]);

  // Input numbers or decimals
  const handleNumber = useCallback(
    (num: string) => {
      playKeySound('number');
      setErrorMessage(null);

      if (justCalculated) {
        setExpression(num);
        setResult(num);
        setJustCalculated(false);
        return;
      }

      // Handle decimal logic: don't allow multiple decimals in the same number segment
      if (num === '.') {
        const parts = expression.split(/[+\-×÷*/%^()]/);
        const currentSegment = parts[parts.length - 1];
        if (currentSegment.includes('.')) {
          return;
        }
        if (!currentSegment || currentSegment === '') {
          setExpression((prev) => prev + '0.');
          setResult((prev) => (prev === '0' ? '0.' : prev + '.'));
          return;
        }
      }

      const newExpr = expression === '0' && num !== '.' ? num : expression + num;
      setExpression(newExpr);
      setResult(newExpr);
    },
    [expression, justCalculated]
  );

  // Input operators (+, -, ×, ÷, %, ^)
  const handleOperator = useCallback(
    (op: string) => {
      playKeySound('operator');
      setErrorMessage(null);

      let currentExpr = expression;

      if (justCalculated) {
        currentExpr = result;
        setJustCalculated(false);
      }

      if (!currentExpr || currentExpr === '') {
        if (op === '-') {
          setExpression('-');
          setResult('-');
          return;
        }
        if (op === '!') {
          return;
        }
        currentExpr = '0';
      }

      // If expression already ends with an operator, replace it (unless it's negative sign)
      const lastChar = currentExpr.slice(-1);
      if (['+', '-', '×', '÷', '^', '%'].includes(lastChar)) {
        // If typing minus after an operator, allow unary minus
        if (op === '-' && ['+', '×', '÷', '^'].includes(lastChar)) {
          setExpression(currentExpr + op);
          setResult(currentExpr + op);
          return;
        }
        // Replace previous operator
        const replaced = currentExpr.slice(0, -1) + op;
        setExpression(replaced);
        setResult(replaced);
        return;
      }

      const updated = currentExpr + op;
      setExpression(updated);
      setResult(updated);
    },
    [expression, result, justCalculated]
  );

  // Input scientific functions (sin, cos, √, ln, log, brackets)
  const handleFunction = useCallback(
    (fn: string) => {
      playKeySound('operator');
      setErrorMessage(null);

      if (justCalculated) {
        setExpression(fn);
        setResult(fn);
        setJustCalculated(false);
        return;
      }

      setExpression((prev) => prev + fn);
      setResult((prev) => (prev === '0' ? fn : prev + fn));
    },
    [justCalculated]
  );

  // Toggle positive/negative sign of the active number
  const handleToggleSign = useCallback(() => {
    playKeySound('action');
    setErrorMessage(null);

    if (justCalculated && result !== '0' && result !== 'Error') {
      const num = parseFloat(result);
      const inverted = (-num).toString();
      setExpression(inverted);
      setResult(inverted);
      setJustCalculated(false);
      return;
    }

    if (!expression || expression === '0') {
      setExpression('-');
      setResult('-');
      return;
    }

    // Toggle sign on the last number token
    const match = expression.match(/(-?[0-9.]+)$/);
    if (match) {
      const lastNum = match[0];
      let toggled = '';
      if (lastNum.startsWith('-')) {
        toggled = lastNum.slice(1);
      } else {
        toggled = `-${lastNum}`;
      }
      const newExpr = expression.slice(0, -lastNum.length) + toggled;
      setExpression(newExpr);
      setResult(newExpr);
    } else {
      setExpression((prev) => prev + '-');
      setResult((prev) => prev + '-');
    }
  }, [expression, result, justCalculated]);

  // Evaluate final result
  const handleCalculate = useCallback(() => {
    playKeySound('equals');
    if (!expression || expression.trim() === '') return;

    const evalResult = evaluateExpression(expression, angleMode);

    if (evalResult.success) {
      setResult(evalResult.result);
      setPreview(null);
      setErrorMessage(null);
      setJustCalculated(true);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression,
        result: evalResult.result,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]); // keep up to 50 items
    } else {
      setErrorMessage(evalResult.error || 'Syntax Error');
      setJustCalculated(true);
    }
  }, [expression, angleMode]);

  // Memory Functions
  const handleMemoryClear = () => {
    playKeySound('action');
    setMemory(0);
  };

  const handleMemoryRecall = () => {
    playKeySound('number');
    handleNumber(memory.toString());
  };

  const handleMemoryAdd = () => {
    playKeySound('action');
    const currentVal = parseFloat(result) || 0;
    setMemory((prev) => prev + currentVal);
  };

  const handleMemorySubtract = () => {
    playKeySound('action');
    const currentVal = parseFloat(result) || 0;
    setMemory((prev) => prev - currentVal);
  };

  // History operations
  const handleSelectHistory = (item: HistoryItem) => {
    playKeySound('action');
    setExpression(item.result);
    setResult(item.result);
    setJustCalculated(false);
    setIsHistoryOpen(false);
  };

  const handleClearHistory = () => {
    playKeySound('action');
    setHistory([]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    playKeySound('action');
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside any form input or modal
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key;

      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        handleNumber(key);
      } else if (key === '.') {
        e.preventDefault();
        handleNumber('.');
      } else if (key === '+' || key === '-') {
        e.preventDefault();
        handleOperator(key);
      } else if (key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (key === '%') {
        e.preventDefault();
        handleOperator('%');
      } else if (key === '^') {
        e.preventDefault();
        handleOperator('^');
      } else if (key === '(' || key === ')') {
        e.preventDefault();
        handleFunction(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleOperator, handleFunction, handleCalculate, handleBackspace, handleClear]);

  return (
    <div
      id="calculator-app"
      className="min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-2.5 sm:p-6 font-sans antialiased selection:bg-amber-500 selection:text-black relative overflow-x-hidden safe-area-inset"
    >
      {/* Ambient background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Main Calculator Shell */}
      <main
        id="calculator-card"
        className={`relative z-10 w-full bg-slate-900/95 border border-slate-800/90 rounded-3xl p-3.5 sm:p-6 shadow-2xl backdrop-blur-md transition-all duration-300 ${
          mode === 'scientific' ? 'max-w-md' : 'max-w-sm'
        }`}
      >
        {/* Header Bar */}
        <Header
          mode={mode}
          onModeChange={setMode}
          historyCount={history.length}
          onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
          isHistoryOpen={isHistoryOpen}
        />

        {/* Display Screen */}
        <Display
          expression={expression}
          result={result}
          preview={preview}
          angleMode={angleMode}
          onToggleAngleMode={handleToggleAngleMode}
          calculatorMode={mode}
          hasMemory={memory !== 0}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onBackspace={handleBackspace}
          errorMessage={errorMessage}
        />

        {/* Keypad */}
        <Keypad
          mode={mode}
          angleMode={angleMode}
          onNumber={handleNumber}
          onOperator={handleOperator}
          onClear={handleClear}
          onBackspace={handleBackspace}
          onCalculate={handleCalculate}
          onFunction={handleFunction}
          onToggleSign={handleToggleSign}
          onMemoryClear={handleMemoryClear}
          onMemoryRecall={handleMemoryRecall}
          onMemoryAdd={handleMemoryAdd}
          onMemorySubtract={handleMemorySubtract}
        />
      </main>

      {/* History Slide-over Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
      />
    </div>
  );
}
