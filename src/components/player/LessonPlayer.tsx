import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Clock,
  List,
  FileText,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import type { Lesson } from '@/types/lesson';
import { VisualRenderer } from '@/components/visuals/VisualRenderer';
import { CodePanel } from './CodePanel';
import { Quiz } from './Quiz';
import { useSpeech } from '@/hooks/useSpeech';

interface LessonPlayerProps {
  lesson: Lesson;
  onNewLesson: () => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

type PanelTab = 'playlist' | 'transcript' | 'quiz';

export function LessonPlayer({ lesson, onNewLesson }: LessonPlayerProps) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState<PanelTab>('playlist');
  const [animationStep, setAnimationStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentScene = lesson.scenes[currentSceneIdx];
  const sceneDuration = currentScene.duration;
  const totalDuration = lesson.scenes.reduce((acc, s) => acc + s.duration, 0);

  const goToNextScene = useCallback(() => {
    setCurrentSceneIdx((prev) => {
      if (prev + 1 >= lesson.scenes.length) {
        setIsPlaying(false);
        setShowQuiz(true);
        setActiveTab('quiz');
        return prev;
      }
      return prev + 1;
    });
    setElapsed(0);
    setAnimationStep(0);
  }, [lesson.scenes.length]);

  const goToPrevScene = useCallback(() => {
    setCurrentSceneIdx((prev) => Math.max(0, prev - 1));
    setElapsed(0);
    setAnimationStep(0);
  }, []);

  const goToScene = useCallback((idx: number) => {
    setCurrentSceneIdx(idx);
    setElapsed(0);
    setAnimationStep(0);
    setShowQuiz(false);
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentSceneIdx(0);
    setElapsed(0);
    setAnimationStep(0);
    setIsPlaying(false);
    setShowQuiz(false);
    setActiveTab('playlist');
  }, []);

  const { speak, cancel: cancelSpeech, isMuted, toggleMute, isSupported } = useSpeech({
    onEnd: goToNextScene,
  });

  // Play narration when scene changes and is playing
  useEffect(() => {
    if (isPlaying && !isMuted && currentScene) {
      speak(currentScene.narration);
    }
    return () => {
      cancelSpeech();
    };
  }, [currentSceneIdx, isPlaying]);

  // Main timer
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1 * speed;
        const progress = next / sceneDuration;

        // Update animation step based on scene duration
        const totalSteps =
          currentScene.visualType === 'counter-loop'
            ? (currentScene.visualParams.loopIterations?.length ?? 1)
            : currentScene.visualType === 'code-execution'
              ? (currentScene.visualParams.loopIterations?.length ?? 1)
              : currentScene.visualType === 'input-output-flow'
                ? (currentScene.visualParams.flowSteps?.length ?? 1)
                : 1;
        const newStep = Math.min(Math.floor(progress * totalSteps), totalSteps - 1);
        setAnimationStep(newStep);

        if (next >= sceneDuration) {
          if (isMuted) {
            goToNextScene();
          }
          return 0;
        }
        return next;
      });
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, speed, sceneDuration, currentScene, isMuted, goToNextScene]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalElapsed =
    lesson.scenes.slice(0, currentSceneIdx).reduce((acc, s) => acc + s.duration, 0) + elapsed;
  const totalProgress = (totalElapsed / totalDuration) * 100;

  const timelineMarkers = lesson.scenes.map((s, idx) => ({
    idx,
    position: (lesson.scenes.slice(0, idx).reduce((acc, sc) => acc + sc.duration, 0) / totalDuration) * 100,
    width: (s.duration / totalDuration) * 100,
  }));

  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      {/* Main player area */}
      <div className="flex-1">
        {/* Video canvas */}
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/[.1] bg-[#091827] shadow-[0_30px_80px_rgba(0,0,0,.3)]">
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Scene visual */}
          <div className="absolute inset-0">
            {showQuiz ? (
              <div className="flex h-full items-center justify-center p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <HelpCircle className="mx-auto mb-4 h-16 w-16 text-cyan-400" />
                  <h2 className="mb-2 text-2xl font-bold text-white">Quiz Time!</h2>
                  <p className="text-slate-400">Check your understanding in the panel below</p>
                </motion.div>
              </div>
            ) : (
              <VisualRenderer scene={currentScene} animationStep={animationStep} />
            )}
          </div>

          {/* Scene title overlay */}
          {!showQuiz && (
            <div className="absolute left-0 top-0 right-0 bg-gradient-to-b from-slate-950/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-cyan-400">
                    Scene {currentSceneIdx + 1} of {lesson.scenes.length}
                  </div>
                  <h2 className="text-lg font-bold text-white">{currentScene.title}</h2>
                </div>
                <div className="rounded-lg bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
                  {currentScene.objective}
                </div>
              </div>
            </div>
          )}

          {/* Caption overlay */}
          {!showQuiz && currentScene.captions && currentScene.captions.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6 pt-12">
              <motion.div
                key={animationStep + '-' + currentSceneIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-2xl rounded-lg bg-slate-950/70 px-4 py-2 text-center text-sm font-medium text-white backdrop-blur"
              >
                {currentScene.captions[
                  Math.min(
                    Math.floor((elapsed / sceneDuration) * currentScene.captions.length),
                    currentScene.captions.length - 1
                  )
                ]}
              </motion.div>
            </div>
          )}
        </div>

        {/* Code panel */}
        {!showQuiz && currentScene.codeSnippet && (
          <div className="code-surface mt-4 h-48 overflow-hidden rounded-2xl">
            <CodePanel
              code={currentScene.codeSnippet}
              highlightedLines={currentScene.highlightedLines ?? []}
            />
          </div>
        )}

        {/* Controls */}
        <div className="panel mt-4 rounded-2xl p-4">
          {/* Timeline */}
          <div className="mb-3">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
              {/* Scene markers */}
              {timelineMarkers.map((marker) => (
                <div
                  key={marker.idx}
                  className="absolute top-0 h-full border-r border-slate-700"
                  style={{ left: `${marker.position}%`, width: `${marker.width}%` }}
                />
              ))}
              {/* Progress */}
              <motion.div
                className="absolute top-0 h-full bg-cyan-300"
                style={{ width: `${totalProgress}%` }}
              />
              {/* Current scene marker */}
              {timelineMarkers.map((marker) => (
                <div
                  key={`dot-${marker.idx}`}
                  className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all ${
                    marker.idx === currentSceneIdx
                      ? 'scale-125 border-cyan-300 bg-cyan-400'
                      : marker.idx < currentSceneIdx
                        ? 'border-orange-200 bg-orange-200'
                        : 'border-slate-600 bg-slate-700'
                  }`}
                  style={{ left: `${marker.position + marker.width / 2}%` }}
                />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-xs text-slate-400">
              <span>{formatTime(totalElapsed)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRestart}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
                title="Restart"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={goToPrevScene}
                disabled={currentSceneIdx === 0}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30"
                title="Previous scene"
              >
                <SkipBack className="h-4 w-4" />
              </button>
              <button
                onClick={handlePlayPause}
                className="button-primary flex h-11 w-11 items-center justify-center rounded-full"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
              </button>
              <button
                onClick={goToNextScene}
                disabled={currentSceneIdx === lesson.scenes.length - 1 && !showQuiz}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30"
                title="Next scene"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Speed control */}
              <div className="flex items-center gap-1 rounded-lg bg-slate-800/60 px-2 py-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="bg-transparent text-xs text-slate-300 outline-none"
                >
                  {SPEED_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-slate-800">
                      {s}x
                    </option>
                  ))}
                </select>
              </div>

              {/* Mute control */}
              <button
                onClick={toggleMute}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                  isMuted
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-cyan-400 hover:bg-cyan-500/10'
                }`}
                title={isMuted ? 'Unmute narration' : 'Mute narration'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* TTS unsupported notice */}
          {!isSupported && (
            <div className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300">
              Voice narration is not available in this browser. Captions are shown instead.
            </div>
          )}
        </div>
      </div>

      {/* Side panel */}
      <div className="w-full lg:w-[25rem]">
        <div className="panel overflow-hidden rounded-2xl">
          {/* Tabs */}
          <div className="flex border-b border-slate-700/50">
            <button
              onClick={() => setActiveTab('playlist')}
              className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium transition-colors ${
                activeTab === 'playlist'
                  ? 'border-b-2 border-cyan-400 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              Scenes
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium transition-colors ${
                activeTab === 'transcript'
                  ? 'border-b-2 border-cyan-400 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Transcript
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium transition-colors ${
                activeTab === 'quiz'
                  ? 'border-b-2 border-cyan-400 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Quiz
            </button>
          </div>

          {/* Tab content */}
          <div className="max-h-[600px] overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              {activeTab === 'playlist' && (
                <motion.div
                  key="playlist"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-2"
                >
                  {lesson.scenes.map((scene, idx) => (
                    <button
                      key={scene.sceneId}
                      onClick={() => goToScene(idx)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                        idx === currentSceneIdx
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          idx === currentSceneIdx
                            ? 'bg-cyan-500 text-white'
                            : idx < currentSceneIdx
                              ? 'bg-orange-200/70 text-[#07111f]'
                              : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-white">
                          {scene.title}
                        </div>
                        <div className="text-xs text-slate-400">{scene.duration}s</div>
                      </div>
                      {idx === currentSceneIdx && (
                        <ChevronRight className="h-4 w-4 flex-shrink-0 text-cyan-400" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}

              {activeTab === 'transcript' && (
                <motion.div
                  key="transcript"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  {lesson.scenes.map((scene, idx) => (
                    <div
                      key={scene.sceneId}
                      className={`rounded-lg border p-3 ${
                        idx === currentSceneIdx
                          ? 'border-cyan-400/50 bg-cyan-500/5'
                          : 'border-slate-700/50 bg-slate-800/20'
                      }`}
                    >
                      <div className="mb-1.5 text-xs font-medium text-cyan-300">
                        Scene {idx + 1}: {scene.title}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-300">
                        {scene.narration}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'quiz' && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {!showQuiz && currentSceneIdx < lesson.scenes.length - 1 ? (
                    <div className="py-8 text-center">
                      <HelpCircle className="mx-auto mb-3 h-12 w-12 text-slate-600" />
                      <p className="text-sm text-slate-400">
                        The quiz will appear after you finish all scenes.
                      </p>
                      <button
                        onClick={() => {
                          setShowQuiz(true);
                          handlePlayPause();
                        }}
                        className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-400"
                      >
                        Skip to Quiz
                      </button>
                    </div>
                  ) : (
                    <Quiz
                      questions={lesson.quiz}
                      onReplay={handleRestart}
                      onNewLesson={onNewLesson}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
