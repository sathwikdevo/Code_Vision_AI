import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RotateCcw } from 'lucide-react';
import type { QuizQuestion } from '@/types/lesson';

interface QuizProps {
  questions: QuizQuestion[];
  onReplay: () => void;
  onNewLesson: () => void;
}

export function Quiz({ questions, onReplay, onNewLesson }: QuizProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [showExplanations, setShowExplanations] = useState<(boolean)[]>(questions.map(() => false));

  const score = answers.reduce<number>((acc, ans, idx) => {
    return ans === questions[idx].correctIndex ? acc + 1 : acc;
  }, 0);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  };

  const handleSubmit = () => {
    if (answers.some((a) => a === null)) return;
    setSubmitted(true);
    setShowExplanations(questions.map(() => true));
  };

  const handleReset = () => {
    setAnswers(questions.map(() => null));
    setSubmitted(false);
    setShowExplanations(questions.map(() => false));
  };

  const allAnswered = answers.every((a) => a !== null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Test Your Understanding</h3>
          <p className="text-sm text-slate-400">Answer all three questions to see your score</p>
        </div>
        {submitted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className={`rounded-xl border-2 px-6 py-3 text-center ${
              score === questions.length
                ? 'border-emerald-400 bg-emerald-500/10'
                : score >= questions.length / 2
                  ? 'border-amber-400 bg-amber-500/10'
                  : 'border-red-400 bg-red-500/10'
            }`}
          >
            <div className="text-3xl font-bold text-white">
              {score}/{questions.length}
            </div>
            <div className="text-xs text-slate-400">
              {score === questions.length
                ? 'Perfect!'
                : score >= questions.length / 2
                  ? 'Good job!'
                  : 'Keep practicing!'}
            </div>
          </motion.div>
        )}
      </div>

      {questions.map((q, qIdx) => (
        <motion.div
          key={qIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: qIdx * 0.1 }}
          className="panel rounded-2xl p-5"
        >
          <div className="mb-3 flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">
              {qIdx + 1}
            </span>
            <p className="font-medium text-white">{q.question}</p>
          </div>

          <div className="ml-9 flex flex-col gap-2">
            {q.options.map((opt, optIdx) => {
              const isSelected = answers[qIdx] === optIdx;
              const isCorrect = optIdx === q.correctIndex;
              const showCorrect = submitted && isCorrect;
              const showWrong = submitted && isSelected && !isCorrect;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(qIdx, optIdx)}
                  disabled={submitted}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-all ${
                    showCorrect
                      ? 'border-emerald-400 bg-emerald-500/10 text-emerald-200'
                      : showWrong
                        ? 'border-red-400 bg-red-500/10 text-red-200'
                        : isSelected
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200'
                          : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-600 hover:bg-slate-800/60'
                  } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span className="font-mono text-xs uppercase">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {showCorrect && <Check className="h-4 w-4 text-emerald-400" />}
                  {showWrong && <X className="h-4 w-4 text-red-400" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showExplanations[qIdx] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-9 mt-3 rounded-lg border border-slate-700/50 bg-slate-800/40 px-4 py-3"
              >
                <div className="mb-1 text-xs font-medium text-cyan-300">Explanation</div>
                <p className="text-sm text-slate-300">{q.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      <div className="flex items-center gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`rounded-lg px-6 py-2.5 font-medium transition-all ${
              allAnswered
                ? 'bg-cyan-500 text-white hover:bg-cyan-400'
                : 'cursor-not-allowed bg-slate-700 text-slate-500'
            }`}
          >
            Submit Answers
          </button>
        ) : (
          <>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
            <button
              onClick={onReplay}
              className="button-secondary flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
            >
              Replay Lesson
            </button>
            <button
              onClick={onNewLesson}
              className="button-primary flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
            >
              New Lesson
            </button>
          </>
        )}
      </div>
    </div>
  );
}
