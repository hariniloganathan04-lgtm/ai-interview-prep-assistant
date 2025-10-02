// Chat Interface for Interview Prep AI with MCQ Support

// Session state
let sessionState = {
    topic: '',
    subtopic: '',
    questions: [],
    currentQuestionIndex: 0,
    startTime: null,
    questionsAsked: 0,
    correctAnswers: 0,
    sessionActive: false,
    waitingForAnswer: false,
    mcqSelectedOption: null,
    timeLimit: 5 * 60 * 1000, // 5 minutes
    timerInterval: null,
    timeRemaining: 5 * 60 * 1000, // 5 minutes
    conversationHistory: [],
    subtopicScores: {} // Track scores for each subtopic
};

// Constants
const MAX_QUESTIONS_PER_SESSION = 10;

// DOM elements
let chatMessages, messageInput, sendBtn, sessionInfoPanel;
let mcqOptionsContainer, mcqOptionsGrid;
let sessionTopicEl, sessionSubtopicEl, infoTopicEl, infoSubtopicEl;
let infoQuestionsEl, infoCorrectEl, infoTimeEl, progressFill, progressText;

// Initialize the chat interface
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    loadSessionData();
    setupEventListeners();
    startNewSession();
    startTimer();
});

// Initialize DOM element references
function initializeElements() {
    chatMessages = document.getElementById('chat-messages');
    messageInput = document.getElementById('message-input');
    sendBtn = document.getElementById('send-btn');
    sessionInfoPanel = document.getElementById('session-info');
    mcqOptionsContainer = document.getElementById('mcq-options');
    mcqOptionsGrid = document.getElementById('mcq-options-grid');
    
    sessionTopicEl = document.getElementById('session-topic');
    sessionSubtopicEl = document.getElementById('session-subtopic');
    infoTopicEl = document.getElementById('info-topic');
    infoSubtopicEl = document.getElementById('info-subtopic');
    infoQuestionsEl = document.getElementById('info-questions');
    infoCorrectEl = document.getElementById('info-correct');
    infoTimeEl = document.getElementById('info-time');
    progressFill = document.getElementById('progress-fill');
    progressText = document.getElementById('progress-text');
}

// Load session data from localStorage
function loadSessionData() {
    const topicKey = localStorage.getItem('selectedTopicKey');
    const subtopic = localStorage.getItem('selectedSubtopic');
    
    if (!topicKey || !subtopic) {
        window.location.href = 'topic-selection.html';
        return;
    }
    
    sessionState.topic = topicKey;
    sessionState.subtopic = subtopic;
    
    // Load previous scores from localStorage
    const savedScores = localStorage.getItem('subtopicScores');
    if (savedScores) {
        sessionState.subtopicScores = JSON.parse(savedScores);
    }
    
    const topicName = getTopicName(topicKey);
    sessionTopicEl.textContent = topicName;
    sessionSubtopicEl.textContent = subtopic;
    infoTopicEl.textContent = topicName;
    infoSubtopicEl.textContent = subtopic;
}

// Get display name for topic key
function getTopicName(topicKey) {
    const topicNames = {
        'aptitude': 'Aptitude Questions',
        'technical': 'Technical Questions',
        'coding': 'Coding Problems',
        'behavioral': 'Behavioral Questions'
    };
    return topicNames[topicKey] || topicKey;
}

// Set up event listeners
function setupEventListeners() {
    sendBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    document.getElementById('hint-btn').addEventListener('click', provideHint);
    document.getElementById('skip-btn').addEventListener('click', skipQuestion);
    document.getElementById('new-session-btn').addEventListener('click', startNewSession);
    document.getElementById('session-info-btn').addEventListener('click', toggleSessionInfo);
    
    document.getElementById('help-btn').addEventListener('click', function() {
        document.getElementById('help-modal').classList.add('active');
    });
    
    document.getElementById('close-help-modal').addEventListener('click', function() {
        document.getElementById('help-modal').classList.remove('active');
    });
    
    document.getElementById('close-panel-btn').addEventListener('click', function() {
        sessionInfoPanel.classList.remove('active');
    });
    
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('help-modal');
        if (e.target === modal) {
            modal.classList.remove('active');
        }
        if (e.target === sessionInfoPanel) {
            sessionInfoPanel.classList.remove('active');
        }
    });
}

// Toggle session info panel
function toggleSessionInfo() {
    sessionInfoPanel.classList.toggle('active');
}

// Start a new practice session
function startNewSession() {
    // Clear existing timer
    if (sessionState.timerInterval) {
        clearInterval(sessionState.timerInterval);
    }
    
    sessionState.questions = [];
    sessionState.currentQuestionIndex = 0;
    sessionState.startTime = new Date();
    sessionState.questionsAsked = 0;
    sessionState.correctAnswers = 0;
    sessionState.sessionActive = true;
    sessionState.waitingForAnswer = false;
    sessionState.mcqSelectedOption = null;
    sessionState.timeRemaining = 5 * 60 * 1000; // 5 minutes
    sessionState.conversationHistory = [];
    
    const welcomeMessage = chatMessages.querySelector('.ai-message');
    chatMessages.innerHTML = '';
    if (welcomeMessage) {
        chatMessages.appendChild(welcomeMessage);
    }
    
    // Add session start message
    addMessage('ai', `🎯 <strong>Starting ${sessionState.subtopic} Practice Session</strong>\n⏰ <strong>Timer Started:</strong> You have 5 minutes to complete ${MAX_QUESTIONS_PER_SESSION} questions. Work efficiently!`);
    
    hideMCQOptions();
    document.querySelector('.chat-input-container').classList.remove('mcq-active');
    messageInput.disabled = false;
    messageInput.placeholder = "Type your answer here...";
    
    if (questionBank[sessionState.topic] && questionBank[sessionState.topic][sessionState.subtopic]) {
        sessionState.questions = [...questionBank[sessionState.topic][sessionState.subtopic]];
        shuffleArray(sessionState.questions);
        askNextQuestion();
    } else {
        addMessage('ai', "I'm sorry, but I don't have questions for this subtopic yet. Please try another subtopic.");
        sessionState.sessionActive = false;
    }
    
    updateSessionInfo();
    startTimer();
}

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Ask the next question
function askNextQuestion() {
    // Check if we've reached maximum questions (10) or time is up or no more questions
    if (sessionState.currentQuestionIndex < sessionState.questions.length && 
        sessionState.timeRemaining > 0 && 
        sessionState.questionsAsked < MAX_QUESTIONS_PER_SESSION) {
        
        const questionData = sessionState.questions[sessionState.currentQuestionIndex];
        sessionState.waitingForAnswer = true;
        sessionState.mcqSelectedOption = null;
        
        let questionText = questionData.q;
        if (questionData.opts) {
            questionText += ' <span class="question-type-indicator">MCQ</span>';
        } else {
            questionText += ' <span class="question-type-indicator">Text Answer</span>';
        }
        
        // Add question progress indicator (X/10)
        const questionNumber = sessionState.questionsAsked + 1;
        questionText += `<br><span style="color: #666; font-size: 0.9em;">Question ${questionNumber} of ${MAX_QUESTIONS_PER_SESSION}</span>`;
        
        // Add time pressure warning if less than 1 minute remaining
        if (sessionState.timeRemaining < 1 * 60 * 1000) {
            const secondsRemaining = Math.ceil(sessionState.timeRemaining / 1000);
            questionText += `<br><span style="color: #ff6b6b; font-size: 0.9em;">⏰ Only ${secondsRemaining} seconds remaining!</span>`;
        } else if (sessionState.timeRemaining < 2 * 60 * 1000) {
            questionText += `<br><span style="color: #ffa726; font-size: 0.9em;">⏰ Less than 2 minutes remaining!</span>`;
        }
        
        addMessage('ai', questionText);
        sessionState.questionsAsked++;
        
        if (questionData.opts) {
            showMCQOptions(questionData.opts);
            document.querySelector('.chat-input-container').classList.add('mcq-active');
            messageInput.disabled = true;
            messageInput.placeholder = "Select an option above...";
        } else {
            hideMCQOptions();
            document.querySelector('.chat-input-container').classList.remove('mcq-active');
            messageInput.disabled = false;
            messageInput.placeholder = "Type your answer here...";
        }
        
        updateSessionInfo();
    } else {
        endSession();
    }
}

// End session when time is up or questions completed
function endSession() {
    sessionState.sessionActive = false;
    
    if (sessionState.timerInterval) {
        clearInterval(sessionState.timerInterval);
    }
    
    const accuracy = sessionState.questionsAsked > 0 ? 
        Math.round((sessionState.correctAnswers / sessionState.questionsAsked) * 100) : 0;
    
    // Save score for this subtopic
    saveSubtopicScore(accuracy);
    
    let endMessage = '';
    let sessionStatus = '';
    
    if (sessionState.questionsAsked >= MAX_QUESTIONS_PER_SESSION) {
        sessionStatus = "🎉 <strong>Session Complete!</strong> You've completed 10 questions!";
    } else if (sessionState.timeRemaining <= 0) {
        sessionStatus = "⏰ <strong>Time's Up!</strong>";
    } else if (sessionState.currentQuestionIndex >= sessionState.questions.length) {
        sessionStatus = "✅ <strong>All Questions Completed!</strong>";
    } else {
        sessionStatus = "🏁 <strong>Session Completed!</strong>";
    }
    
    endMessage = `${sessionStatus}\n\n` +
                `📊 <strong>Final Score:</strong> ${sessionState.correctAnswers}/${sessionState.questionsAsked} (${accuracy}% accuracy)\n\n` +
                `⏱️ <strong>Time Taken:</strong> ${formatTime(5 * 60 * 1000 - sessionState.timeRemaining)}\n\n` +
                `🏆 <strong>Performance:</strong> ${getPerformanceMessage(accuracy)}\n\n` +
                `📝 <strong>Today's session is over!</strong>\n` +
                `You can change the subtopic and practice more.`;
    
    addMessage('ai', endMessage);
    
    // Show session summary
    showSessionSummary();
    
    hideMCQOptions();
    document.querySelector('.chat-input-container').classList.remove('mcq-active');
    messageInput.disabled = false;
    messageInput.placeholder = "Type 'new session' to continue or 'change topic'...";
    
    updateSessionInfo();
}

// Show MCQ options
function showMCQOptions(options) {
    mcqOptionsGrid.innerHTML = '';
    const optionLabels = ['A', 'B', 'C', 'D'];
    
    options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'mcq-option';
        optionElement.innerHTML = `
            <div class="option-label">${optionLabels[index]}</div>
            <div class="option-text">${option}</div>
        `;
        
        optionElement.addEventListener('click', () => selectMCQOption(index, optionElement));
        mcqOptionsGrid.appendChild(optionElement);
    });
    
    mcqOptionsContainer.classList.add('active');
}

// Hide MCQ options
function hideMCQOptions() {
    mcqOptionsContainer.classList.remove('active');
    mcqOptionsGrid.innerHTML = '';
}

// Select an MCQ option
function selectMCQOption(optionIndex, optionElement) {
    if (!sessionState.waitingForAnswer || sessionState.timeRemaining <= 0) return;
    
    document.querySelectorAll('.mcq-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    optionElement.classList.add('selected');
    sessionState.mcqSelectedOption = optionIndex;
    
    setTimeout(() => {
        processMCQAnswer(optionIndex);
    }, 500);
}

// Process MCQ answer
function processMCQAnswer(selectedIndex) {
    if (!sessionState.waitingForAnswer || sessionState.timeRemaining <= 0) return;
    
    const currentQuestion = sessionState.questions[sessionState.currentQuestionIndex];
    const correctAnswer = currentQuestion.a;
    const selectedAnswer = currentQuestion.opts[selectedIndex];
    const isCorrect = selectedAnswer === correctAnswer;
    
    document.querySelectorAll('.mcq-option').forEach((opt, index) => {
        if (currentQuestion.opts[index] === correctAnswer) {
            opt.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            opt.classList.add('incorrect');
        }
    });
    
    let feedbackMessage = '';
    if (isCorrect) {
        feedbackMessage = `<div class="feedback-message feedback-correct">
            <strong>Correct! 🎉</strong> Well done!
        </div>`;
        sessionState.correctAnswers++;
    } else {
        const correctIndex = currentQuestion.opts.findIndex(opt => opt === correctAnswer);
        const correctLabel = String.fromCharCode(65 + correctIndex);
        feedbackMessage = `<div class="feedback-message feedback-incorrect">
            <strong>Incorrect.</strong> The correct answer is ${correctLabel}: ${correctAnswer}
        </div>`;
    }
    
    if (currentQuestion.explanation) {
        feedbackMessage += `<div class="feedback-message feedback-explanation">
            <strong>Explanation:</strong> ${currentQuestion.explanation}
        </div>`;
    }
    
    addMessage('ai', feedbackMessage);
    sessionState.waitingForAnswer = false;
    
    setTimeout(() => {
        sessionState.currentQuestionIndex++;
        
        // Check if we've reached 10 questions
        if (sessionState.questionsAsked >= MAX_QUESTIONS_PER_SESSION) {
            endSession();
        } else {
            askNextQuestion();
        }
    }, 2000);
    
    updateSessionInfo();
}

// Generate AI response (placeholder function)
function generateAIResponse(userMessage, currentQuestion) {
    // This is a placeholder function that returns predefined responses
    // In a real implementation, you would integrate with an AI API here
    
    const predefinedResponses = [
        "Thanks for your answer! Keep practicing to improve your speed.",
        "Good attempt! Focus on time management in your responses.",
        "That's a reasonable approach. Practice being more concise.",
        "Well done! Remember to pace yourself with the 5-minute limit.",
        "Good thinking! Work on delivering answers more efficiently.",
        "Nice approach! Consider alternative solutions for better optimization.",
        "Good start! Try to elaborate more on your reasoning process.",
        "Well reasoned! Practice articulating complex concepts simply.",
        "Good technical knowledge! Work on real-world application examples.",
        "Solid understanding! Focus on communicating your thought process clearly."
    ];
    
    return predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)];
}

// Send a user message (for text-based questions)
async function sendMessage() {
    const message = messageInput.value.trim();
    
    // Handle post-session commands first
    if (!sessionState.sessionActive && message !== '') {
        handlePostSessionChoice(message);
        messageInput.value = '';
        return;
    }
    
    // Check if we can process a regular message
    if (message === '' || !sessionState.waitingForAnswer || 
        sessionState.questions[sessionState.currentQuestionIndex].opts ||
        sessionState.timeRemaining <= 0) return;
    
    addMessage('user', message);
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Disable input while processing
    messageInput.disabled = true;
    sendBtn.disabled = true;
    
    // Show typing indicator
    const typingIndicator = addTypingIndicator();
    
    try {
        const currentQuestion = sessionState.questions[sessionState.currentQuestionIndex];
        const aiResponse = generateAIResponse(message, currentQuestion);
        
        // Simulate API delay
        setTimeout(() => {
            // Remove typing indicator
            typingIndicator.remove();
            
            addMessage('ai', aiResponse);
            
            sessionState.waitingForAnswer = false;
            
            // Re-enable input
            messageInput.disabled = false;
            sendBtn.disabled = false;
            
            setTimeout(() => {
                sessionState.currentQuestionIndex++;
                
                // Check if we've reached 10 questions
                if (sessionState.questionsAsked >= MAX_QUESTIONS_PER_SESSION) {
                    endSession();
                } else {
                    askNextQuestion();
                }
            }, 2000);
            
            updateSessionInfo();
        }, 1500);
        
    } catch (error) {
        // Remove typing indicator
        typingIndicator.remove();
        
        // Fallback response
        const fallbackResponse = "Thanks for your response! Let's continue with the next question.";
        addMessage('ai', fallbackResponse);
        
        sessionState.waitingForAnswer = false;
        messageInput.disabled = false;
        sendBtn.disabled = false;
        
        setTimeout(() => {
            sessionState.currentQuestionIndex++;
            
            // Check if we've reached 10 questions
            if (sessionState.questionsAsked >= MAX_QUESTIONS_PER_SESSION) {
                endSession();
            } else {
                askNextQuestion();
            }
        }, 2000);
    }
}

// Handle post-session choices
function handlePostSessionChoice(choice) {
    const lowerChoice = choice.toLowerCase();
    
    if (lowerChoice.includes('new') || lowerChoice.includes('start') || lowerChoice.includes('again') || lowerChoice.includes('more')) {
        startNewSession();
    } else if (lowerChoice.includes('change') || lowerChoice.includes('subtopic')) {
        window.location.href = 'subtopics.html';
    } else if (lowerChoice.includes('topic') || lowerChoice.includes('main') || lowerChoice.includes('home')) {
        window.location.href = 'topic-selection.html';
    } else {
        addMessage('ai', "Session ended! Type 'new session' to practice again or 'change subtopic' to try a different subtopic.");
    }
}

// Add typing indicator
function addTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message typing-indicator';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

// Provide a hint for the current question
function provideHint() {
    if (!sessionState.sessionActive || !sessionState.waitingForAnswer || sessionState.timeRemaining <= 0) return;
    
    const currentQuestion = sessionState.questions[sessionState.currentQuestionIndex];
    
    // Show typing indicator
    const typingIndicator = addTypingIndicator();
    
    // Simulate API delay
    setTimeout(() => {
        typingIndicator.remove();
        
        const hints = {
            "Probability": "Think about total possible outcomes vs favorable outcomes.",
            "Percentages": "Use: (new-original)/original × 100 for percentage change.",
            "Time & Work": "Calculate individual work rates first.",
            "Profit & Loss": "Remember: Profit % = (Profit/Cost Price) × 100",
            "Ages": "Set up equations based on age differences and ratios.",
            "Averages": "Average = Sum of all values / Number of values",
            "Ratios": "Simplify ratios to their lowest terms first.",
            "Series": "Look for arithmetic, geometric, or pattern-based sequences.",
            "Mixtures": "Use weighted averages for mixture problems.",
            "Speed, Time & Distance": "Remember: Speed = Distance / Time",
            "OOP Concepts": "Focus on encapsulation, inheritance, polymorphism, abstraction.",
            "Data Structures": "Consider time/space complexity trade-offs.",
            "Algorithms": "Think about the most efficient approach.",
            "System Design": "Consider scalability, reliability, and maintainability.",
            "Database": "Focus on normalization, indexing, and query optimization.",
            "Networking": "Think about protocols, layers, and data flow.",
            "OS Concepts": "Consider processes, memory management, and scheduling.",
            "Arrays": "Think about time and space complexity constraints.",
            "Strings": "Consider character manipulation and pattern matching.",
            "Trees": "Remember tree traversal methods and properties.",
            "Graphs": "Think about traversal algorithms and shortest paths.",
            "Dynamic Programming": "Look for overlapping subproblems and optimal substructure.",
            "Sorting": "Consider stability, time complexity, and use cases.",
            "Recursion": "Identify base case and recursive case.",
            "Linked Lists": "Think about pointer manipulation and edge cases.",
            "Teamwork": "Focus on communication, collaboration, and conflict resolution.",
            "Leadership": "Consider vision, motivation, and decision-making.",
            "Conflict Resolution": "Think about empathy, communication, and win-win solutions.",
            "Experience": "Use STAR method: Situation, Task, Action, Result",
            "Challenges": "Focus on problem-solving and learning experiences.",
            "Goals": "Be specific about short-term and long-term objectives.",
            "Strengths/Weaknesses": "Be honest and show self-awareness with improvement plans."
        };
        
        const hint = hints[sessionState.subtopic] || "Focus on the core concept and apply it systematically.";
        addMessage('ai', `💡 Quick Hint: ${hint}`);
    }, 1000);
}

// Skip the current question
function skipQuestion() {
    if (!sessionState.sessionActive || !sessionState.waitingForAnswer || sessionState.timeRemaining <= 0) return;
    
    addMessage('ai', "Skipping... Next question!");
    sessionState.waitingForAnswer = false;
    
    setTimeout(() => {
        sessionState.currentQuestionIndex++;
        
        // Check if we've reached 10 questions
        if (sessionState.questionsAsked >= MAX_QUESTIONS_PER_SESSION) {
            endSession();
        } else {
            askNextQuestion();
        }
    }, 800);
}

// Add a message to the chat
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (sender === 'ai') {
        avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        contentDiv.innerHTML = text;
    } else {
        avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
        const textPara = document.createElement('p');
        textPara.textContent = text;
        contentDiv.appendChild(textPara);
    }
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Update session information panel
function updateSessionInfo() {
    infoQuestionsEl.textContent = sessionState.questionsAsked;
    infoCorrectEl.textContent = sessionState.correctAnswers;
    
    const progress = (sessionState.questionsAsked / MAX_QUESTIONS_PER_SESSION) * 100;
    
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
}

// Start session timer with countdown
function startTimer() {
    if (sessionState.timerInterval) {
        clearInterval(sessionState.timerInterval);
    }
    
    sessionState.timerInterval = setInterval(() => {
        if (sessionState.timeRemaining > 0) {
            sessionState.timeRemaining -= 1000;
            
            const minutes = Math.floor(sessionState.timeRemaining / 60000);
            const seconds = Math.floor((sessionState.timeRemaining % 60000) / 1000);
            
            // Update timer display with color coding
            let timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (sessionState.timeRemaining < 30000) { // Less than 30 seconds
                timeDisplay = `<span style="color: #ff4444; font-weight: bold;">${timeDisplay}</span>`;
            } else if (sessionState.timeRemaining < 60000) { // Less than 1 minute
                timeDisplay = `<span style="color: #ff6b6b;">${timeDisplay}</span>`;
            } else if (sessionState.timeRemaining < 120000) { // Less than 2 minutes
                timeDisplay = `<span style="color: #ffa726;">${timeDisplay}</span>`;
            }
            
            infoTimeEl.innerHTML = timeDisplay;
            
            // Warning messages
            if (sessionState.timeRemaining === 30000) {
                addMessage('ai', "⏰ <strong>30 seconds remaining!</strong> Final push!");
            } else if (sessionState.timeRemaining === 60000) {
                addMessage('ai', "⏰ <strong>1 minute remaining!</strong> Hurry up!");
            } else if (sessionState.timeRemaining === 120000) {
                addMessage('ai', "⏰ <strong>2 minutes remaining!</strong> Keep going!");
            }
        } else {
            // Time's up
            clearInterval(sessionState.timerInterval);
            endSession();
        }
    }, 1000);
}

// Save subtopic score
function saveSubtopicScore(accuracy) {
    const subtopicKey = `${sessionState.topic}-${sessionState.subtopic}`;
    
    if (!sessionState.subtopicScores[subtopicKey]) {
        sessionState.subtopicScores[subtopicKey] = {
            topic: sessionState.topic,
            subtopic: sessionState.subtopic,
            sessionsCompleted: 0,
            bestScore: 0,
            averageScore: 0,
            totalQuestions: 0,
            totalCorrect: 0,
            lastSession: new Date().toISOString()
        };
    }
    
    const scoreData = sessionState.subtopicScores[subtopicKey];
    scoreData.sessionsCompleted++;
    scoreData.totalQuestions += sessionState.questionsAsked;
    scoreData.totalCorrect += sessionState.correctAnswers;
    scoreData.bestScore = Math.max(scoreData.bestScore, accuracy);
    scoreData.averageScore = Math.round((scoreData.totalCorrect / scoreData.totalQuestions) * 100);
    scoreData.lastSession = new Date().toISOString();
    
    // Save to localStorage
    localStorage.setItem('subtopicScores', JSON.stringify(sessionState.subtopicScores));
}

// Show session summary
function showSessionSummary() {
    const subtopicKey = `${sessionState.topic}-${sessionState.subtopic}`;
    const scoreData = sessionState.subtopicScores[subtopicKey];
    
    if (scoreData && scoreData.sessionsCompleted > 1) {
        const summaryMessage = `\n\n📈 <strong>${sessionState.subtopic} Progress Summary:</strong>\n` +
                              `Sessions Completed: ${scoreData.sessionsCompleted}\n` +
                              `Best Score: ${scoreData.bestScore}%\n` +
                              `Average Score: ${scoreData.averageScore}%\n` +
                              `Total Questions: ${scoreData.totalQuestions}\n` +
                              `Total Correct: ${scoreData.totalCorrect}`;
        
        // Add a small delay before showing summary
        setTimeout(() => {
            addMessage('ai', summaryMessage);
        }, 1000);
    }
}

// Helper function to format time
function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Helper function to get performance message
function getPerformanceMessage(accuracy) {
    if (accuracy >= 90) return "Excellent! 🎯";
    if (accuracy >= 80) return "Very Good! 👍";
    if (accuracy >= 70) return "Good job! 👏";
    if (accuracy >= 60) return "Not bad! 💪";
    return "Keep practicing! 📚";
}

// Go back to subtopics page
function goBack() {
    // Clear timer before leaving
    if (sessionState.timerInterval) {
        clearInterval(sessionState.timerInterval);
    }
    window.location.href = 'subtopics.html';
}