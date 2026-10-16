import { motion, AnimatePresence } from 'framer-motion';
import type { Scene, VisualType } from '@/types/lesson';
import {
  VariableBox,
  ConditionGate,
  CounterLoop,
  InputOutputFlow,
  CodeExecutionView,
  GenericExplanation,
} from './VisualComponents';

interface VisualRendererProps {
  scene: Scene;
  animationStep: number;
}

export function VisualRenderer({ scene, animationStep }: VisualRendererProps) {
  const visualType: VisualType = scene.visualType;
  const params = scene.visualParams;

  // For counter-loop and code-execution, we animate the iteration count
  const animatedParams = {
    ...params,
    currentIteration: visualType === 'counter-loop' || visualType === 'code-execution'
      ? Math.min(animationStep, (params.loopIterations?.length ?? 1) - 1)
      : params.currentIteration,
    currentOutputLine: visualType === 'input-output-flow'
      ? Math.min(animationStep, (params.flowSteps?.length ?? 1) - 1)
      : params.currentOutputLine,
    currentStep: visualType === 'input-output-flow'
      ? Math.min(animationStep, (params.flowSteps?.length ?? 1) - 1)
      : params.currentStep,
  };

  const renderVisual = () => {
    switch (visualType) {
      case 'variable-box':
        return <VariableBox params={animatedParams} />;
      case 'condition-gate':
        return <ConditionGate params={animatedParams} />;
      case 'counter-loop':
        return <CounterLoop params={animatedParams} />;
      case 'input-output-flow':
        return <InputOutputFlow params={animatedParams} />;
      case 'code-execution':
        return <CodeExecutionView params={animatedParams} />;
      case 'generic-explanation':
      case 'data-type':
      case 'array-cells':
      case 'function-flow':
      case 'stack-diagram':
      case 'correct-vs-incorrect':
      default:
        return <GenericExplanation params={animatedParams} />;
    }
  };

  const transitionClass = scene.transition ?? 'fade';
  const initial =
    transitionClass === 'slide' ? { x: 50, opacity: 0 } :
    transitionClass === 'zoom' ? { scale: 0.9, opacity: 0 } :
    { opacity: 0 };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene.sceneId + '-' + animationStep}
        initial={initial}
        animate={{ x: 0, scale: 1, opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="flex h-full w-full items-center justify-center"
      >
        {renderVisual()}
      </motion.div>
    </AnimatePresence>
  );
}
