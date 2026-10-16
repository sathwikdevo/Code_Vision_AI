import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Braces,
  Check,
  Code2,
  Database,
  GitBranch,
  Layers3,
  Play,
  Pointer,
  Repeat2,
  Sparkles,
  Timer,
} from 'lucide-react';
import type { Difficulty } from '@/types/lesson';
import { getSavedLessons } from '@/utils/lessonStorage';

const SUGGESTED_TOPICS = [
  { topic: 'Variables', icon: Database, description: 'See values move through memory' },
  { topic: 'Functions', icon: Braces, description: 'Follow calls, parameters, and returns' },
  { topic: 'Arrays', icon: Layers3, description: 'Explore indexes and contiguous data' },
  { topic: 'Pointers', icon: Pointer, description: 'Make addresses and memory tangible' },
  { topic: 'Conditions', icon: GitBranch, description: 'Watch a program choose a path' },
  { topic: 'Recursion', icon: Repeat2, description: 'Unpack the call stack step by step' },
];

const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
const DURATIONS = [
  { label: 'Quick', value: 5 },
  { label: 'Standard', value: 10 },
  { label: 'Deep dive', value: 20 },
];

export function HomePage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [duration, setDuration] = useState(10);
  const [error, setError] = useState('');
  const recentLessons = getSavedLessons().slice(0, 3);

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError('Add a concept to begin your lesson.');
      return;
    }
    setError('');
    navigate('/generate', {
      state: {
        topic: topic.trim(),
        subject: 'C Programming',
        difficulty,
        duration,
        language: 'English',
        teachingStyle: 'Visual and beginner-friendly',
      },
    });
  };

  return (
    <main className="noise overflow-hidden">
      <section className="page-grid relative border-b border-white/[.07]">
        <div className="pointer-events-none absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-cyan-400/[.07] blur-3xl" />
        <div className="pointer-events-none absolute right-[-120px] top-[-100px] h-[560px] w-[560px] rounded-full bg-orange-400/[.06] blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
            <div className="eyebrow mb-6 flex items-center gap-2"><Sparkles className="h-3.5 w-3.5" /> C programming, made visible</div>
            <h1 className="display max-w-3xl text-5xl leading-[.96] text-white sm:text-6xl lg:text-[78px]">
              Stop reading code.<br /><span className="text-cyan-300">Start seeing it.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              CodeVision turns difficult C concepts into guided visual lessons. Trace memory, follow execution, and build a mental model that sticks.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              {['Synchronized code', 'Scene-by-scene narration', 'Built for understanding'].map((item) => (
                <span key={item} className="flex items-center gap-2"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-lime-300 text-[#07111f]"><Check className="h-2.5 w-2.5" /></span>{item}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: .94, rotate: 1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: .16, duration: .7 }} className="relative mx-auto w-full max-w-[560px] [perspective:1200px]">
            <div className="absolute -right-3 top-8 hidden rounded-full border border-orange-200/20 bg-orange-200/10 px-3 py-1.5 text-[10px] uppercase tracking-[.18em] text-orange-200 sm:block">Live visual trace</div>
            <div className="relative rotate-[1.5deg] rounded-[28px] border border-white/10 bg-[#0d1d30]/90 p-3 shadow-[0_40px_90px_rgba(0,0,0,.38)] [transform-style:preserve-3d]">
              <div className="rounded-[21px] border border-cyan-200/10 bg-[#071422] p-5 sm:p-7">
                <div className="mb-8 flex items-center justify-between"><div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ff8a6b]" /><span className="h-2.5 w-2.5 rounded-full bg-[#f2c66d]" /><span className="h-2.5 w-2.5 rounded-full bg-[#b8ed8f]" /></div><span className="font-mono text-[10px] text-slate-600">lesson / pointers.c</span></div>
                <div className="font-mono text-sm leading-8 text-slate-400 sm:text-base">
                  <div><span className="text-slate-600">01</span> <span className="text-cyan-300">int</span> score <span className="text-orange-200">=</span> <span className="text-lime-300">90</span>;</div>
                  <div><span className="text-slate-600">02</span> <span className="text-cyan-300">int</span> <span className="text-orange-200">*</span> address <span className="text-orange-200">=</span> <span className="text-orange-200">&amp;</span>score;</div>
                  <div><span className="text-slate-600">03</span> <span className="text-orange-200">*</span>address <span className="text-orange-200">=</span> <span className="text-lime-300">95</span>;</div>
                </div>
                <div className="my-8 h-px bg-white/[.08]" />
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/[.07] p-3 text-center"><div className="font-mono text-lg text-white">score</div><div className="mt-1 text-[10px] uppercase tracking-widest text-cyan-300">value · 95</div></div>
                  <ArrowRight className="h-5 w-5 text-orange-200" />
                  <div className="rounded-xl border border-orange-200/20 bg-orange-200/[.06] p-3 text-center"><div className="font-mono text-lg text-white">0x100</div><div className="mt-1 text-[10px] uppercase tracking-widest text-orange-200">address</div></div>
                </div>
                <div className="mt-6 flex items-center justify-between rounded-xl border border-white/[.07] bg-white/[.025] px-3 py-2.5 text-xs"><span className="text-slate-500">animation step</span><span className="font-mono text-lime-300">03 / 06</span><span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800"><span className="block h-full w-1/2 rounded-full bg-lime-300" /></span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div><div className="eyebrow mb-4">01 / Build a lesson</div><h2 className="display max-w-sm text-4xl leading-tight text-white">Give one idea a little room to click.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">Choose a concept and we’ll turn it into a paced visual walkthrough you can pause, replay, and explore.</p></div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} className="panel rounded-2xl p-5 sm:p-7">
            <label htmlFor="topic" className="mb-3 block text-sm font-medium text-slate-300">What are you trying to understand?</label>
            <div className="flex flex-col gap-3 sm:flex-row"><input id="topic" type="text" value={topic} onChange={(event) => { setTopic(event.target.value); setError(''); }} onKeyDown={(event) => event.key === 'Enter' && handleGenerate()} placeholder="Try “pointers in C” or “how functions return values”" className="min-w-0 flex-1 rounded-xl border border-white/[.1] bg-[#071422] px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10" /> <button onClick={handleGenerate} className="button-primary flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold"><Sparkles className="h-4 w-4" /> Generate lesson</button></div>
            {error && <p className="mt-2 text-sm text-[#ff9a82]">{error}</p>}
            <div className="mt-6 grid gap-5 border-t border-white/[.08] pt-5 sm:grid-cols-2"><div><div className="mb-2 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-600">Level</div><div className="flex gap-1.5">{DIFFICULTIES.map((item) => <button key={item} onClick={() => setDifficulty(item)} className={`flex-1 rounded-lg px-2 py-2 text-xs transition ${difficulty === item ? 'bg-cyan-300 text-[#07111f] font-semibold' : 'bg-white/[.04] text-slate-500 hover:bg-white/[.08] hover:text-slate-300'}`}>{item}</button>)}</div></div><div><div className="mb-2 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-600">Pace</div><div className="flex gap-1.5">{DURATIONS.map((item) => <button key={item.value} onClick={() => setDuration(item.value)} className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs transition ${duration === item.value ? 'bg-orange-200 text-[#07111f] font-semibold' : 'bg-white/[.04] text-slate-500 hover:bg-white/[.08] hover:text-slate-300'}`}><Timer className="h-3 w-3" />{item.label}</button>)}</div></div></div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/[.07] bg-[#091827]/55"><div className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-20"><div className="mb-8 flex items-end justify-between"><div><div className="eyebrow mb-3">02 / Start somewhere</div><h2 className="display text-4xl text-white">Concepts worth seeing.</h2></div><span className="hidden text-xs text-slate-600 sm:block">Select a card to fill the lesson prompt</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{SUGGESTED_TOPICS.map((item, index) => { const Icon = item.icon; return <motion.button key={item.topic} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }} onClick={() => { setTopic(item.topic); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="lift group flex items-start gap-4 rounded-2xl border border-white/[.08] bg-[#0d1d30]/70 p-5 text-left"><span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-cyan-200/10 bg-cyan-300/[.08] text-cyan-300"><Icon className="h-5 w-5" /></span><span><span className="block text-sm font-semibold text-white">{item.topic}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{item.description}</span></span><ArrowRight className="ml-auto h-4 w-4 text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-300" /></motion.button>; })}</div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24"><div className="mb-7 flex items-end justify-between"><div><div className="eyebrow mb-3">03 / Continue learning</div><h2 className="display text-4xl text-white">Your recent thinking.</h2></div>{recentLessons.length > 0 && <button onClick={() => navigate('/library')} className="hidden items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200 sm:flex">Open library <ArrowRight className="h-4 w-4" /></button>}</div>{recentLessons.length === 0 ? <div className="panel flex flex-col items-center rounded-2xl px-6 py-14 text-center"><BookOpen className="mb-4 h-8 w-8 text-slate-600" /><p className="max-w-xs text-sm leading-6 text-slate-500">Your first lesson will live here. Start with a concept above or watch the prepared demo.</p><button onClick={() => navigate('/lesson/demo-for-loops-c')} className="button-secondary mt-6 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm"><Play className="h-4 w-4 text-cyan-300" /> Watch the loops demo</button></div> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{recentLessons.map((lesson) => <button key={lesson.id} onClick={() => navigate(`/lesson/${lesson.id}`)} className="lift rounded-2xl border border-white/[.08] bg-[#0d1d30]/70 p-5 text-left"><div className="mb-5 flex items-center justify-between"><span className="rounded-full bg-lime-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-lime-200">{lesson.difficulty}</span><span className="text-xs text-slate-600">{lesson.scenes.length} scenes</span></div><div className="text-base font-semibold text-white transition group-hover:text-cyan-300">{lesson.title}</div><div className="mt-2 text-xs text-slate-500">{lesson.topic}</div></button>)}</div>}</section>

      <footer className="border-t border-white/[.07] px-5 py-8 lg:px-10"><div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-slate-600"><span className="flex items-center gap-2"><Code2 className="h-3.5 w-3.5 text-cyan-300" /> CodeVision learning lab</span><span>Make the invisible visible.</span></div></footer>
    </main>
  );
}
