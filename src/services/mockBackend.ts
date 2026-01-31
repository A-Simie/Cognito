export interface AgentPlan {
    id: string;
    topic: string;
    totalUnits: number;
    status: 'GENERATING' | 'READY';
    createdAt: string;
}

export interface LessonUnit {
    id: string;
    title: string;
    unitOrder: number;
    unitType: 'LESSON' | 'QUIZ' | 'TOPIC_CHUNK';
    unitStatus: 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';
    duration?: string;
}

export interface ClassData {
    id: number;
    title: string;
    learningMode: string;
    classStatus: string;
    classCompletionPercentage: number;
    lessons: number;
    createdAt: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface Quiz {
    id: string;
    title: string;
    lessonId: string;
    totalQuestions: number;
    questions: QuizQuestion[];
}

// Mock quiz database
const mockQuizzes: Quiz[] = [
    {
        id: 'quiz_1',
        title: 'Python Basics Quiz',
        lessonId: 'unit_1',
        totalQuestions: 5,
        questions: [
            {
                id: 'q1',
                question: 'What is a variable in Python?',
                options: [
                    'A container for storing data values',
                    'A type of loop structure',
                    'A built-in function',
                    'A class definition'
                ],
                correctAnswer: 0,
                explanation: 'Variables are containers for storing data values. In Python, you create a variable by assigning a value to it using the = operator.'
            },
            {
                id: 'q2',
                question: 'Which keyword is used to define a function in Python?',
                options: ['func', 'def', 'function', 'define'],
                correctAnswer: 1,
                explanation: 'The "def" keyword is used to define functions in Python. Example: def my_function():'
            },
            {
                id: 'q3',
                question: 'What data type is the result of: type(3.14)?',
                options: ['int', 'float', 'string', 'decimal'],
                correctAnswer: 1,
                explanation: 'Numbers with decimal points are of type "float" (floating-point numbers) in Python.'
            },
            {
                id: 'q4',
                question: 'How do you create a comment in Python?',
                options: ['// comment', '/* comment */', '# comment', '<!-- comment -->'],
                correctAnswer: 2,
                explanation: 'In Python, single-line comments start with the # symbol. Everything after # on that line is ignored.'
            },
            {
                id: 'q5',
                question: 'Which of these is the correct way to create a list in Python?',
                options: ['list = (1, 2, 3)', 'list = {1, 2, 3}', 'list = [1, 2, 3]', 'list = <1, 2, 3>'],
                correctAnswer: 2,
                explanation: 'Lists in Python are created using square brackets []. Example: my_list = [1, 2, 3]'
            }
        ]
    }
];


// Mock Data Store
let activePlan: AgentPlan | null = null;
let activeUnits: LessonUnit[] = [];
let allClasses: ClassData[] = [];
let currentClassId: number = 0;

export const MockBackend = {
    // 1. Generate Plan (Simulates backend delay)
    generatePlan: async (topic: string): Promise<ClassData> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newClass: ClassData = {
                    id: ++currentClassId,
                    title: topic,
                    learningMode: 'TEACH_ME',
                    classStatus: 'ACTIVE',
                    classCompletionPercentage: 0,
                    lessons: 3,
                    createdAt: new Date().toISOString()
                };

                // Add to classes list
                allClasses.push(newClass);

                // Generate corresponding plan and units
                activePlan = {
                    id: `plan_${newClass.id}`,
                    topic,
                    totalUnits: 3,
                    status: 'READY',
                    createdAt: newClass.createdAt
                };

                // Generate Mock Units
                activeUnits = Array.from({ length: 3 }).map((_, i) => ({
                    id: `unit_${i + 1}`,
                    title: getMockTitle(topic, i),
                    unitOrder: i + 1,
                    unitType: 'TOPIC_CHUNK',
                    unitStatus: i === 0 ? 'IN_PROGRESS' : 'LOCKED',
                    duration: `${15 + i * 5} min`
                }));

                resolve(newClass);
            }, 1000); // 1s delay (faster for testing)
        });
    },

    // 2. Get All Classes
    getClasses: async (): Promise<ClassData[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...allClasses]);
            }, 300); // Quick response
        });
    },

    // 3. Get Current Class
    getMyClass: async (): Promise<{ plan: AgentPlan, units: LessonUnit[] }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!activePlan) reject(new Error("No class found"));
                else resolve({ plan: activePlan, units: activeUnits });
            }, 300);
        });
    },

    // 4. Complete Unit (Unlock next)
    completeUnit: async (unitId: string): Promise<LessonUnit[]> => {
        return new Promise((resolve) => {
            const idx = activeUnits.findIndex(u => u.id === unitId);
            if (idx !== -1) {
                activeUnits[idx].unitStatus = 'COMPLETED';
                if (idx + 1 < activeUnits.length) {
                    activeUnits[idx + 1].unitStatus = 'IN_PROGRESS';
                }

                // Update class completion percentage
                const completedCount = activeUnits.filter(u => u.unitStatus === 'COMPLETED').length;
                const progress = Math.round((completedCount / activeUnits.length) * 100);

                if (currentClassId > 0) {
                    const currentClass = allClasses.find(c => c.id === currentClassId);
                    if (currentClass) {
                        currentClass.classCompletionPercentage = progress;
                    }
                }
            }
            resolve([...activeUnits]);
        });
    },

    // 5. Get Quiz for Lesson
    getQuiz: async (lessonId: string): Promise<Quiz | null> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const quiz = mockQuizzes.find(q => q.lessonId === lessonId);
                resolve(quiz || mockQuizzes[0]); // Default to first quiz if not found
            }, 300);
        });
    },

    // 6. Get Lesson HTML Content (AI-generated)
    getLessonContent: async (lessonId: string): Promise<string> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock HTML5 Canvas interactive lesson from Gemini AI
                // In production, Gemini AI generates this content
                // Quiz is triggered by AI via tool call, not by student button
                const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Python Variable Visualizer</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f0f2f5;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            color: #333;
        }
        h1 { color: #306998; } /* Python Blue */
        h2 { color: #ffd43b; text-shadow: 1px 1px 2px #aaa; } /* Python Yellow */
        
        .container {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }

        .controls {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }

        input {
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
        }

        button {
            padding: 10px 20px;
            background-color: #306998;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.2s;
        }

        button:hover { background-color: #2b5b84; }

        canvas {
            background-color: #fff;
            border: 2px dashed #ccc;
            border-radius: 8px;
            margin-top: 20px;
        }

        .code-preview {
            background-color: #1e1e1e;
            color: #d4d4d4;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Consolas', 'Courier New', monospace;
            text-align: left;
            margin-top: 10px;
            font-size: 18px;
        }

        .keyword { color: #569cd6; }
        .string { color: #ce9178; }
        .number { color: #b5cea8; }
        .comment { color: #6a9955; }

    </style>
</head>
<body>

    <div class="container">
        <h1>Python Variable Lab</h1>
        <p>Think of a variable as a <strong>box</strong> with a <strong>name</strong> label.</p>

        <div class="controls">
            <input type="text" id="varName" placeholder="Variable Name (e.g. score)" value="score">
            <span>=</span>
            <input type="text" id="varValue" placeholder="Value (e.g. 10 or 'Hello')" value="10">
            <button onclick="assignVariable()">Run Code</button>
        </div>

        <div class="code-preview" id="codeDisplay">
            <span class="comment"># Ready to code...</span>
        </div>

        <canvas id="myCanvas" width="500" height="300"></canvas>
    </div>

<script>
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    let animationId;

    // Animation state
    let boxY = -100;
    let targetY = 100;
    let currentName = "";
    let currentValue = "";
    let isString = false;

    function drawComputer() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Floor
        ctx.fillStyle = "#ddd";
        ctx.fillRect(50, 250, 400, 10);

        // Draw Memory Space text
        ctx.fillStyle = "#888";
        ctx.font = "14px Arial";
        ctx.fillText("Computer Memory (RAM)", 180, 280);
    }

    function drawBox(y, name, value, isStr) {
        const x = 175;
        const width = 150;
        const height = 100;

        // Draw the Box body
        ctx.fillStyle = "#e8c39e"; // Cardboard color
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = "#cca37a";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        // Draw the "Flaps" (depth effect)
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 20, y - 20);
        ctx.lineTo(x + width + 20, y - 20);
        ctx.lineTo(x + width, y);
        ctx.fillStyle = "#dbb086";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + width, y);
        ctx.lineTo(x + width + 20, y - 20);
        ctx.lineTo(x + width + 20, y + height - 20);
        ctx.lineTo(x + width, y + height);
        ctx.fillStyle = "#dbb086";
        ctx.fill();
        ctx.stroke();

        // Draw the Label (Variable Name)
        ctx.fillStyle = "white";
        ctx.fillRect(x + 10, y + 30, width - 20, 40);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 10, y + 30, width - 20, 40);

        // Variable Name Text
        ctx.fillStyle = "black";
        ctx.font = "bold 20px Consolas";
        ctx.textAlign = "center";
        ctx.fillText(name, x + width / 2, y + 55);

        // Label Tag
        ctx.fillStyle = "#306998";
        ctx.font = "12px Arial";
        ctx.fillText("NAME", x + width / 2, y + 25);

        // Draw the Value
        ctx.fillStyle = "#333";
        ctx.font = "bold 24px Consolas";
        
        let displayValue = value;
        if (isStr) {
            displayValue = \`"\${value}"\`;
            ctx.fillStyle = "#ce9178"; // String color
        } else {
            ctx.fillStyle = "#0000FF"; // Number color
        }

        // Draw value "floating" above box
        ctx.fillText(displayValue, x + width / 2, y - 40);
        
        // Arrow pointing in
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + width/2, y - 30);
        ctx.lineTo(x + width/2, y - 5);
        ctx.lineTo(x + width/2 - 5, y - 10);
        ctx.moveTo(x + width/2, y - 5);
        ctx.lineTo(x + width/2 + 5, y - 10);
        ctx.stroke();
    }

    function animate() {
        drawComputer();
        
        // Physics for the box dropping
        if (boxY < targetY) {
            boxY += 5;
        }

        if (currentName) {
            drawBox(boxY, currentName, currentValue, isString);
        }

        animationId = requestAnimationFrame(animate);
    }

    function assignVariable() {
        const nameInput = document.getElementById('varName').value.trim();
        const valueInput = document.getElementById('varValue').value.trim();
        const codeDisplay = document.getElementById('codeDisplay');

        // Validation
        if (!nameInput) {
            alert("Please enter a variable name!");
            return;
        }

        // Basic Type Inference for visualization
        let formattedValue = valueInput;
        isString = isNaN(valueInput);

        // Update the Code Preview block
        if (isString) {
            formattedValue = \`"\${valueInput}"\`;
            codeDisplay.innerHTML = \`<span style="color:white">\${nameInput}</span> = <span class="string">\${formattedValue}</span>\`;
        } else {
            codeDisplay.innerHTML = \`<span style="color:white">\${nameInput}</span> = <span class="number">\${formattedValue}</span>\`;
        }
        
        codeDisplay.innerHTML += \` <span class="comment"># We created a box labeled '\${nameInput}'</span>\`;

        // Reset Animation
        currentName = nameInput;
        currentValue = valueInput;
        boxY = -150; // Start from top
        targetY = 120; // Land on floor area
    }

    // Start loop
    animate();

</script>

</body>
</html>
                `.trim();

                resolve(htmlContent);
            }, 500);
        });
    }

};

// Helper for dynamic titles
function getMockTitle(topic: string, index: number): string {
    const prefixes = [
        `Introduction to ${topic}`,
        `Core Concepts of ${topic}`,
        `Advanced Topics in ${topic}`
    ];
    return prefixes[index] || `Lesson ${index + 1}`;
}

