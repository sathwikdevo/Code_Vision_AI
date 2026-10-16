import { motion } from 'framer-motion';
import type { VisualParams } from '@/types/lesson';

const colorMap: Record<string, string> = {
  cyan: 'border-cyan-400 bg-cyan-500/10 text-cyan-300',
  violet: 'border-orange-200 bg-orange-200/10 text-orange-200',
  emerald: 'border-lime-300 bg-lime-300/10 text-lime-200',
  amber: 'border-amber-400 bg-amber-500/10 text-amber-300',
  red: 'border-red-400 bg-red-500/10 text-red-300',
  blue: 'border-blue-400 bg-blue-500/10 text-blue-300',
};

export function VariableBox({ params }: { params: VisualParams }) {
  const name = params.variableName ?? 'i';
  const value = params.variableValue ?? 0;
  const type = params.variableType ?? 'int';

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      {params.title && (
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-white"
        >
          {params.title}
        </motion.h3>
      )}
      {params.subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-sm text-cyan-300"
        >
          {params.subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative"
      >
        <div className="mb-2 text-center text-xs font-medium uppercase tracking-wider text-slate-400">
          Memory
        </div>
        <div className="rounded-xl border-2 border-cyan-400 bg-cyan-500/10 px-8 py-6 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
          <div className="mb-1 text-center text-xs text-slate-400">type: {type}</div>
          <div className="mb-2 text-center font-mono text-sm font-bold text-cyan-300">
            {name}
          </div>
          <motion.div
            key={String(value)}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg border-2 border-cyan-300/50 bg-slate-900/80 font-mono text-2xl font-bold text-white"
          >
            {value}
          </motion.div>
        </div>
      </motion.div>
      {params.explanation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-md text-center text-sm text-slate-300"
        >
          {params.explanation}
        </motion.p>
      )}
    </div>
  );
}

export function ConditionGate({ params }: { params: VisualParams }) {
  const name = params.variableName ?? 'i';
  const value = params.variableValue ?? 0;
  const condition = params.condition ?? 'i <= 5';
  const result = params.conditionResult;
  const consoleOutput = params.consoleOutput ?? [];

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6">
      {params.title && (
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-white"
        >
          {params.title}
        </motion.h3>
      )}
      <div className="flex items-center gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="rounded-xl border-2 border-cyan-400 bg-cyan-500/10 px-6 py-4 text-center"
        >
          <div className="mb-1 font-mono text-xs text-slate-400">variable</div>
          <div className="font-mono text-sm font-bold text-cyan-300">{name}</div>
          <div className="mt-2 font-mono text-3xl font-bold text-white">{value}</div>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-2xl text-slate-400"
        >
          ?
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="rounded-xl border-2 border-orange-200 bg-orange-200/10 px-6 py-4 text-center"
        >
          <div className="mb-1 font-mono text-xs text-slate-400">condition</div>
          <div className="font-mono text-sm font-bold text-orange-200">{condition}</div>
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
        className={`flex items-center gap-3 rounded-xl border-2 px-8 py-4 ${
          result === true
            ? 'border-lime-300 bg-lime-300/10'
            : result === false
              ? 'border-red-400 bg-red-500/10'
              : 'border-slate-600 bg-slate-700/20'
        }`}
      >
        <span className="font-mono text-sm text-slate-300">Result:</span>
        <span
          className={`font-mono text-2xl font-bold ${
            result === true
              ? 'text-lime-200'
              : result === false
                ? 'text-red-300'
                : 'text-slate-400'
          }`}
        >
          {result === true ? 'TRUE' : result === false ? 'FALSE' : '...'}
        </span>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 300 }}
          className={`text-3xl ${result === true ? 'text-lime-300' : 'text-red-400'}`}
        >
          {result === true ? '✓' : result === false ? '✗' : ''}
        </motion.div>
      </motion.div>

      {consoleOutput.length > 0 && (
        <div className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2 font-mono text-sm text-emerald-300">
          <span className="text-slate-500">Output: </span>
          {consoleOutput.join(' ')}
        </div>
      )}

      {params.explanation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="max-w-md text-center text-sm text-slate-300"
        >
          {params.explanation}
        </motion.p>
      )}
    </div>
  );
}

export function CounterLoop({ params }: { params: VisualParams }) {
  const iterations = params.loopIterations ?? [];
  const currentIteration = params.currentIteration ?? 0;
  const name = params.variableName ?? 'i';
  const consoleOutput = params.consoleOutput ?? [];

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6">
      {params.title && (
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-white"
        >
          {params.title}
        </motion.h3>
      )}
      <div className="flex items-center gap-3">
        {iterations.map((iter, idx) => (
          <motion.div
            key={iter.iteration}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex flex-col items-center rounded-xl border-2 px-3 py-3 ${
              idx <= currentIteration
                ? iter.conditionResult
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-red-400 bg-red-500/10'
                : 'border-slate-700 bg-slate-800/30 opacity-40'
            }`}
          >
            <div className="font-mono text-xs text-slate-400">iter {iter.iteration}</div>
            <div className="font-mono text-lg font-bold text-white">
              {name}={iter.variableValue}
            </div>
            <div
              className={`font-mono text-xs ${iter.conditionResult ? 'text-lime-200' : 'text-red-300'}`}
            >
              {iter.conditionResult ? 'TRUE' : 'FALSE'}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2"
      >
        <span className="font-mono text-xs text-slate-400">Console:</span>
        <div className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2 font-mono text-lg text-emerald-300">
          {consoleOutput.slice(0, (currentIteration ?? 0) + 1).join(' ')}
        </div>
      </motion.div>

      {params.explanation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="max-w-md text-center text-sm text-slate-300"
        >
          {params.explanation}
        </motion.p>
      )}
    </div>
  );
}

export function InputOutputFlow({ params }: { params: VisualParams }) {
  const steps = params.flowSteps ?? [];
  const currentStep = params.currentStep ?? 0;
  const consoleOutput = params.consoleOutput ?? [];

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6">
      {params.title && (
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-white"
        >
          {params.title}
        </motion.h3>
      )}
      <div className="flex flex-col items-center gap-3">
        {steps.map((step, idx) => {
          const isActive = idx <= currentStep;
          const colors: Record<string, string> = {
            call: 'border-cyan-400 bg-cyan-500/10 text-cyan-300',
            process: 'border-orange-200 bg-orange-200/10 text-orange-200',
            return: 'border-amber-400 bg-amber-500/10 text-amber-300',
            output: 'border-lime-300 bg-lime-300/10 text-lime-200',
          };
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isActive ? 1 : 0.3, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className={`flex items-center gap-3 rounded-xl border-2 px-6 py-3 ${isActive ? colors[step.type] : 'border-slate-700 bg-slate-800/20 text-slate-500'}`}
            >
              <span className="font-mono text-sm font-bold">{step.label}</span>
              <span className="text-xs opacity-70">{step.detail}</span>
            </motion.div>
          );
        })}
      </div>

      {consoleOutput.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
        >
          <div className="mb-1 text-xs text-slate-500">Output Console</div>
          <div className="font-mono text-lg text-emerald-300">
            {consoleOutput.join(' ')}
          </div>
        </motion.div>
      )}

      {params.explanation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-md text-center text-sm text-slate-300"
        >
          {params.explanation}
        </motion.p>
      )}
    </div>
  );
}

export function CodeExecutionView({ params }: { params: VisualParams }) {
  const iterations = params.loopIterations ?? [];
  const currentIteration = params.currentIteration ?? 0;
  const name = params.variableName ?? 'i';
  const consoleOutput = params.consoleOutput ?? [];
  const currentValue = iterations[currentIteration]?.variableValue ?? params.variableValue ?? 0;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6">
      {params.title && (
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-white"
        >
          {params.title}
        </motion.h3>
      )}
      {params.subtitle && (
        <p className="font-mono text-sm text-cyan-300">{params.subtitle}</p>
      )}

      <div className="flex w-full max-w-3xl gap-6">
        <div className="flex-1">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
            Variable State
          </div>
          <motion.div
            key={String(currentValue)}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="rounded-xl border-2 border-cyan-400 bg-cyan-500/10 px-6 py-4 text-center"
          >
            <div className="font-mono text-sm text-cyan-300">{name}</div>
            <div className="font-mono text-4xl font-bold text-white">{currentValue}</div>
          </motion.div>
        </div>

        <div className="flex-1">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
            Condition
          </div>
          <motion.div
            key={currentIteration}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className={`rounded-xl border-2 px-6 py-4 text-center ${
              iterations[currentIteration]?.conditionResult
                ? 'border-lime-300 bg-lime-300/10'
                : 'border-red-400 bg-red-500/10'
            }`}
          >
            <div className="font-mono text-sm text-slate-300">
              {iterations[currentIteration]?.condition ?? 'i <= 5'}
            </div>
            <div
              className={`font-mono text-2xl font-bold ${
                iterations[currentIteration]?.conditionResult
                  ? 'text-lime-200'
                  : 'text-red-300'
              }`}
            >
              {iterations[currentIteration]?.conditionResult ? 'TRUE' : 'FALSE'}
            </div>
          </motion.div>
        </div>

        <div className="flex-1">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
            Console Output
          </div>
          <div className="min-h-[80px] rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
            <div className="font-mono text-lg text-emerald-300">
              {consoleOutput.slice(0, (currentIteration ?? 0) + 1).join(' ')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {iterations.map((iter, idx) => (
          <motion.div
            key={iter.iteration}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: idx <= currentIteration ? 1 : 0.3,
              scale: idx === currentIteration ? 1.1 : 1,
            }}
            transition={{ delay: idx * 0.05 }}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 font-mono text-sm font-bold ${
              idx === currentIteration
                ? iter.conditionResult
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                  : 'border-red-400 bg-red-500/20 text-red-200'
                : idx < currentIteration
                  ? 'border-slate-600 bg-slate-800/40 text-slate-300'
                  : 'border-slate-800 bg-slate-900/20 text-slate-600'
            }`}
          >
            {iter.iteration}
          </motion.div>
        ))}
      </div>

      {params.explanation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-lg text-center text-sm text-slate-300"
        >
          {params.explanation}
        </motion.p>
      )}
    </div>
  );
}

export function GenericExplanation({ params }: { params: VisualParams }) {
  const boxes = params.boxes ?? [];
  const highlightIndex = params.highlightBoxIndex ?? -1;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6">
      {params.title && (
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-white"
        >
          {params.title}
        </motion.h3>
      )}
      {params.subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-sm text-cyan-300"
        >
          {params.subtitle}
        </motion.p>
      )}

      {boxes.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-4">
          {boxes.map((box, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: idx === highlightIndex ? 1.1 : 1,
              }}
              transition={{ delay: idx * 0.15, type: 'spring', stiffness: 200 }}
              className={`flex flex-col items-center rounded-xl border-2 px-6 py-4 ${
                colorMap[box.color ?? 'cyan'] ?? colorMap.cyan
              } ${idx === highlightIndex ? 'ring-2 ring-white/50' : ''}`}
            >
              <div className="font-mono text-xs opacity-80">{box.label}</div>
              <div className="mt-1 font-mono text-lg font-bold">{box.value}</div>
            </motion.div>
          ))}
        </div>
      )}

      {params.explanation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-xl text-center text-sm text-slate-300"
        >
          {params.explanation}
        </motion.p>
      )}
    </div>
  );
}
