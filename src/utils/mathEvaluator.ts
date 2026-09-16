import { AngleMode } from '../types';

/**
 * Format a number cleanly:
 * - fixes floating point rounding glitches (e.g. 0.1 + 0.2 = 0.3)
 * - formats extreme numbers with scientific notation
 */
export function formatResult(num: number): string {
  if (isNaN(num)) return 'Error';
  if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

  // Check if it's very close to an integer
  const rounded = Math.round(num);
  if (Math.abs(num - rounded) < 1e-12) {
    return rounded.toString();
  }

  // Handle very large or very small non-zero numbers
  const absNum = Math.abs(num);
  if (absNum !== 0 && (absNum >= 1e14 || absNum < 1e-7)) {
    const expStr = num.toExponential(8);
    // Remove redundant trailing zeroes before exponent
    return expStr.replace(/(\.[0-9]*[1-9])0+e/, '$1e').replace(/\.0+e/, 'e');
  }

  // Fix precision to max 10 decimal digits
  const fixed = Number(num.toPrecision(12));
  return fixed.toString();
}

/**
 * Calculate factorial of n
 */
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid factorial');
  if (n > 170) return Infinity; // JS numbers overflow beyond 170!
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Safe parser and evaluator for math expressions.
 */
export function evaluateExpression(expr: string, angleMode: AngleMode = 'DEG'): { success: boolean; result: string; error?: string } {
  if (!expr || expr.trim() === '') {
    return { success: true, result: '0' };
  }

  try {
    let clean = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, `${Math.PI}`)
      .replace(/\be\b/g, `${Math.E}`);

    // Automatically balance unclosed parentheses
    const openParen = (clean.match(/\(/g) || []).length;
    const closeParen = (clean.match(/\)/g) || []).length;
    if (openParen > closeParen) {
      clean += ')'.repeat(openParen - closeParen);
    }

    // Tokenizer
    const tokens: string[] = [];
    let i = 0;
    while (i < clean.length) {
      const ch = clean[i];

      if (/\s/.test(ch)) {
        i++;
        continue;
      }

      // Check numbers (including decimals)
      if (/[0-9.]/.test(ch)) {
        let numStr = '';
        while (i < clean.length && /[0-9.]/.test(clean[i])) {
          numStr += clean[i];
          i++;
        }
        tokens.push(numStr);
        continue;
      }

      // Check identifier/functions (sin, cos, tan, log, ln, sqrt, etc.)
      if (/[a-zA-Z]/.test(ch)) {
        let idStr = '';
        while (i < clean.length && /[a-zA-Z0-9]/.test(clean[i])) {
          idStr += clean[i];
          i++;
        }
        tokens.push(idStr);
        continue;
      }

      // Single character operators/symbols
      if ('+-*/%^()!√'.includes(ch)) {
        tokens.push(ch);
        i++;
        continue;
      }

      // Unknown character
      throw new Error(`Unexpected character: ${ch}`);
    }

    // Recursive Descent Parser
    let cursor = 0;

    function peek(): string | undefined {
      return tokens[cursor];
    }

    function consume(): string {
      return tokens[cursor++];
    }

    // Grammar:
    // parseExpression -> parseAddSub
    // parseAddSub -> parseMulDiv (( '+' | '-' ) parseMulDiv)*
    // parseMulDiv -> parseExponent (( '*' | '/' | '%' ) parseExponent)*
    // parseExponent -> parseUnary ( '^' parseExponent )?
    // parseUnary -> ('+' | '-')? parsePostfix
    // parsePostfix -> parsePrimary ('!')*
    // parsePrimary -> number | function '(' expr ')' | '(' expr ')' | '√' expr

    function parseExpression(): number {
      return parseAddSub();
    }

    function parseAddSub(): number {
      let left = parseMulDiv();
      while (peek() === '+' || peek() === '-') {
        const op = consume();
        const right = parseMulDiv();
        if (op === '+') left += right;
        else left -= right;
      }
      return left;
    }

    function parseMulDiv(): number {
      let left = parseExponent();
      while (peek() === '*' || peek() === '/') {
        const op = consume();
        const right = parseExponent();
        if (op === '*') {
          left *= right;
        } else if (op === '/') {
          if (right === 0) throw new Error('Division by zero');
          left /= right;
        }
      }
      return left;
    }

    function parseExponent(): number {
      let left = parseUnary();
      if (peek() === '^') {
        consume();
        const right = parseExponent(); // right associative
        left = Math.pow(left, right);
      }
      return left;
    }

    function parseUnary(): number {
      if (peek() === '+') {
        consume();
        return parseUnary();
      }
      if (peek() === '-') {
        consume();
        return -parseUnary();
      }
      return parsePostfix();
    }

    function parsePostfix(): number {
      let val = parsePrimary();
      while (peek() === '!' || peek() === '%') {
        const op = consume();
        if (op === '!') {
          val = factorial(val);
        } else if (op === '%') {
          val = val / 100;
        }
      }
      return val;
    }

    function parsePrimary(): number {
      const token = peek();
      if (!token) {
        throw new Error('Unexpected end of input');
      }

      // Number literal
      if (!isNaN(Number(token))) {
        consume();
        return parseFloat(token);
      }

      // Square root symbol √
      if (token === '√') {
        consume();
        const arg = parseUnary();
        if (arg < 0) throw new Error('Invalid square root');
        return Math.sqrt(arg);
      }

      // Parentheses ( expr )
      if (token === '(') {
        consume();
        const val = parseExpression();
        if (peek() === ')') {
          consume();
        }
        return val;
      }

      // Functions: sin, cos, tan, asin, acos, atan, ln, log, sqrt, abs
      const fn = consume().toLowerCase();
      if (peek() === '(') {
        consume();
        const arg = parseExpression();
        if (peek() === ')') {
          consume();
        }

        const toRad = (a: number) => (angleMode === 'DEG' ? (a * Math.PI) / 180 : a);
        const fromRad = (r: number) => (angleMode === 'DEG' ? (r * 180) / Math.PI : r);

        switch (fn) {
          case 'sin':
            return Math.sin(toRad(arg));
          case 'cos':
            return Math.cos(toRad(arg));
          case 'tan': {
            // Check for 90, 270 deg etc.
            if (angleMode === 'DEG' && Math.abs(arg % 180) === 90) {
              throw new Error('Undefined');
            }
            return Math.tan(toRad(arg));
          }
          case 'asin': {
            if (arg < -1 || arg > 1) throw new Error('Domain error');
            return fromRad(Math.asin(arg));
          }
          case 'acos': {
            if (arg < -1 || arg > 1) throw new Error('Domain error');
            return fromRad(Math.acos(arg));
          }
          case 'atan':
            return fromRad(Math.atan(arg));
          case 'ln':
            if (arg <= 0) throw new Error('Domain error');
            return Math.log(arg);
          case 'log':
            if (arg <= 0) throw new Error('Domain error');
            return Math.log10(arg);
          case 'sqrt':
            if (arg < 0) throw new Error('Domain error');
            return Math.sqrt(arg);
          case 'abs':
            return Math.abs(arg);
          default:
            throw new Error(`Unknown function: ${fn}`);
        }
      }

      throw new Error(`Unexpected token: ${token}`);
    }

    const value = parseExpression();

    if (cursor < tokens.length) {
      throw new Error('Unexpected extra tokens');
    }

    return { success: true, result: formatResult(value) };
  } catch (err: any) {
    return { success: false, result: 'Error', error: err.message || 'Error' };
  }
}

/**
 * Preview result without throwing visible error when equation is in progress.
 */
export function previewEvaluation(expr: string, angleMode: AngleMode = 'DEG'): string | null {
  if (!expr || expr.trim() === '') return null;
  // If expr ends with an operator, preview evaluating the expression up to the last operator
  const trimmed = expr.trim();
  if (['+', '-', '×', '÷', '*', '/', '^', '('].includes(trimmed.slice(-1))) {
    return null;
  }
  const evalRes = evaluateExpression(trimmed, angleMode);
  if (evalRes.success && evalRes.result !== trimmed && evalRes.result !== 'Error') {
    return evalRes.result;
  }
  return null;
}
