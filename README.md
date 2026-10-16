# CodeVision AI

**Don't Just Read Code. Watch It Come Alive.**

CodeVision AI is an interactive teaching platform that converts programming topics into animated visual lessons. Instead of reading static text, students watch synchronized animations, code highlighting, narration, and captions that explain concepts step by step.

## Features

- **Visual Lesson Player** — Cinematic 16:9 canvas with animated SVG/CSS visuals, synchronized code panel with line-by-line highlighting, narration captions, and a timeline with scene markers.
- **AI Lesson Generation** — Enter any C programming topic and get a structured visual lesson with 6–10 animated scenes, narration, code examples, and a quiz. Powered by OpenAI with JSON structured output.
- **Preloaded Demo Lesson** — A polished 9-scene lesson on C for loops works immediately without any AI configuration.
- **Browser Speech Synthesis** — Narration is read aloud using the Web Speech API, with mute controls and graceful fallback when voices are unavailable.
- **Scene Playlist & Transcript** — Jump to any scene, read the full transcript, or take the end-of-lesson quiz.
- **Quiz with Explanations** — Three questions per lesson with answer explanations and scoring.
- **Lesson Library** — Saved lessons persist in local storage. Replay or delete them anytime.
- **Responsive Design** — Works on desktop, tablet, and mobile.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion + SVG/CSS |
| Routing | React Router |
| AI Backend | Supabase Edge Function (Deno) |
| AI Provider | OpenAI (configurable) |
| Narration | Web Speech API (browser TTS) |
| Storage | LocalStorage (lessons) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

### Build

```bash
npm run build
npm run preview
```

## Environment Variables

The app uses Supabase for the AI generation backend. The following are pre-configured:

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (safe for frontend) |

### AI Provider Setup

To enable AI-generated lessons, set the `OPENAI_API_KEY` secret on the Supabase Edge Function:

```bash
# Using Supabase dashboard: Project Settings → Edge Functions → Secrets
OPENAI_API_KEY=sk-your-key-here
```

If no key is configured, the app falls back to the preloaded demo lesson so the platform remains fully functional.

## Architecture

```
src/
├── components/
│   ├── layout/
│   │   └── Navbar.tsx              # Top navigation bar
│   ├── player/
│   │   ├── CodePanel.tsx           # C code viewer with line highlighting
│   │   ├── LessonPlayer.tsx        # Main player: timeline, controls, narration
│   │   └── Quiz.tsx                # End-of-lesson quiz component
│   └── visuals/
│       ├── VisualComponents.tsx     # Individual animation components
│       └── VisualRenderer.tsx       # Maps scene → visual component
├── data/
│   └── demoLesson.ts               # Preloaded C for-loops lesson (9 scenes)
├── hooks/
│   └── useSpeech.ts                # Web Speech API wrapper
├── pages/
│   ├── HomePage.tsx                # Dashboard with topic input
│   ├── GeneratePage.tsx            # Generation progress workspace
│   ├── LessonPage.tsx              # Lesson player page
│   └── LibraryPage.tsx             # Saved lessons
├── types/
│   └── lesson.ts                   # Lesson & Scene TypeScript schema
└── utils/
    └── lessonStorage.ts            # LocalStorage persistence

supabase/
├── config.toml
└── functions/
    └── generate-lesson/
        └── index.ts                # AI lesson generation endpoint
```

## Visual Teaching Engine

The visual engine maps predefined animation types to React components:

| Visual Type | Component | Used For |
|---|---|---|
| `variable-box` | VariableBox | Showing variables in memory |
| `condition-gate` | ConditionGate | True/false condition checks |
| `counter-loop` | CounterLoop | Loop iterations with counter values |
| `input-output-flow` | InputOutputFlow | Data flow from process to output |
| `code-execution` | CodeExecutionView | Full execution trace replay |
| `generic-explanation` | GenericExplanation | Conceptual boxes and summaries |

Unsupported visual types safely fall back to `generic-explanation`.

## Demo Lesson: C For Loops

The preloaded demo covers `for (int i = 1; i <= 5; i++) { printf("%d ", i); }` across 9 scenes:

1. The Problem — Why manual repetition is bad
2. Meet the Loop — Anatomy of a for loop
3. Initialize — `int i = 1` variable box
4. Check the Condition — `i <= 5` gate with TRUE result
5. Execute the Body — `printf` outputs to console
6. Update the Counter — `i++` increments across iterations
7. The Loop Terminates — `i = 6`, condition is FALSE
8. Complete Execution — Full synchronized replay
9. Recap and Quiz — Summary + 3 questions

## Video Export

The scene definitions are independent from the player, allowing a video rendering service (e.g., Remotion) to be added later. The current version provides the interactive animated player. MP4 export will be available when a rendering service is configured.

## License

MIT
