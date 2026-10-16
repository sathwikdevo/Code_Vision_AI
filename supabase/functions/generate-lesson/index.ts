import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateRequest {
  topic: string;
  subject: string;
  difficulty: string;
  duration: number;
  language: string;
  teachingStyle: string;
}

const SYSTEM_PROMPT = `You are an expert programming educator. Generate a visual programming lesson as structured JSON.

The lesson must include:
- A clear title
- 3-5 learning objectives
- 2-4 prerequisites
- A real-world analogy
- 6-10 connected scenes (each with sceneId, title, duration in seconds, objective, narration, visualType, visualParams, optional codeSnippet, highlightedLines, captions, and transition)
- 3-5 common mistakes
- A summary
- 3 quiz questions (each with question, options array, correctIndex, and explanation)

Visual types must be one of:
- "variable-box" (for showing a variable in memory)
- "condition-gate" (for condition checks with true/false result)
- "counter-loop" (for loop iterations with variable values)
- "input-output-flow" (for showing data flow from input to output)
- "code-execution" (for full program execution trace)
- "generic-explanation" (for conceptual explanations with labeled boxes)

Visual params should include relevant fields like:
- title, subtitle, explanation
- variableName, variableValue, variableType
- condition, conditionResult (boolean)
- loopIterations (array of {iteration, variableValue, condition, conditionResult, output, phase})
- consoleOutput (array of strings)
- flowSteps (array of {label, detail, type})
- boxes (array of {label, value, color}), highlightBoxIndex

Use accurate C semantics. Narration should be in simple, natural English.
Each scene should explain what happens, why it happens, and connect to the previous scene.
The requested topic is the source of truth: teach that exact concept throughout every scene.
Never reuse a for-loop lesson for a different topic. For functions, teach calls, parameters, return values, and stack flow. For arrays, teach indexes and bounds. For pointers, teach addresses and dereferencing. For recursion, teach the base case and call stack. For conditions, teach boolean evaluation and branches.

Return ONLY valid JSON, no markdown or explanation.`;

function buildUserPrompt(req: GenerateRequest): string {
  return `Generate a visual lesson for:
- Topic: ${req.topic}
- Subject: ${req.subject}
- Difficulty: ${req.difficulty}
- Duration: ~${req.duration} minutes
- Language: ${req.language}
- Teaching style: ${req.teachingStyle}

Return JSON with this structure:
{
  "title": string,
  "objectives": string[],
  "prerequisites": string[],
  "realWorldAnalogy": string,
  "scenes": [
    {
      "sceneId": string,
      "title": string,
      "duration": number,
      "objective": string,
      "narration": string,
      "visualType": "variable-box" | "condition-gate" | "counter-loop" | "input-output-flow" | "code-execution" | "generic-explanation",
      "visualParams": { ... },
      "codeSnippet": string (optional),
      "highlightedLines": number[] (optional),
      "captions": string[] (optional),
      "transition": "fade" | "slide" | "zoom" | "none"
    }
  ],
  "commonMistakes": string[],
  "summary": string,
  "quiz": [
    {
      "question": string,
      "options": string[],
      "correctIndex": number,
      "explanation": string
    }
  ]
}`;
}

async function callOpenAI(apiKey: string, req: GenerateRequest): Promise<unknown> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(req) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 429) {
      throw new Error("AI provider rate limit reached. Please try again in a moment.");
    }
    if (response.status === 401) {
      throw new Error("AI provider authentication failed. Check the API key configuration.");
    }
    throw new Error(`AI provider error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI provider returned an empty response.");
  }

  return JSON.parse(content);
}

function validateLessonStructure(lesson: unknown): boolean {
  if (!lesson || typeof lesson !== "object") return false;
  const l = lesson as Record<string, unknown>;
  if (!l.title || typeof l.title !== "string") return false;
  if (!Array.isArray(l.scenes) || l.scenes.length < 3) return false;
  if (!Array.isArray(l.quiz) || l.quiz.length < 1) return false;
  for (const scene of l.scenes as Record<string, unknown>[]) {
    if (!scene.sceneId || !scene.title || !scene.narration || !scene.visualType) {
      return false;
    }
  }
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const {
      topic,
      subject,
      difficulty,
      duration,
      language,
      teachingStyle,
    } = body as GenerateRequest;

    if (!topic || !subject) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: topic and subject" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            "AI provider is not configured. Set OPENAI_API_KEY in the edge function secrets to enable AI-generated lessons.",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const generated = await callOpenAI(apiKey, {
      topic,
      subject,
      difficulty,
      duration,
      language,
      teachingStyle,
    });

    if (!validateLessonStructure(generated)) {
      // Retry once
      const retryResult = await callOpenAI(apiKey, {
        topic,
        subject,
        difficulty,
        duration,
        language,
        teachingStyle,
      });

      if (!validateLessonStructure(retryResult)) {
        return new Response(
          JSON.stringify({
            error: "AI returned an invalid lesson structure after retry. Please try again.",
          }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const lesson = {
        ...retryResult,
        id: `lesson-${Date.now()}`,
        topic,
        subject,
        difficulty,
        duration,
        language,
        teachingStyle,
        createdAt: new Date().toISOString(),
        isDemo: false,
      };

      return new Response(JSON.stringify({ lesson }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lesson = {
      ...generated,
      id: `lesson-${Date.now()}`,
      topic,
      subject,
      difficulty,
      duration,
      language,
      teachingStyle,
      createdAt: new Date().toISOString(),
      isDemo: false,
    };

    return new Response(JSON.stringify({ lesson }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    const status = message.includes("rate limit")
      ? 429
      : message.includes("authentication")
        ? 500
        : 500;

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
// Force redeploy
