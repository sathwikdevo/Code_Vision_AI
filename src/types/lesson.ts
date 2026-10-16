export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type VisualType =
  | 'variable-box'
  | 'data-type'
  | 'counter-loop'
  | 'condition-gate'
  | 'array-cells'
  | 'function-flow'
  | 'stack-diagram'
  | 'input-output-flow'
  | 'code-execution'
  | 'correct-vs-incorrect'
  | 'generic-explanation';

export interface VisualParams {
  variableName?: string;
  variableValue?: string | number;
  variableType?: string;
  condition?: string;
  conditionResult?: boolean | null;
  arrayData?: Array<{ index: number; value: string | number }>;
  highlightIndices?: number[];
  consoleOutput?: string[];
  currentOutputLine?: number;
  loopIterations?: LoopIteration[];
  currentIteration?: number;
  flowSteps?: FlowStep[];
  currentStep?: number;
  stackFrames?: StackFrame[];
  correctCode?: string;
  incorrectCode?: string;
  explanation?: string;
  boxes?: Array<{ label: string; value: string; color?: string }>;
  highlightBoxIndex?: number;
  title?: string;
  subtitle?: string;
  pointers?: Array<{ name: string; target: string }>;
  memoryAddresses?: Array<{ address: string; variable: string; value: string }>;
  highlightedAddress?: string;
}

export interface LoopIteration {
  iteration: number;
  variableValue: string | number;
  condition: string;
  conditionResult: boolean;
  output?: string;
  phase: 'init' | 'check' | 'body' | 'update' | 'end';
}

export interface FlowStep {
  label: string;
  detail: string;
  type: 'call' | 'process' | 'return' | 'output';
}

export interface StackFrame {
  functionName: string;
  variables: Array<{ name: string; value: string }>;
}

export interface Scene {
  sceneId: string;
  title: string;
  duration: number;
  objective: string;
  narration: string;
  visualType: VisualType;
  visualParams: VisualParams;
  codeSnippet?: string;
  highlightedLines?: number[];
  captions?: string[];
  transition?: 'fade' | 'slide' | 'zoom' | 'none';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  topic: string;
  subject: string;
  difficulty: Difficulty;
  duration: number;
  language: string;
  teachingStyle: string;
  title: string;
  objectives: string[];
  prerequisites: string[];
  realWorldAnalogy: string;
  scenes: Scene[];
  commonMistakes: string[];
  summary: string;
  quiz: QuizQuestion[];
  createdAt: string;
  isDemo: boolean;
}

export interface GenerateLessonRequest {
  topic: string;
  subject: string;
  difficulty: Difficulty;
  duration: number;
  language: string;
  teachingStyle: string;
}

export interface GenerateLessonResponse {
  lesson: Lesson;
}
