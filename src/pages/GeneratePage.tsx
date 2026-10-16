import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Film,
  Mic,
  CheckCircle2,
  Loader2,
  RotateCcw,
  X,
  Sparkles,
} from 'lucide-react';
import type { Lesson, GenerateLessonRequest } from '@/types/lesson';
import { saveLesson } from '@/utils/lessonStorage';
import { generateLocalLesson } from '@/utils/localLessonGenerator';

interface GenerateState {
  topic: string;
  subject: string;
  difficulty: string;
  duration: number;
  language: string;
  teachingStyle: string;
}

type Stage = 'planning' | 'creating-scenes' | 'preparing-narration' | 'ready' | 'error';

const STAGE_INFO: { id: Stage; label: string; icon: typeof Brain; description: string }[] = [
  {
    id: 'planning',
    label: 'Planning',
    icon: Brain,
    description: 'Analyzing topic and structuring the lesson',
  },
  {
    id: 'creating-scenes',
    label: 'Creating Scenes',
    icon: Film,
    description: 'Building animated visual scenes',
  },
  {
    id: 'preparing-narration',
    label: 'Preparing Narration',
    icon: Mic,
    description: 'Writing scene narration and captions',
  },
  {
    id: 'ready',
    label: 'Ready to Learn',
    icon: CheckCircle2,
    description: 'Lesson is validated and ready',
  },
];

export function GeneratePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as GenerateState;
  const [stage, setStage] = useState<Stage>('planning');
  const [generatedLesson, setGeneratedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelled, setIsCancelled] = useState(false);

  const topic = state.topic || 'Unknown topic';
  const difficulty = state.difficulty || 'Beginner';

  const generateLesson = useCallback(async () => {
    setIsLoading(true);
    setIsCancelled(false);
    setStage('planning');

    const request: GenerateLessonRequest = {
      topic: state.topic,
      subject: state.subject || 'C Programming',
      difficulty: state.difficulty as GenerateLessonRequest['difficulty'],
      duration: state.duration || 10,
      language: state.language || 'English',
      teachingStyle: state.teachingStyle || 'Visual and beginner-friendly',
    };

    try {
      // Use the server AI provider when configured; otherwise use the built-in generator.
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const response = await fetch(
          `${supabaseUrl}/functions/v1/generate-lesson`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${supabaseAnonKey}`,
              apikey: supabaseAnonKey,
            },
            body: JSON.stringify(request),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.lesson && validateLesson(data.lesson)) {
            setStage('creating-scenes');
            await delay(800);
            setStage('preparing-narration');
            await delay(600);
            const lesson = { ...data.lesson, isDemo: false } as Lesson;
            saveLesson(lesson);
            setGeneratedLesson(lesson);
            setStage('ready');
            setIsLoading(false);
            return;
          }
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Generation failed (${response.status})`);
      }

      throw new Error('No server AI provider configured.');
    } catch {
      if (!isCancelled) {
        const localLesson = generateLocalLesson(request);
        setStage('creating-scenes');
        await delay(500);
        setStage('preparing-narration');
        await delay(500);
        saveLesson(localLesson);
        setGeneratedLesson(localLesson);
        setStage('ready');
      }
      setIsLoading(false);
    }
  }, [state, isCancelled]);

  useEffect(() => {
    if (!state.topic) {
      navigate('/');
      return;
    }
    generateLesson();
  }, []);

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const validateLesson = (lesson: unknown): lesson is Lesson => {
    if (!lesson || typeof lesson !== 'object') return false;
    const l = lesson as Partial<Lesson>;
    return !!(
      l.title &&
      l.scenes &&
      Array.isArray(l.scenes) &&
      l.scenes.length >= 3 &&
      l.quiz &&
      Array.isArray(l.quiz) &&
      l.quiz.length >= 1
    );
  };

  const handleCancel = () => {
    setIsCancelled(true);
    setIsLoading(false);
    navigate('/');
  };

  const handleRetry = () => {
    setGeneratedLesson(null);
    generateLesson();
  };

  const handleOpenLesson = () => {
    if (generatedLesson) {
      navigate(`/lesson/${generatedLesson.id}`);
    }
  };

  const currentStageIndex = STAGE_INFO.findIndex((s) => s.id === stage);

  return (
    <main className="noise min-h-[calc(100vh-72px)] bg-[#07111f]">
      <div className="mx-auto max-w-3xl px-5 py-14 lg:px-10 lg:py-20">
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300 text-[#07111f] shadow-[0_14px_35px_rgba(49,212,223,.18)]"
          >
            <Sparkles className="h-7 w-7 text-white" />
          </motion.div>
          <h1 className="display text-4xl text-white">Generating Your Visual Lesson</h1>
          <p className="mt-2 text-xs text-slate-500">
            External AI is used when configured; otherwise the built-in lesson builder keeps this flow working.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Topic: <span className="text-cyan-300">{topic}</span>
            {' · '}
            Level: <span className="text-orange-200">{difficulty}</span>
          </p>
        </div>

        {/* Stages */}
        <div className="panel rounded-2xl p-6">
          <div className="flex flex-col gap-4">
            {STAGE_INFO.map((stageInfo, idx) => {
              const Icon = stageInfo.icon;
              const isComplete = idx < currentStageIndex;
              const isActive = idx === currentStageIndex;
              const isPending = idx > currentStageIndex;

              return (
                <motion.div
                  key={stageInfo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                    isActive
                      ? 'border-cyan-400 bg-cyan-500/5'
                      : isComplete
                        ? 'border-lime-300/30 bg-lime-300/[.05]' 
                        : 'border-slate-700/50 bg-slate-800/20'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                      isComplete
                        ? 'bg-lime-300/15 text-lime-200'
                        : isActive
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-slate-700/40 text-slate-500'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isActive && isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isActive ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium ${
                        isPending ? 'text-slate-500' : 'text-white'
                      }`}
                    >
                      {stageInfo.label}
                    </div>
                    <div className="text-xs text-slate-400">{stageInfo.description}</div>
                  </div>
                  {isActive && !isComplete && isLoading && (
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="h-2 w-2 rounded-full bg-cyan-400"
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>


          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleCancel}
              className="button-secondary flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

            {stage === 'ready' && generatedLesson ? (
              <button
                onClick={handleOpenLesson}
                className="button-primary flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold"
              >
                <Film className="h-4 w-4" />
                Open Lesson Player
              </button>
            ) : isLoading ? (
              <span className="text-xs text-slate-500">Generating...</span>
            ) : (
              <button
                onClick={handleRetry}
                className="button-primary flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
              >
                <RotateCcw className="h-4 w-4" />
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
