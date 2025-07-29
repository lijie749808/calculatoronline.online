"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForOperand: boolean;
  memory: number;
  history: string[];
}

const initialState: CalculatorState = {
  display: "0",
  previousValue: null,
  operation: null,
  waitingForOperand: false,
  memory: 0,
  history: [],
};

export default function ScientificCalculator() {
  const [state, setState] = useState<CalculatorState>(initialState);

  const calculate = useCallback((firstOperand: number, secondOperand: number, operation: string): number => {
    switch (operation) {
      case "+": return firstOperand + secondOperand;
      case "-": return firstOperand - secondOperand;
      case "×": return firstOperand * secondOperand;
      case "÷": return secondOperand !== 0 ? firstOperand / secondOperand : 0;
      case "^": return Math.pow(firstOperand, secondOperand);
      default: return secondOperand;
    }
  }, []);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(state.display);

    if (state.previousValue === null) {
      setState(prev => ({
        ...prev,
        previousValue: inputValue,
        operation: nextOperation,
        waitingForOperand: true,
      }));
    } else if (state.operation) {
      const currentValue = state.previousValue || 0;
      const newValue = calculate(currentValue, inputValue, state.operation);

      setState(prev => ({
        ...prev,
        display: String(newValue),
        previousValue: newValue,
        operation: nextOperation,
        waitingForOperand: true,
        history: [...prev.history, `${currentValue} ${state.operation} ${inputValue} = ${newValue}`],
      }));
    }
  }, [state, calculate]);

  const inputNumber = useCallback((num: string) => {
    if (state.waitingForOperand) {
      setState(prev => ({
        ...prev,
        display: num,
        waitingForOperand: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        display: prev.display === "0" ? num : prev.display + num,
      }));
    }
  }, [state.waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (state.waitingForOperand) {
      setState(prev => ({
        ...prev,
        display: "0.",
        waitingForOperand: false,
      }));
    } else if (state.display.indexOf(".") === -1) {
      setState(prev => ({
        ...prev,
        display: prev.display + ".",
      }));
    }
  }, [state]);

  const clear = useCallback(() => {
    setState(prev => ({
      ...prev,
      display: "0",
    }));
  }, []);

  const clearAll = useCallback(() => {
    setState(initialState);
  }, []);

  const performFunction = useCallback((func: string) => {
    const inputValue = parseFloat(state.display);
    let result: number;

    switch (func) {
      case "sin":
        result = Math.sin((inputValue * Math.PI) / 180);
        break;
      case "cos":
        result = Math.cos((inputValue * Math.PI) / 180);
        break;
      case "tan":
        result = Math.tan((inputValue * Math.PI) / 180);
        break;
      case "ln":
        result = Math.log(inputValue);
        break;
      case "log":
        result = Math.log10(inputValue);
        break;
      case "√":
        result = Math.sqrt(inputValue);
        break;
      case "x²":
        result = inputValue * inputValue;
        break;
      case "1/x":
        result = inputValue !== 0 ? 1 / inputValue : 0;
        break;
      case "x!":
        result = inputValue >= 0 ? factorial(Math.floor(inputValue)) : 0;
        break;
      case "±":
        result = -inputValue;
        break;
      default:
        return;
    }

    setState(prev => ({
      ...prev,
      display: String(result),
      waitingForOperand: true,
      history: [...prev.history, `${func}(${inputValue}) = ${result}`],
    }));
  }, [state.display]);

  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  const insertConstant = useCallback((constant: string) => {
    let value: number;
    switch (constant) {
      case "π":
        value = Math.PI;
        break;
      case "e":
        value = Math.E;
        break;
      default:
        return;
    }

    setState(prev => ({
      ...prev,
      display: String(value),
      waitingForOperand: true,
    }));
  }, []);

  const memoryOperation = useCallback((operation: string) => {
    const inputValue = parseFloat(state.display);

    switch (operation) {
      case "MC":
        setState(prev => ({ ...prev, memory: 0 }));
        break;
      case "MR":
        setState(prev => ({ ...prev, display: String(prev.memory), waitingForOperand: true }));
        break;
      case "M+":
        setState(prev => ({ ...prev, memory: prev.memory + inputValue }));
        break;
      case "M-":
        setState(prev => ({ ...prev, memory: prev.memory - inputValue }));
        break;
    }
  }, [state.display]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;

      if (key >= "0" && key <= "9") {
        inputNumber(key);
      } else if (key === ".") {
        inputDecimal();
      } else if (key === "+") {
        performOperation("+");
      } else if (key === "-") {
        performOperation("-");
      } else if (key === "*") {
        performOperation("×");
      } else if (key === "/") {
        event.preventDefault();
        performOperation("÷");
      } else if (key === "Enter" || key === "=") {
        performOperation("=");
      } else if (key === "Escape") {
        clearAll();
      } else if (key === "Delete" || key === "c" || key === "C") {
        clear();
      } else if (key === "p" || key === "P") {
        insertConstant("π");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [inputNumber, inputDecimal, performOperation, clear, clearAll, insertConstant]);

  const buttonClass = "h-12 text-base font-medium transition-colors border";
  const numberButtonClass = cn(buttonClass, "bg-white hover:bg-gray-50 border-gray-200 text-gray-900 font-semibold");
  const operatorButtonClass = cn(buttonClass, "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold border-primary");
  const functionButtonClass = cn(buttonClass, "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700 font-medium text-sm");

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Display */}
      <Card className="mb-4 border-2">
        <CardContent className="p-4">
          <div className="text-right">
            <div className="text-3xl font-mono font-bold min-h-[2.5rem] flex items-center justify-end bg-gray-50 p-4 rounded-lg border text-gray-900">
              {state.display}
            </div>
            {state.memory !== 0 && (
              <div className="text-sm text-gray-600 mt-2 font-medium">
                Memory: {state.memory}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calculator Buttons */}
      <div className="grid grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg border-2">
        {/* Row 1 - Memory and Clear */}
        <Button className={functionButtonClass} onClick={() => memoryOperation("MC")}>MC</Button>
        <Button className={functionButtonClass} onClick={() => memoryOperation("MR")}>MR</Button>
        <Button className={functionButtonClass} onClick={() => memoryOperation("M+")}>M+</Button>
        <Button className={functionButtonClass} onClick={() => memoryOperation("M-")}>M-</Button>
        <Button className={operatorButtonClass} onClick={clearAll}>AC</Button>

        {/* Row 2 - Functions */}
        <Button className={functionButtonClass} onClick={() => performFunction("sin")}>sin</Button>
        <Button className={functionButtonClass} onClick={() => performFunction("cos")}>cos</Button>
        <Button className={functionButtonClass} onClick={() => performFunction("tan")}>tan</Button>
        <Button className={functionButtonClass} onClick={() => performFunction("ln")}>ln</Button>
        <Button className={operatorButtonClass} onClick={clear}>C</Button>

        {/* Row 3 - More Functions */}
        <Button className={functionButtonClass} onClick={() => performFunction("x²")}>x²</Button>
        <Button className={functionButtonClass} onClick={() => performFunction("√")}>√</Button>
        <Button className={functionButtonClass} onClick={() => performFunction("1/x")}>1/x</Button>
        <Button className={functionButtonClass} onClick={() => performFunction("log")}>log</Button>
        <Button className={operatorButtonClass} onClick={() => performOperation("÷")}>÷</Button>

        {/* Row 4 - Constants and Operations */}
        <Button className={functionButtonClass} onClick={() => insertConstant("π")}>π</Button>
        <Button className={functionButtonClass} onClick={() => insertConstant("e")}>e</Button>
        <Button className={functionButtonClass} onClick={() => performFunction("x!")}>x!</Button>
        <Button className={functionButtonClass} onClick={() => performFunction("±")}>±</Button>
        <Button className={operatorButtonClass} onClick={() => performOperation("×")}>×</Button>

        {/* Row 5 - Numbers */}
        <Button className={numberButtonClass} onClick={() => inputNumber("7")}>7</Button>
        <Button className={numberButtonClass} onClick={() => inputNumber("8")}>8</Button>
        <Button className={numberButtonClass} onClick={() => inputNumber("9")}>9</Button>
        <Button className={operatorButtonClass} onClick={() => performOperation("^")}>x^y</Button>
        <Button className={operatorButtonClass} onClick={() => performOperation("-")}>-</Button>

        {/* Row 6 - Numbers */}
        <Button className={numberButtonClass} onClick={() => inputNumber("4")}>4</Button>
        <Button className={numberButtonClass} onClick={() => inputNumber("5")}>5</Button>
        <Button className={numberButtonClass} onClick={() => inputNumber("6")}>6</Button>
        <Button className={numberButtonClass} onClick={() => inputNumber("(")}>( )</Button>
        <Button className={operatorButtonClass} onClick={() => performOperation("+")}>+</Button>

        {/* Row 7 - Numbers */}
        <Button className={numberButtonClass} onClick={() => inputNumber("1")}>1</Button>
        <Button className={numberButtonClass} onClick={() => inputNumber("2")}>2</Button>
        <Button className={numberButtonClass} onClick={() => inputNumber("3")}>3</Button>
        <Button className={numberButtonClass} onClick={inputDecimal}>.</Button>
        <Button className={cn("h-12 text-base font-bold transition-colors border row-span-2 bg-orange-500 hover:bg-orange-600 text-white border-orange-500")} onClick={() => performOperation("=")}>=</Button>

        {/* Row 8 - Zero */}
        <Button className={cn(numberButtonClass, "col-span-2")} onClick={() => inputNumber("0")}>0</Button>
        <Button className={cn(functionButtonClass, "text-xs")} onClick={() => navigator.clipboard?.writeText(state.display)}>
          Copy
        </Button>
        <Button className={cn(functionButtonClass, "text-xs")} onClick={() => setState(prev => ({ ...prev, history: [] }))}>
          Clear History
        </Button>
      </div>

      {/* History */}
      {state.history.length > 0 && (
        <Card className="mt-4 border-2">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-gray-900">History</h3>
            <div className="max-h-32 overflow-y-auto space-y-1 bg-gray-50 p-3 rounded-lg border">
              {state.history.slice(-5).map((entry, index) => (
                <div key={index} className="text-sm text-gray-700 font-mono font-medium">
                  {entry}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 