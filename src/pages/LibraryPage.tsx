import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Clock3, Layers3, Play, Sparkles, Trash2, Trophy } from 'lucide-react';
import type { Lesson } from '@/types/lesson';
import { getSavedLessons, deleteLesson } from '@/utils/lessonStorage';
import { demoLesson } from '@/data/demoLesson';

export function LibraryPage() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => setLessons(getSavedLessons()), []);
  const handleDelete = (id: string) => { deleteLesson(id); setLessons(getSavedLessons()); setDeleteConfirm(null); };
  const allLessons = [demoLesson, ...lessons.filter((lesson) => lesson.id !== demoLesson.id)];

  return (
    <main className="noise min-h-[calc(100vh-72px)]">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex flex-col justify-between gap-6 border-b border-white/[.08] pb-10 sm:flex-row sm:items-end">
          <div><div className="eyebrow mb-4 flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" /> Your learning archive</div><h1 className="display text-5xl text-white">Lesson library.</h1><p className="mt-4 max-w-lg text-sm leading-6 text-slate-500">A quiet place for the concepts you’ve taken apart. Replay a scene, revisit the transcript, or test your understanding.</p></div>
          <button onClick={() => navigate('/')} className="button-primary flex w-fit items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"><Sparkles className="h-4 w-4" /> Create lesson</button>
        </motion.div>

        {allLessons.length === 0 ? <div className="panel rounded-2xl px-6 py-20 text-center"><BookOpen className="mx-auto mb-4 h-10 w-10 text-slate-600" /><h2 className="text-lg font-semibold text-white">Your archive is empty</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Generate a visual lesson and it will appear here for your next study session.</p></div> : <div className="grid gap-4 md:grid-cols-2">{allLessons.map((lesson, index) => <motion.article key={lesson.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }} className="lift group relative overflow-hidden rounded-2xl border border-white/[.08] bg-[#0d1d30]/70 p-6"><div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-300/[.04] blur-2xl" /><div className="relative"><div className="mb-7 flex items-center justify-between"><div className="flex items-center gap-2"><span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">{lesson.difficulty}</span>{lesson.isDemo && <span className="rounded-full bg-orange-200/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-orange-200">Demo</span>}</div>{!lesson.isDemo && <button onClick={() => setDeleteConfirm(lesson.id)} className="rounded-lg p-2 text-slate-600 transition hover:bg-[#ff8a6b]/10 hover:text-[#ff9a82]" aria-label={`Delete ${lesson.title}`}><Trash2 className="h-4 w-4" /></button>}</div><h2 className="max-w-md text-xl font-semibold tracking-tight text-white">{lesson.title}</h2><p className="mt-2 text-sm text-slate-500">{lesson.topic}</p><div className="my-6 grid grid-cols-3 gap-2 border-y border-white/[.07] py-4 text-xs text-slate-500"><span className="flex items-center gap-1.5"><Layers3 className="h-3.5 w-3.5 text-cyan-300" />{lesson.scenes.length} scenes</span><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-orange-200" />{lesson.scenes.reduce((total, scene) => total + scene.duration, 0)} sec</span><span className="flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5 text-lime-300" />{lesson.quiz.length} quiz</span></div><div className="mb-6"><div className="mb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-600">You’ll explore</div><ul className="space-y-1.5">{lesson.objectives.slice(0, 2).map((objective) => <li key={objective} className="flex gap-2 text-xs leading-5 text-slate-400"><span className="mt-2 h-1 w-1 flex-none rounded-full bg-cyan-300" />{objective}</li>)}</ul></div><button onClick={() => navigate(`/lesson/${lesson.id}`)} className="button-secondary flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold"><Play className="h-4 w-4 text-cyan-300" /> Open lesson <ArrowRight className="h-4 w-4" /></button></div></motion.article>)}</div>}

        <AnimatePresence>{deleteConfirm && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#07111f]/85 p-4 backdrop-blur-md" onClick={() => setDeleteConfirm(null)}><motion.div initial={{ opacity: 0, y: 12, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .97 }} onClick={(event) => event.stopPropagation()} className="panel max-w-sm rounded-2xl p-6"><Trash2 className="mb-5 h-8 w-8 text-[#ff9a82]" /><h3 className="text-lg font-semibold text-white">Delete this lesson?</h3><p className="mt-2 text-sm leading-6 text-slate-500">The saved lesson will be removed from this browser.</p><div className="mt-6 flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="button-secondary flex-1 rounded-lg py-2.5 text-sm">Cancel</button><button onClick={() => handleDelete(deleteConfirm)} className="flex-1 rounded-lg bg-[#ff8a6b] py-2.5 text-sm font-semibold text-[#07111f]">Delete</button></div></motion.div></motion.div>}</AnimatePresence>
      </div>
    </main>
  );
}
