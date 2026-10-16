import type { GenerateLessonRequest, Lesson, Scene, VisualParams } from '@/types/lesson';
import { demoLesson } from '@/data/demoLesson';

const scene = (
  sceneId: string,
  title: string,
  objective: string,
  narration: string,
  visualType: Scene['visualType'],
  visualParams: VisualParams,
  codeSnippet: string,
  highlightedLines: number[],
  captions: string[]
): Scene => ({
  sceneId,
  title,
  duration: 8,
  objective,
  narration,
  visualType,
  visualParams,
  codeSnippet,
  highlightedLines,
  captions,
  transition: 'fade',
});

const quiz = (topic: string) => [
  {
    question: `Which idea is most important when learning ${topic}?`,
    options: [
      'Understanding what the code stores or changes',
      'Memorizing every punctuation mark first',
      'Avoiding all variables',
      'Running code without reading it',
    ],
    correctIndex: 0,
    explanation: `The best way to learn ${topic} is to connect the syntax to the value or control flow it creates while the program runs.`,
  },
  {
    question: 'What should you do before changing a C program?',
    options: [
      'Predict what the next line will do',
      'Delete the main function',
      'Remove all semicolons',
      'Assume the output without tracing it',
    ],
    correctIndex: 0,
    explanation: 'A small execution trace helps you connect each line of C code to the program state.',
  },
  {
    question: 'What makes a C example easier to understand?',
    options: [
      'A clear input, a visible process, and an expected output',
      'More code with no explanation',
      'Random values on every run',
      'Hiding the important lines',
    ],
    correctIndex: 0,
    explanation: 'Visualizing input, processing, and output makes the behavior of a C program concrete.',
  },
];

function makeLesson(request: GenerateLessonRequest, title: string, scenes: Scene[], summary: string, mistakes: string[]): Lesson {
  return {
    ...demoLesson,
    id: `lesson-local-${Date.now()}`,
    topic: request.topic.trim(),
    subject: request.subject,
    difficulty: request.difficulty,
    duration: request.duration,
    language: request.language,
    teachingStyle: request.teachingStyle,
    title,
    scenes,
    objectives: scenes.slice(0, 4).map((item) => item.objective),
    prerequisites: ['Basic C syntax', 'The main function', 'The printf function'],
    realWorldAnalogy: 'Think of a C program as a small machine: values enter, instructions transform them, and the result appears as output.',
    summary,
    commonMistakes: mistakes,
    quiz: quiz(request.topic.trim()),
    isDemo: false,
    createdAt: new Date().toISOString(),
  };
}

function variablesLesson(request: GenerateLessonRequest): Lesson {
  const code = `#include <stdio.h>\n\nint main() {\n    int score = 90;\n    score = score + 5;\n    printf("%d", score);\n    return 0;\n}`;
  return makeLesson(
    request,
    `${request.topic.trim()}: Values in Memory`,
    [
      scene('variables-1', 'A Variable Is a Named Box', 'Understand that a variable gives a name to a value in memory.', 'A variable is like a labeled box. The label is score, and the value inside the box is 90. Giving data a name lets the rest of the program use it clearly.', 'variable-box', { title: 'Create a Variable', subtitle: 'int score = 90', variableName: 'score', variableValue: 90, variableType: 'int', explanation: 'The program creates an integer box named score and places 90 inside it.' }, code, [4], ['A variable is a named memory box', 'score starts with the value 90']),
      scene('variables-2', 'The Type Describes the Value', 'See how int tells C what kind of value the variable stores.', 'The word int tells C that score stores a whole number. C uses the type to understand how to store the value and which operations make sense.', 'generic-explanation', { title: 'The Declaration', subtitle: 'int score = 90', boxes: [{ label: 'Type', value: 'int', color: 'violet' }, { label: 'Name', value: 'score', color: 'cyan' }, { label: 'Value', value: '90', color: 'amber' }], explanation: 'Type, name, and value work together to describe a variable.' }, code, [4], ['int means whole number', 'score is the variable name', '90 is the starting value']),
      scene('variables-3', 'Assignment Changes the Box', 'Trace how assignment replaces the current value.', 'The statement score equals score plus 5 reads the old value, adds 5, and stores the new value back in the same box. The variable name stays the same while its value changes.', 'variable-box', { title: 'Update the Variable', subtitle: 'score = score + 5', variableName: 'score', variableValue: 95, variableType: 'int', explanation: 'C reads 90, calculates 95, then stores 95 in score.' }, code, [5], ['Read score: 90', 'Add 5', 'Store the new value: 95']),
      scene('variables-4', 'The Value Can Be Used', 'Connect a variable value to program output.', 'The printf statement reads the value currently stored in score. Because the box now contains 95, the output shows 95.', 'input-output-flow', { title: 'Read and Print', subtitle: 'printf("%d", score)', flowSteps: [{ label: 'score = 95', detail: 'Read the box', type: 'process' }, { label: 'printf', detail: 'Format the integer', type: 'output' }, { label: '95', detail: 'Console output', type: 'output' }], currentStep: 2, consoleOutput: ['95'], explanation: 'The current value of score flows into the output.' }, code, [6], ['printf reads score', 'The console prints 95']),
      scene('variables-5', 'Execution Replay', 'Review declaration, update, and output as one connected flow.', 'The program creates score with 90, updates it to 95, and prints the final value. This is the basic life cycle of a variable in C.', 'code-execution', { title: 'Variable Execution Trace', subtitle: '90 -> 95 -> output', variableName: 'score', variableValue: 95, loopIterations: [{ iteration: 1, variableValue: 90, condition: 'created', conditionResult: true, output: '', phase: 'init' }, { iteration: 2, variableValue: 95, condition: 'updated', conditionResult: true, output: '95', phase: 'body' }], currentIteration: 1, consoleOutput: ['95'], explanation: 'A named value is created, changed, and read.' }, code, [4, 5, 6], ['Create score = 90', 'Update score = 95', 'Print 95']),
      scene('variables-6', 'Recap: Variables', 'Summarize the role of type, name, value, and assignment.', 'A variable has a type, a name, and a current value. Assignment changes the value. When another statement reads the variable, it receives the current value in memory.', 'generic-explanation', { title: 'Variable Recap', subtitle: 'type + name + value', boxes: [{ label: 'Declaration', value: 'int score', color: 'violet' }, { label: 'Assignment', value: '= 90', color: 'cyan' }, { label: 'Update', value: '= score + 5', color: 'emerald' }, { label: 'Output', value: '95', color: 'amber' }], explanation: 'Variables let a program name, change, and reuse data.' }, code, [4, 5, 6], ['Declare a type and name', 'Store and update a value', 'Use the current value']),
    ],
    'Variables are named memory locations. A declaration gives a variable a type and name, an assignment stores a value, and later statements can read or update that value.',
    ['Using a value before initializing it.', 'Using %d for a non-integer value.', 'Confusing =, which assigns, with ==, which compares.']
  );
}

function functionsLesson(request: GenerateLessonRequest): Lesson {
  const code = `#include <stdio.h>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    int result = add(2, 3);\n    printf("%d", result);\n    return 0;\n}`;
  return makeLesson(
    request,
    `${request.topic.trim()}: Calls, Parameters, and Returns`,
    [
      scene('functions-1', 'Why Use a Function?', 'Understand that a function packages a reusable task.', 'A function is a named block of instructions. Instead of rewriting the steps for addition every time, we define add once and call it whenever the program needs it.', 'generic-explanation', { title: 'A Reusable Task', subtitle: 'add(2, 3)', boxes: [{ label: 'Input', value: '2, 3', color: 'cyan' }, { label: 'Function', value: 'add', color: 'violet' }, { label: 'Result', value: '5', color: 'emerald' }], explanation: 'Functions turn a repeated task into a reusable piece of code.' }, code, [3, 4, 5], ['Define the task once', 'Call it with values', 'Receive the result']),
      scene('functions-2', 'Parameters Receive Values', 'Trace how arguments enter function parameters.', 'When main calls add with 2 and 3, those arguments are copied into the parameters a and b. Inside the function, a is 2 and b is 3.', 'input-output-flow', { title: 'Arguments Become Parameters', subtitle: 'add(2, 3)', flowSteps: [{ label: '2', detail: 'first argument', type: 'call' }, { label: '3', detail: 'second argument', type: 'call' }, { label: 'a=2, b=3', detail: 'parameters inside add', type: 'process' }], currentStep: 2, explanation: 'The call provides values; the parameters receive them.' }, code, [8], ['main calls add(2, 3)', 'a receives 2', 'b receives 3']),
      scene('functions-3', 'The Function Runs', 'Watch the function body process its inputs.', 'Execution moves into add. The expression a plus b reads the two parameters and calculates 5. The function body performs its focused job.', 'variable-box', { title: 'Inside add', subtitle: 'a + b', variableName: 'result', variableValue: 5, variableType: 'int', explanation: 'The function combines its parameters and prepares a return value.' }, code, [4], ['Enter the function', 'Calculate 2 + 3', 'Prepare the value 5']),
      scene('functions-4', 'Return Sends a Value Back', 'Understand how return transfers control and a value to the caller.', 'The return statement sends 5 back to main. Execution leaves add and continues at the place where add was called.', 'input-output-flow', { title: 'Return Flow', subtitle: 'return a + b', flowSteps: [{ label: 'add', detail: 'function finishes', type: 'process' }, { label: 'return 5', detail: 'send value back', type: 'return' }, { label: 'result = 5', detail: 'caller stores it', type: 'output' }], currentStep: 2, consoleOutput: ['5'], explanation: 'return carries the result back to the caller.' }, code, [4, 8], ['add returns 5', 'main receives 5', 'result stores 5']),
      scene('functions-5', 'The Caller Uses the Result', 'Connect a returned value to a variable and output.', 'Back in main, result receives the returned 5. The printf statement then reads result and displays 5.', 'code-execution', { title: 'Call to Output', subtitle: 'add(2, 3) -> result -> printf', variableName: 'result', variableValue: 5, loopIterations: [{ iteration: 1, variableValue: 2, condition: 'call', conditionResult: true, output: '', phase: 'init' }, { iteration: 2, variableValue: 5, condition: 'returned', conditionResult: true, output: '5', phase: 'body' }], currentIteration: 1, consoleOutput: ['5'], explanation: 'The caller stores and uses the function result.' }, code, [8, 9], ['Call add', 'Store result = 5', 'Print 5']),
      scene('functions-6', 'Recap: Function Flow', 'Summarize definition, call, parameters, body, and return.', 'A function is defined before it is called. The call provides arguments, parameters receive them, the body runs, and return sends a value back to the caller.', 'generic-explanation', { title: 'Function Flow', subtitle: 'define -> call -> run -> return', boxes: [{ label: 'Define', value: 'add(a,b)', color: 'violet' }, { label: 'Call', value: 'add(2,3)', color: 'cyan' }, { label: 'Run', value: 'a+b', color: 'amber' }, { label: 'Return', value: '5', color: 'emerald' }], explanation: 'Functions organize C programs into named, reusable tasks.' }, code, [3, 4, 8], ['Define the function', 'Call with arguments', 'Return and use the result']),
    ],
    'A C function is a named, reusable block of code. Parameters receive arguments, the body performs the task, and return sends a value back to the caller.',
    ['Forgetting the return type.', 'Passing arguments in the wrong order.', 'Calling a function with the wrong number of arguments.']
  );
}

function arraysLesson(request: GenerateLessonRequest): Lesson {
  const code = `#include <stdio.h>\n\nint main() {\n    int scores[3] = {80, 90, 100};\n    printf("%d", scores[1]);\n    return 0;\n}`;
  return makeLesson(request, `${request.topic.trim()}: Indexes and Contiguous Data`, [
    scene('arrays-1', 'An Array Holds a Collection', 'Understand that an array stores several same-type values under one name.', 'An array is a row of boxes. scores is one name connected to three integer boxes containing 80, 90, and 100.', 'generic-explanation', { title: 'Array in Memory', subtitle: 'int scores[3] = {80, 90, 100}', boxes: [{ label: 'scores[0]', value: '80', color: 'cyan' }, { label: 'scores[1]', value: '90', color: 'violet' }, { label: 'scores[2]', value: '100', color: 'emerald' }], explanation: 'One array name groups multiple values of the same type.' }, code, [4], ['scores contains three integers', 'Each box has an index']),
    scene('arrays-2', 'Indexes Start at Zero', 'Learn how C identifies the first, second, and third cells.', 'C starts array indexes at zero. The first value is scores[0], the second is scores[1], and the third is scores[2].', 'generic-explanation', { title: 'Index Map', subtitle: 'The first index is 0', boxes: [{ label: 'index 0', value: '80', color: 'cyan' }, { label: 'index 1', value: '90', color: 'violet' }, { label: 'index 2', value: '100', color: 'emerald' }], highlightBoxIndex: 1, explanation: 'The index tells C which cell to access.' }, code, [4, 5], ['0 means first cell', '1 means second cell', '2 means third cell']),
    scene('arrays-3', 'Access One Element', 'Trace scores[1] to the value 90.', 'The expression scores[1] asks for the cell at index 1. That is the second box, so C reads the value 90.', 'variable-box', { title: 'Read scores[1]', subtitle: 'scores[1] -> 90', variableName: 'scores[1]', variableValue: 90, variableType: 'int', explanation: 'Index 1 selects the second element.' }, code, [5], ['Look at index 1', 'Find the second box', 'Read 90']),
    scene('arrays-4', 'Arrays and Loops Work Together', 'See how a loop can visit each array element.', 'Arrays become powerful when a loop changes the index. The loop can process scores[0], then scores[1], then scores[2] without repeating the statement manually.', 'counter-loop', { title: 'Visit Every Cell', subtitle: 'i moves from 0 to 2', variableName: 'i', variableValue: 1, loopIterations: [{ iteration: 1, variableValue: 0, condition: 'i < 3', conditionResult: true, output: '80', phase: 'body' }, { iteration: 2, variableValue: 1, condition: 'i < 3', conditionResult: true, output: '90', phase: 'body' }, { iteration: 3, variableValue: 2, condition: 'i < 3', conditionResult: true, output: '100', phase: 'body' }], currentIteration: 1, consoleOutput: ['80', '90', '100'], explanation: 'The index changes to visit each array cell.' }, code, [4], ['i=0 reads 80', 'i=1 reads 90', 'i=2 reads 100']),
    scene('arrays-5', 'Stay Inside the Array', 'Understand why valid indexes matter.', 'For an array with three elements, valid indexes are 0, 1, and 2. Accessing index 3 goes outside the array and can produce unpredictable results.', 'condition-gate', { title: 'Bounds Check', subtitle: '0 <= index < 3', variableName: 'index', variableValue: 2, condition: 'index < 3', conditionResult: true, explanation: 'The index must stay inside the declared size.' }, code, [4, 5], ['Valid indexes: 0, 1, 2', 'Index 3 is outside the array']),
    scene('arrays-6', 'Recap: Arrays', 'Summarize declaration, indexes, access, and bounds.', 'An array stores same-type values in indexed cells. C starts at index zero, and every access must stay within the declared size.', 'generic-explanation', { title: 'Array Recap', subtitle: 'name + size + index', boxes: [{ label: 'Name', value: 'scores', color: 'cyan' }, { label: 'Size', value: '3', color: 'violet' }, { label: 'Access', value: 'scores[1]', color: 'amber' }, { label: 'Value', value: '90', color: 'emerald' }], explanation: 'Arrays organize multiple values for efficient access and processing.' }, code, [4, 5], ['Declare a collection', 'Use zero-based indexes', 'Check the bounds']),
  ], 'A C array stores several values of the same type under one name. Indexes start at zero, and loops can process each element. Always keep indexes within the array bounds.', ['Using index 1 when you mean the first element.', 'Accessing an index equal to the array size.', 'Mixing values of unrelated types in one array.']);
}

function pointersLesson(request: GenerateLessonRequest): Lesson {
  const code = `#include <stdio.h>\n\nint main() {\n    int score = 90;\n    int *address = &score;\n    *address = 95;\n    printf("%d", score);\n    return 0;\n}`;
  return makeLesson(request, `${request.topic.trim()}: Addresses and Dereferencing`, [
    scene('pointers-1', 'Every Variable Has an Address', 'Understand that a variable lives at a memory address.', 'The variable score stores 90, but it also lives somewhere in memory. Its address is the location where C can find that box.', 'variable-box', { title: 'Variable and Address', subtitle: 'int score = 90', variableName: 'score', variableValue: 90, variableType: 'int', memoryAddresses: [{ address: '0x100', variable: 'score', value: '90' }], highlightedAddress: '0x100', explanation: 'A value is stored at a location, and the location has an address.' }, code, [4], ['score stores 90', 'score also has an address']),
    scene('pointers-2', 'A Pointer Stores an Address', 'See how a pointer variable refers to another variable.', 'The declaration int star address creates a pointer. The ampersand in address equals ampersand score asks for score’s address, so address stores a location instead of the number 90.', 'generic-explanation', { title: 'Pointer Setup', subtitle: 'int *address = &score', boxes: [{ label: 'score', value: '90', color: 'cyan' }, { label: '&score', value: '0x100', color: 'amber' }, { label: 'address', value: '0x100', color: 'violet' }], explanation: 'The pointer contains the address of score.' }, code, [5], ['&score means address of score', 'address stores that address']),
    scene('pointers-3', 'Dereference to Reach the Value', 'Understand that star reads the value at a stored address.', 'The star operator before address follows the pointer to the memory box. Since address points to score, star address means the value inside score.', 'input-output-flow', { title: 'Follow the Pointer', subtitle: '*address -> score', flowSteps: [{ label: 'address', detail: 'holds 0x100', type: 'call' }, { label: '*address', detail: 'follow the address', type: 'process' }, { label: '90', detail: 'value at the location', type: 'output' }], currentStep: 2, explanation: 'Dereferencing follows an address to the value stored there.' }, code, [6], ['Read the pointer', 'Follow its address', 'Reach score = 90']),
    scene('pointers-4', 'Pointers Can Change the Original', 'Trace how dereferencing updates the pointed-to variable.', 'The statement star address equals 95 follows the pointer and writes 95 into the original score box. The pointer does not create a separate copy of score.', 'variable-box', { title: 'Update Through a Pointer', subtitle: '*address = 95', variableName: 'score', variableValue: 95, variableType: 'int', explanation: 'Writing through the pointer changes the original variable.' }, code, [6], ['Follow address to score', 'Write 95 into score', 'score is now 95']),
    scene('pointers-5', 'Use Pointers Carefully', 'Recognize why a valid pointer must point to a real object.', 'A pointer must contain a valid address before it is dereferenced. Dereferencing an uninitialized or invalid pointer can access memory that does not belong to the program.', 'condition-gate', { title: 'Safe Dereference', subtitle: 'Does address point to a valid variable?', variableName: 'address', variableValue: '0x100', condition: 'address is valid', conditionResult: true, explanation: 'Only follow pointers that are initialized and point to valid storage.' }, code, [5, 6], ['Initialize the pointer', 'Check what it points to', 'Then dereference it']),
    scene('pointers-6', 'Recap: Pointers', 'Summarize addresses, pointer storage, and dereferencing.', 'The ampersand gets an address, a pointer stores that address, and the star operator follows the address. This gives C direct control over memory.', 'generic-explanation', { title: 'Pointer Recap', subtitle: '& gets an address, * follows it', boxes: [{ label: 'Value', value: 'score = 90', color: 'cyan' }, { label: 'Address', value: '&score', color: 'amber' }, { label: 'Pointer', value: 'address', color: 'violet' }, { label: 'Dereference', value: '*address', color: 'emerald' }], explanation: 'Pointers connect a variable name to its memory location.' }, code, [4, 5, 6], ['Find an address', 'Store it in a pointer', 'Follow it to read or write']),
  ], 'A pointer stores a memory address. The ampersand obtains an address and the star operator dereferences it to read or change the value at that location.', ['Dereferencing an uninitialized pointer.', 'Confusing the pointer address with the value it points to.', 'Using a pointer after the original storage is no longer valid.']);
}

function recursionLesson(request: GenerateLessonRequest): Lesson {
  const code = `#include <stdio.h>\n\nint countdown(int n) {\n    if (n == 0) return 0;\n    printf("%d ", n);\n    return countdown(n - 1);\n}\n\nint main() {\n    countdown(3);\n    return 0;\n}`;
  return makeLesson(request, `${request.topic.trim()}: Base Cases and Call Stacks`, [
    scene('recursion-1', 'A Function Can Call Itself', 'Understand the central idea of recursion.', 'Recursion happens when a function calls itself with a smaller or simpler input. countdown receives 3, prints it, then asks the next call to handle 2.', 'input-output-flow', { title: 'Recursive Call', subtitle: 'countdown(3) -> countdown(2)', flowSteps: [{ label: 'countdown(3)', detail: 'current call', type: 'call' }, { label: 'print 3', detail: 'do the work', type: 'process' }, { label: 'countdown(2)', detail: 'smaller problem', type: 'call' }], currentStep: 2, explanation: 'Each call makes the remaining problem smaller.' }, code, [3, 6], ['Call countdown(3)', 'Print 3', 'Call countdown(2)']),
    scene('recursion-2', 'The Base Case Stops the Calls', 'See why every recursive function needs a stopping rule.', 'The if statement checks whether n is zero. When it is, the function returns immediately instead of calling itself again. This is the base case.', 'condition-gate', { title: 'Base Case', subtitle: 'if (n == 0)', variableName: 'n', variableValue: 0, condition: 'n == 0', conditionResult: true, explanation: 'The base case prevents the recursive calls from continuing forever.' }, code, [4], ['n becomes 0', 'The condition is true', 'Return without another call']),
    scene('recursion-3', 'Calls Build a Stack', 'Visualize how each active call waits for the next call.', 'While countdown(3) waits, countdown(2) starts. Then countdown(1) starts, and finally countdown(0) reaches the base case. These active calls form a stack.', 'generic-explanation', { title: 'Call Stack', subtitle: 'Each call waits for the next one', boxes: [{ label: 'top', value: 'countdown(0)', color: 'emerald' }, { label: 'waiting', value: 'countdown(1)', color: 'amber' }, { label: 'waiting', value: 'countdown(2)', color: 'violet' }, { label: 'bottom', value: 'countdown(3)', color: 'cyan' }], explanation: 'The newest call is handled first, while earlier calls wait.' }, code, [3, 4, 6], ['countdown(3) waits', 'countdown(2) waits', 'countdown(1) waits', 'countdown(0) stops']),
    scene('recursion-4', 'The Stack Unwinds', 'Watch control return from the base case.', 'After countdown(0) returns, the waiting calls finish one by one. The stack unwinds from countdown(1) back to countdown(2), then countdown(3), and finally main.', 'input-output-flow', { title: 'Return Flow', subtitle: 'countdown(0) -> countdown(1) -> countdown(2)', flowSteps: [{ label: 'return', detail: 'base case finishes', type: 'return' }, { label: 'countdown(1)', detail: 'resumes', type: 'process' }, { label: 'main', detail: 'execution continues', type: 'output' }], currentStep: 2, consoleOutput: ['3', '2', '1'], explanation: 'Once the base case returns, suspended calls resume.' }, code, [4, 6], ['Base case returns', 'Waiting calls resume', 'Execution returns to main']),
    scene('recursion-5', 'Execution Trace', 'Connect each input to the resulting calls and output.', 'Starting with 3 produces the sequence 3, 2, 1. The value decreases by one at every call and stops at zero, so the program has a clear finite trace.', 'code-execution', { title: 'Recursion Trace', subtitle: '3 -> 2 -> 1 -> 0', variableName: 'n', variableValue: 0, loopIterations: [{ iteration: 1, variableValue: 3, condition: 'n == 0', conditionResult: false, output: '3', phase: 'body' }, { iteration: 2, variableValue: 2, condition: 'n == 0', conditionResult: false, output: '2', phase: 'body' }, { iteration: 3, variableValue: 1, condition: 'n == 0', conditionResult: false, output: '1', phase: 'body' }, { iteration: 4, variableValue: 0, condition: 'n == 0', conditionResult: true, output: '', phase: 'end' }], currentIteration: 3, consoleOutput: ['3', '2', '1'], explanation: 'The input decreases until the base case is reached.' }, code, [4, 5, 6], ['n=3 prints 3', 'n=2 prints 2', 'n=1 prints 1', 'n=0 stops']),
    scene('recursion-6', 'Recap: Recursion', 'Summarize the recursive call, base case, and stack.', 'Recursion needs a self-call that moves toward a simpler input and a base case that stops. The call stack remembers each waiting call until the base case returns.', 'generic-explanation', { title: 'Recursion Recap', subtitle: 'base case + smaller call + stack', boxes: [{ label: 'Base case', value: 'n == 0', color: 'emerald' }, { label: 'Work', value: 'printf(n)', color: 'amber' }, { label: 'Smaller call', value: 'n - 1', color: 'violet' }, { label: 'Result', value: '3 2 1', color: 'cyan' }], explanation: 'A recursive solution must always move toward its stopping rule.' }, code, [4, 6], ['Stop at the base case', 'Make the problem smaller', 'Let the stack unwind']),
  ], 'Recursion is a function solving a problem by calling itself on a smaller input. The base case stops new calls, and the call stack stores suspended calls until they return.', ['Forgetting the base case.', 'Making a recursive call with the same input.', 'Creating too many calls and overflowing the stack.']);
}

function conditionsLesson(request: GenerateLessonRequest): Lesson {
  const code = `#include <stdio.h>\n\nint main() {\n    int score = 75;\n    if (score >= 50) {\n        printf("Pass");\n    } else {\n        printf("Try again");\n    }\n    return 0;\n}`;
  return makeLesson(request, `${request.topic.trim()}: Decisions with if and else`, [
    scene('conditions-1', 'Programs Make Decisions', 'Understand why conditional statements are useful.', 'A program can choose different actions depending on data. Here, score is 75, and the program must decide whether that is enough to pass.', 'generic-explanation', { title: 'A Decision', subtitle: 'What should the program do?', boxes: [{ label: 'Input', value: 'score = 75', color: 'cyan' }, { label: 'Question', value: '>= 50?', color: 'violet' }, { label: 'Choice', value: 'Pass', color: 'emerald' }], explanation: 'An if statement lets a program choose a path.' }, code, [4, 5, 7], ['The program has a score', 'It needs to choose an output']),
    scene('conditions-2', 'Evaluate the Condition', 'Trace how a comparison becomes true or false.', 'The condition score greater than or equal to 50 compares 75 with 50. Because 75 is greater, the result is true.', 'condition-gate', { title: 'Comparison Gate', subtitle: 'score >= 50', variableName: 'score', variableValue: 75, condition: 'score >= 50', conditionResult: true, explanation: 'The condition produces a boolean decision: true or false.' }, code, [5], ['Read score: 75', 'Compare with 50', 'The result is TRUE']),
    scene('conditions-3', 'Run the True Branch', 'See how a true condition selects the if body.', 'Because the condition is true, C enters the first block and runs printf Pass. The else block is skipped.', 'input-output-flow', { title: 'True Branch', subtitle: 'if body runs', flowSteps: [{ label: 'TRUE', detail: 'condition result', type: 'process' }, { label: 'printf("Pass")', detail: 'selected statement', type: 'output' }, { label: 'Pass', detail: 'console output', type: 'output' }], currentStep: 2, consoleOutput: ['Pass'], explanation: 'Only the branch connected to the true result runs.' }, code, [5, 6], ['Condition is true', 'Run the if block', 'Output: Pass']),
    scene('conditions-4', 'What if the Condition Is False?', 'Understand the alternative else branch.', 'If score were 40, score greater than or equal to 50 would be false. C would skip the if block and run the else block instead.', 'condition-gate', { title: 'Alternative Path', subtitle: 'score = 40', variableName: 'score', variableValue: 40, condition: 'score >= 50', conditionResult: false, explanation: 'A false condition sends execution to else when it exists.' }, code, [5, 7, 8], ['40 >= 50 is FALSE', 'Skip the if block', 'Run else instead']),
    scene('conditions-5', 'Trace Both Possible Paths', 'Compare the true and false outcomes.', 'The condition determines exactly one path. With 75 the output is Pass. With 40 the output is Try again. The rest of the program continues after the chosen block.', 'generic-explanation', { title: 'Two Possible Outcomes', subtitle: 'One condition, one selected path', boxes: [{ label: 'score = 75', value: 'Pass', color: 'emerald' }, { label: 'score = 40', value: 'Try again', color: 'amber' }], explanation: 'Changing the input can change the selected branch.' }, code, [5, 6, 8], ['True -> Pass', 'False -> Try again']),
    scene('conditions-6', 'Recap: Conditions', 'Summarize comparisons, branches, and boolean results.', 'An if statement evaluates a condition. True runs the if block. False skips it and can run else. Conditions let a C program respond to different data.', 'generic-explanation', { title: 'Condition Recap', subtitle: 'condition -> true branch or else branch', boxes: [{ label: 'Compare', value: 'score >= 50', color: 'violet' }, { label: 'True', value: 'Pass', color: 'emerald' }, { label: 'False', value: 'Try again', color: 'amber' }], explanation: 'Conditional flow turns data into a decision.' }, code, [5, 6, 8], ['Evaluate the condition', 'Select one branch', 'Continue after the decision']),
  ], 'Conditional statements let C programs make decisions. A comparison produces true or false, and if/else chooses the matching block of code.', ['Using = instead of == in a comparison.', 'Forgetting braces around a multi-line branch.', 'Writing conditions that never cover an important case.']);
}

export function generateLocalLesson(request: GenerateLessonRequest): Lesson {
  const topic = request.topic.trim().toLowerCase();
  if (topic.includes('pointer') || topic.includes('memory address')) return pointersLesson(request);
  if (topic.includes('recursion') || topic.includes('recursive')) return recursionLesson(request);
  if (topic.includes('function') || topic.includes('method')) return functionsLesson(request);
  if (topic.includes('array')) return arraysLesson(request);
  if (topic.includes('variable') || topic.includes('data type') || topic.includes('datatype')) return variablesLesson(request);
  if (topic.includes('condition') || topic.includes('if statement') || topic.includes('if else') || topic.includes('decision')) return conditionsLesson(request);
  if (topic.includes('loop') || topic.includes('for ') || topic.includes('while') || topic.includes('repeat')) return {
    ...demoLesson,
    id: `lesson-local-${Date.now()}`,
    topic: request.topic.trim(),
    subject: request.subject,
    difficulty: request.difficulty,
    duration: request.duration,
    language: request.language,
    teachingStyle: request.teachingStyle,
    title: `${request.topic.trim()}: A Visual Guide`,
    isDemo: false,
    createdAt: new Date().toISOString(),
  };
  return variablesLesson(request);
}
