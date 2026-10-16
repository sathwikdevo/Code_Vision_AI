import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, BookOpen, Clock3, Layers3, Sparkles, Trophy } from 'lucide-react';
import type { Lesson } from '@/types/lesson';
import { LessonPlayer } from '@/components/player/LessonPlayer';
import { getLessonById } from '@/utils/lessonStorage';
import { demoLesson } from '@/data/demoLesson';

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) { navigate('/'); return; }
    if (lessonId === demoLesson.id) setLesson(demoLesson);
    else setLesson(getLessonById(lessonId) ?? null);
    setLoading(false);
  }, [lessonId, navigate]);

  if (loading) return <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#07111f] text-sm text-slate-500">Preparing your lesson…</div>;
  if (!lesson) return <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#07111f] px-5"><motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel max-w-md rounded-2xl p-8 text-center"><AlertTriangle className="mx-auto mb-5 h-9 w-9 text-orange-200" /><h2 className="text-xl font-semibold text-white">Lesson not found</h2><p className="mt-2 text-sm leading-6 text-slate-500">This lesson may have been removed from your archive.</p><button onClick={() => navigate('/')} className="button-primary mt-6 rounded-lg px-5 py-2.5 text-sm font-semibold">Back to home</button></motion.div></div>;

  return <main className="noise min-h-[calc(100vh-72px)]"><div className="mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-12"><button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to home</button><motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col justify-between gap-6 border-b border-white/[.08] pb-8 lg:flex-row lg:items-end"><div><div className="eyebrow mb-4 flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" /> Visual lesson</div><div className="mb-3 flex flex-wrap items-center gap-2"><span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">{lesson.difficulty}</span><span className="rounded-full bg-orange-200/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-orange-200">{lesson.subject}</span>{lesson.isDemo && <span className="rounded-full bg-lime-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-lime-200">Demo</span>}</div><h1 className="display max-w-4xl text-4xl leading-tight text-white sm:text-5xl">{lesson.title}</h1><p className="mt-3 text-sm text-slate-500">{lesson.topic}</p></div><div className="flex shrink-0 items-center gap-5 text-xs text-slate-500"><span className="flex items-center gap-2"><Layers3 className="h-4 w-4 text-cyan-300" />{lesson.scenes.length} scenes</span><span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-orange-200" />{lesson.scenes.reduce((total, scene) => total + scene.duration, 0)} sec</span><span className="flex items-center gap-2"><Trophy className="h-4 w-4 text-lime-300" />{lesson.quiz.length} quiz</span></div></motion.header><div className="mb-8 grid gap-3 sm:grid-cols-3"><div className="panel rounded-xl p-4"><BookOpen className="mb-5 h-4 w-4 text-cyan-300" /><div className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-600">Learning objectives</div><div className="mt-2 text-sm text-white">{lesson.objectives.length} ideas to unpack</div></div><div className="panel rounded-xl p-4"><Sparkles className="mb-5 h-4 w-4 text-orange-200" /><div className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-600">Starting point</div><div className="mt-2 text-sm text-white">{lesson.prerequisites.length} foundations</div></div><div className="panel rounded-xl p-4"><Trophy className="mb-5 h-4 w-4 text-lime-300" /><div className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-600">Check your thinking</div><div className="mt-2 text-sm text-white">{lesson.quiz.length} questions</div></div></div><LessonPlayer lesson={lesson} onNewLesson={() => navigate('/')} /></div></main>;
}
