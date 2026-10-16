import type { Lesson, Scene } from '@/types/lesson';

const C_CODE = `#include <stdio.h>

int main() {
    for (int i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    return 0;
}`;

const scenes: Scene[] = [
  {
    sceneId: 'scene-1',
    title: 'The Problem: Printing Five Numbers',
    duration: 8,
    objective: 'Understand why loops are needed for repetitive tasks',
    narration:
      "Imagine you are a student, and your teacher asks you to print the numbers 1 through 5 on the screen. You could write five separate printf statements, one for each number. But what if the teacher asked for 1 through 100? Or 1 through 1000? Writing each line manually would be exhausting and error-prone. This is where loops come to the rescue. A loop lets you write a task once and repeat it automatically as many times as you need.",
    visualType: 'generic-explanation',
    visualParams: {
      title: 'The Repetition Problem',
      subtitle: 'How do we print numbers without writing each line?',
      boxes: [
        { label: 'printf("1")', value: '1', color: 'cyan' },
        { label: 'printf("2")', value: '2', color: 'cyan' },
        { label: 'printf("3")', value: '3', color: 'cyan' },
        { label: '...', value: '???', color: 'amber' },
        { label: 'printf("100")', value: '100', color: 'red' },
      ],
      highlightBoxIndex: -1,
      explanation:
        'Writing each print statement manually is tedious. Loops solve this by repeating code automatically.',
    },
    captions: [
      'Print numbers 1 to 5 manually?',
      'What about 1 to 100? Or 1000?',
      'There must be a better way...',
      'Loops repeat code automatically!',
    ],
    transition: 'fade',
  },
  {
    sceneId: 'scene-2',
    title: 'Meet the For Loop',
    duration: 9,
    objective: 'Learn the three parts of a for-loop structure',
    narration:
      "Here is the for loop in C. It has three key parts inside the parentheses, separated by semicolons. The first part is initialization: we set up a counter variable, like int i equals 1. The second part is the condition: we check if i is less than or equal to 5. The third part is the update: we increase i by 1 each time using i plus plus. The body of the loop, inside the curly braces, runs each time the condition is true.",
    visualType: 'generic-explanation',
    visualParams: {
      title: 'Anatomy of a For Loop',
      subtitle: 'for (init; condition; update) { body }',
      boxes: [
        { label: 'Initialization', value: 'int i = 1', color: 'cyan' },
        { label: 'Condition', value: 'i <= 5', color: 'violet' },
        { label: 'Update', value: 'i++', color: 'emerald' },
        { label: 'Body', value: 'printf("%d ", i)', color: 'amber' },
      ],
      highlightBoxIndex: -1,
      explanation:
        'The for loop has three parts: initialization, condition, and update. The body runs while the condition is true.',
    },
    codeSnippet: C_CODE,
    highlightedLines: [5],
    captions: [
      'The for loop has 3 parts',
      '1. Initialization: int i = 1',
      '2. Condition: i <= 5',
      '3. Update: i++',
      'The body runs while the condition is true',
    ],
    transition: 'slide',
  },
  {
    sceneId: 'scene-3',
    title: 'Step 1: Initialize the Counter',
    duration: 7,
    objective: 'See how the loop counter variable is created and initialized',
    narration:
      "Let's start with the first part: initialization. The code says int i equals 1. This creates a variable named i, stored in memory like a box, and puts the value 1 inside it. This variable i is our counter. It will keep track of where we are in the loop. At this moment, i holds the value 1.",
    visualType: 'variable-box',
    visualParams: {
      variableName: 'i',
      variableValue: 1,
      variableType: 'int',
      title: 'Initialization',
      subtitle: 'int i = 1',
      explanation:
        'A variable named i is created in memory and set to 1. This is our loop counter.',
    },
    codeSnippet: C_CODE,
    highlightedLines: [5],
    captions: [
      'Initialization: int i = 1',
      'A variable box named "i" is created',
      'The value 1 is placed inside',
      'i is our loop counter',
    ],
    transition: 'fade',
  },
  {
    sceneId: 'scene-4',
    title: 'Step 2: Check the Condition',
    duration: 8,
    objective: 'Understand how the condition controls whether the loop continues',
    narration:
      "Before running the body, the loop checks the condition: is i less than or equal to 5? Right now, i is 1, and 1 is indeed less than or equal to 5. So the condition is true, and the loop body will execute. Think of the condition as a gate. If the condition is true, the gate opens and the body runs. If it is false, the gate stays closed and the loop stops.",
    visualType: 'condition-gate',
    visualParams: {
      variableName: 'i',
      variableValue: 1,
      condition: 'i <= 5',
      conditionResult: true,
      title: 'Condition Check',
      subtitle: 'Is i <= 5?',
      explanation:
        'The condition acts like a gate. True means the body runs. False means the loop stops.',
    },
    codeSnippet: C_CODE,
    highlightedLines: [5],
    captions: [
      'Condition: i <= 5',
      'i is 1, and 1 <= 5 is TRUE',
      'The gate opens!',
      'The loop body will execute',
    ],
    transition: 'zoom',
  },
  {
    sceneId: 'scene-5',
    title: 'Step 3: Execute the Body',
    duration: 8,
    objective: 'Watch the loop body produce output',
    narration:
      "Now the body runs. The code says printf percent d space, i. This prints the current value of i, which is 1, followed by a space. The number 1 appears on the output console. After this, the loop is not done. It will come back and do this again for the next values of i.",
    visualType: 'input-output-flow',
    visualParams: {
      variableName: 'i',
      variableValue: 1,
      consoleOutput: ['1'],
      currentOutputLine: 0,
      flowSteps: [
        { label: 'i = 1', detail: 'Current value of i', type: 'process' },
        { label: 'printf("%d ", i)', detail: 'Print value of i', type: 'output' },
        { label: 'Output: 1', detail: 'Console shows 1', type: 'output' },
      ],
      currentStep: 2,
      title: 'Executing the Body',
      subtitle: 'printf("%d ", i) prints the value of i',
      explanation: 'The printf statement outputs the current value of i to the console.',
    },
    codeSnippet: C_CODE,
    highlightedLines: [6],
    captions: [
      'Body: printf("%d ", i)',
      'i is 1, so it prints "1 "',
      'The console shows: 1',
      'The loop will continue...',
    ],
    transition: 'fade',
  },
  {
    sceneId: 'scene-6',
    title: 'Step 4: Update the Counter',
    duration: 7,
    objective: 'See how the counter changes after each iteration',
    narration:
      "After the body finishes, the update part runs: i plus plus. This increases the value of i by 1. So i goes from 1 to 2. Now the loop goes back to check the condition again. Is 2 less than or equal to 5? Yes, it is. So the body runs again, printing 2. Then i becomes 3, the condition is checked, the body prints 3. This cycle continues: i becomes 4, prints 4. Then i becomes 5, prints 5.",
    visualType: 'counter-loop',
    visualParams: {
      variableName: 'i',
      variableValue: 2,
      loopIterations: [
        { iteration: 1, variableValue: 1, condition: 'i <= 5', conditionResult: true, output: '1', phase: 'update' },
        { iteration: 2, variableValue: 2, condition: 'i <= 5', conditionResult: true, output: '2', phase: 'update' },
        { iteration: 3, variableValue: 3, condition: 'i <= 5', conditionResult: true, output: '3', phase: 'update' },
        { iteration: 4, variableValue: 4, condition: 'i <= 5', conditionResult: true, output: '4', phase: 'update' },
        { iteration: 5, variableValue: 5, condition: 'i <= 5', conditionResult: true, output: '5', phase: 'update' },
      ],
      currentIteration: 1,
      consoleOutput: ['1', '2', '3', '4', '5'],
      currentOutputLine: 0,
      title: 'Updating the Counter',
      subtitle: 'i++ increases i by 1 after each iteration',
      explanation: 'After each body execution, i++ increments the counter. The loop repeats.',
    },
    codeSnippet: C_CODE,
    highlightedLines: [5],
    captions: [
      'Update: i++',
      'i changes from 1 to 2',
      'Check condition: 2 <= 5? TRUE',
      'Print 2, then i becomes 3...',
      'The cycle repeats: 3, 4, 5',
    ],
    transition: 'slide',
  },
  {
    sceneId: 'scene-7',
    title: 'Step 5: The Loop Terminates',
    duration: 8,
    objective: 'Understand when and why the loop stops',
    narration:
      "After printing 5, the update runs one more time. i becomes 6. Now the condition is checked: is 6 less than or equal to 5? No, 6 is greater than 5. The condition is false. The gate closes. The loop stops. The program moves on to the return statement, and execution is complete. The loop ran exactly 5 times, printing the numbers 1 through 5.",
    visualType: 'condition-gate',
    visualParams: {
      variableName: 'i',
      variableValue: 6,
      condition: 'i <= 5',
      conditionResult: false,
      consoleOutput: ['1', '2', '3', '4', '5'],
      currentOutputLine: 4,
      title: 'Loop Termination',
      subtitle: 'i = 6, condition is FALSE',
      explanation:
        'When i becomes 6, the condition i <= 5 is false. The loop stops. The program continues to return 0.',
    },
    codeSnippet: C_CODE,
    highlightedLines: [5],
    captions: [
      'After printing 5, i++ makes i = 6',
      'Condition: 6 <= 5? FALSE',
      'The gate closes!',
      'The loop terminates',
      'Program continues to return 0',
    ],
    transition: 'zoom',
  },
  {
    sceneId: 'scene-8',
    title: 'Complete Execution Replay',
    duration: 12,
    objective: 'Watch the entire loop execution from start to finish',
    narration:
      "Now let us watch the entire execution from start to finish. We initialize i to 1. Check: 1 is less than or equal to 5, true. Print 1. Update: i becomes 2. Check: 2 is less than or equal to 5, true. Print 2. Update: i becomes 3. Check: true. Print 3. Update: i becomes 4. Check: true. Print 4. Update: i becomes 5. Check: true. Print 5. Update: i becomes 6. Check: 6 is less than or equal to 5? False. The loop ends. The output is: 1 2 3 4 5.",
    visualType: 'code-execution',
    visualParams: {
      variableName: 'i',
      variableValue: 5,
      loopIterations: [
        { iteration: 1, variableValue: 1, condition: 'i <= 5', conditionResult: true, output: '1', phase: 'body' },
        { iteration: 2, variableValue: 2, condition: 'i <= 5', conditionResult: true, output: '2', phase: 'body' },
        { iteration: 3, variableValue: 3, condition: 'i <= 5', conditionResult: true, output: '3', phase: 'body' },
        { iteration: 4, variableValue: 4, condition: 'i <= 5', conditionResult: true, output: '4', phase: 'body' },
        { iteration: 5, variableValue: 5, condition: 'i <= 5', conditionResult: true, output: '5', phase: 'body' },
        { iteration: 6, variableValue: 6, condition: 'i <= 5', conditionResult: false, output: '', phase: 'end' },
      ],
      currentIteration: 4,
      consoleOutput: ['1', '2', '3', '4', '5'],
      currentOutputLine: 4,
      title: 'Full Execution Trace',
      subtitle: 'Watch the complete loop from start to finish',
      explanation:
        'The loop runs 5 times: i goes from 1 to 5, printing each value. When i becomes 6, the condition fails and the loop ends.',
    },
    codeSnippet: C_CODE,
    highlightedLines: [5, 6],
    captions: [
      'i=1: 1<=5 TRUE -> print 1',
      'i=2: 2<=5 TRUE -> print 2',
      'i=3: 3<=5 TRUE -> print 3',
      'i=4: 4<=5 TRUE -> print 4',
      'i=5: 5<=5 TRUE -> print 5',
      'i=6: 6<=5 FALSE -> loop ends',
      'Output: 1 2 3 4 5',
    ],
    transition: 'fade',
  },
  {
    sceneId: 'scene-9',
    title: 'Recap and Quiz',
    duration: 10,
    objective: 'Review key concepts and test understanding',
    narration:
      "Let us recap what we learned. A for loop in C has four parts: initialization, where we set the starting value of our counter. Condition, which decides whether the loop continues. Body, the code that runs each time. And update, which changes the counter after each iteration. The loop runs the body while the condition is true, and stops when it becomes false. Now let's test your understanding with three quick questions.",
    visualType: 'generic-explanation',
    visualParams: {
      title: 'Recap: The Four Parts of a For Loop',
      subtitle: 'Init -> Condition -> Body -> Update -> Repeat',
      boxes: [
        { label: 'Initialization', value: 'int i = 1', color: 'cyan' },
        { label: 'Condition', value: 'i <= 5', color: 'violet' },
        { label: 'Body', value: 'printf(...)', color: 'amber' },
        { label: 'Update', value: 'i++', color: 'emerald' },
      ],
      highlightBoxIndex: -1,
      explanation:
        'A for loop repeats its body while the condition is true. When the condition becomes false, the loop stops.',
    },
    codeSnippet: C_CODE,
    highlightedLines: [5, 6],
    captions: [
      'Recap: 4 parts of a for loop',
      '1. Initialization: set the counter',
      '2. Condition: decide whether to continue',
      '3. Body: the code that repeats',
      '4. Update: change the counter',
      'Loop stops when condition is false',
      'Ready for the quiz!',
    ],
    transition: 'fade',
  },
];

export const demoLesson: Lesson = {
  id: 'demo-for-loops-c',
  topic: 'For Loops in C',
  subject: 'C Programming',
  difficulty: 'Beginner',
  duration: 10,
  language: 'English',
  teachingStyle: 'Visual and beginner-friendly',
  title: 'For Loops in C: A Visual Guide',
  objectives: [
    'Understand why loops are needed for repetitive tasks',
    'Learn the three parts of a for-loop: initialization, condition, and update',
    'Trace the execution of a for-loop step by step',
    'Predict the output of a for-loop program',
  ],
  prerequisites: [
    'Basic understanding of variables in C',
    'Familiarity with the printf function',
    'Understanding of integer data types',
  ],
  realWorldAnalogy:
    'Imagine a countdown timer. You set it to a starting number, it checks if the number is greater than zero, displays the number, then decreases by 1. It repeats until the number reaches zero. A for loop works the same way!',
  scenes,
  commonMistakes: [
    'Forgetting the semicolons between the three parts: for (int i = 1 i <= 5 i++) is wrong. Use semicolons: for (int i = 1; i <= 5; i++)',
    'Using a comma instead of a semicolon between init, condition, and update.',
    'Creating an infinite loop by forgetting the update statement (i++), so the condition never becomes false.',
    'Starting the counter at 0 but checking i <= 5, which runs 6 times instead of 5.',
    'Accidentally putting a semicolon after the closing parenthesis: for (...) ; { } — this makes the loop body empty.',
  ],
  summary:
    'A for loop in C repeats a block of code a specific number of times. It has three parts: initialization (setting the counter), condition (checking whether to continue), and update (changing the counter). The body runs while the condition is true. When the condition becomes false, the loop stops. In our example, the loop printed the numbers 1 through 5 by initializing i to 1, checking i <= 5, printing i, and incrementing i after each iteration.',
  quiz: [
    {
      question: 'What are the three parts inside the parentheses of a for loop?',
      options: [
        'start, stop, step',
        'initialization, condition, update',
        'variable, value, increment',
        'begin, end, repeat',
      ],
      correctIndex: 1,
      explanation:
        'The for loop syntax is for (initialization; condition; update). For example: for (int i = 1; i <= 5; i++).',
    },
    {
      question: 'In the loop for (int i = 1; i <= 5; i++), how many times does the body run?',
      options: ['4 times', '5 times', '6 times', 'Infinite times'],
      correctIndex: 1,
      explanation:
        'i starts at 1 and the condition i <= 5 is checked before each iteration. The body runs when i is 1, 2, 3, 4, and 5 — that is 5 times. When i becomes 6, the condition is false and the loop stops.',
    },
    {
      question: 'What happens if you forget the update statement (i++) in a for loop?',
      options: [
        'The loop runs once and stops',
        'The loop runs zero times',
        'The loop runs forever (infinite loop)',
        'The program gives a syntax error',
      ],
      correctIndex: 2,
      explanation:
        'Without the update statement, the counter never changes. The condition stays true forever, and the loop never stops. This is called an infinite loop.',
    },
  ],
  createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  isDemo: true,
};
