// Topic data with subtopics
const topicsData = {
    aptitude: {
        name: "Aptitude Questions",
        subtopics: [
            { name: "Probability", icon: "🎲", description: "Practice probability problems and scenarios" },
            { name: "Percentages", icon: "📊", description: "Percentage calculations and applications" },
            { name: "Time & Work", icon: "⏰", description: "Time, work, and efficiency problems" },
            { name: "Profit & Loss", icon: "💰", description: "Business mathematics and calculations" },
            { name: "Ages", icon: "👥", description: "Age-related problems and ratios" },
            { name: "Averages", icon: "⚖️", description: "Average calculations and applications" },
            { name: "Ratios", icon: "📐", description: "Ratio and proportion problems" },
            { name: "Series", icon: "🔢", description: "Number series and sequences" },
            { name: "Mixtures", icon: "🧪", description: "Mixture and alligation problems" }
        ],
        description: "Practice probability, percentages, time & work, and reasoning questions"
    },
    technical: {
        name: "Technical Questions",
        subtopics: [
            { name: "OOP Concepts", icon: "🔄", description: "Object-Oriented Programming principles" },
            { name: "Data Structures", icon: "🏗️", description: "Arrays, lists, trees, and more" },
            { name: "Algorithms", icon: "⚡", description: "Sorting, searching, and optimization" },
            { name: "Database", icon: "💾", description: "SQL, NoSQL, and database design" },
            { name: "Networking", icon: "🌐", description: "Network protocols and concepts" },
            { name: "OS Concepts", icon: "🖥️", description: "Operating system fundamentals" },
            { name: "System Design", icon: "🏢", description: "Scalable system architecture" }
        ],
        description: "OOP concepts, data structures, algorithms, and system design"
    },
    coding: {
        name: "Coding Problems",
        subtopics: [
            { name: "Arrays", icon: "📦", description: "Array manipulation and algorithms" },
            { name: "Strings", icon: "🔤", description: "String operations and patterns" },
            { name: "Linked Lists", icon: "⛓️", description: "Linked list problems and solutions" },
            { name: "Trees", icon: "🌳", description: "Tree data structures and traversals" },
            { name: "Graphs", icon: "📈", description: "Graph algorithms and problems" },
            { name: "Dynamic Programming", icon: "🎯", description: "DP patterns and optimization" },
            { name: "Recursion", icon: "🌀", description: "Recursive problem solving" },
            { name: "Sorting", icon: "🔍", description: "Sorting algorithms and techniques" }
        ],
        description: "Arrays, strings, trees, graphs, and dynamic programming"
    },
    behavioral: {
        name: "Behavioral Questions",
        subtopics: [
            { name: "Teamwork", icon: "👨‍👩‍👧‍👦", description: "Collaboration and team dynamics" },
            { name: "Leadership", icon: "🌟", description: "Leadership experiences and skills" },
            { name: "Conflict Resolution", icon: "⚖️", description: "Handling conflicts professionally" },
            { name: "Strengths/Weaknesses", icon: "💪", description: "Self-assessment and growth" },
            { name: "Goals", icon: "🎯", description: "Career goals and aspirations" },
            { name: "Challenges", icon: "🏔️", description: "Overcoming difficult situations" },
            { name: "Experience", icon: "📚", description: "Professional experience stories" }
        ],
        description: "Teamwork, leadership, conflict resolution, and experience-based"
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadSelectedTopic();
});

// Load the selected topic and display subtopics
function loadSelectedTopic() {
    const selectedTopic = localStorage.getItem('selectedTopic');
    
    if (!selectedTopic || !topicsData[selectedTopic]) {
        // If no valid topic is selected, redirect back to topic selection
        window.location.href = 'topic-selection.html';
        return;
    }
    
    const topic = topicsData[selectedTopic];
    
    // Update page title and header
    document.getElementById('topic-title').textContent = topic.name;
    document.getElementById('topic-description').textContent = topic.description;
    
    // Display subtopics
    displaySubtopics(topic.subtopics, selectedTopic);
}

// Display subtopics in the grid
function displaySubtopics(subtopics, topicKey) {
    const grid = document.getElementById('subtopics-grid');
    grid.innerHTML = '';
    
    if (!subtopics || subtopics.length === 0) {
        grid.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';
        return;
    }
    
    subtopics.forEach((subtopic, index) => {
        const card = createSubtopicCard(subtopic, topicKey, index);
        grid.appendChild(card);
    });
}

// Create a subtopic card element
function createSubtopicCard(subtopic, topicKey, index) {
    const card = document.createElement('div');
    card.className = 'subtopic-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('fade-in-up');
    
    card.innerHTML = `
        <div class="subtopic-icon">${subtopic.icon}</div>
        <h3>${subtopic.name}</h3>
        <p>${subtopic.description}</p>
        <button class="start-practice-btn" onclick="startPractice('${topicKey}', '${subtopic.name}')">
            Start Practice
        </button>
    `;
    
    // Add click event to entire card
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('start-practice-btn')) {
            startPractice(topicKey, subtopic.name);
        }
    });
    
    return card;
}

// Start practice with selected subtopic
function startPractice(topicKey, subtopicName) {
    // Store selected subtopic in localStorage
    localStorage.setItem('selectedSubtopic', subtopicName);
    localStorage.setItem('selectedTopicKey', topicKey);
    
    // Redirect to chat interface
    window.location.href = 'chat-interface.html';
}

// Go back to topic selection
function goBack() {
    window.location.href = 'topic-selection.html';
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(30px);
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .subtopic-card {
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .subtopic-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .subtopic-card:focus {
        outline: 3px solid #4a54e1;
        outline-offset: 2px;
    }
    
    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        grid-column: 1 / -1;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #4a54e1;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .start-practice-btn {
        background: #4a54e1;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.9rem;
        margin-top: 10px;
        transition: background 0.2s ease;
    }
    
    .start-practice-btn:hover {
        background: #3a44d1;
    }
`;
document.head.appendChild(style);

// Handle browser back button
window.addEventListener('popstate', function() {
    goBack();
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    const cards = document.querySelectorAll('.subtopic-card');
    const currentCard = document.activeElement.closest('.subtopic-card');
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextCard = currentCard ? currentCard.nextElementSibling : cards[0];
        if (nextCard) nextCard.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevCard = currentCard ? currentCard.previousElementSibling : cards[cards.length - 1];
        if (prevCard) prevCard.focus();
    } else if (e.key === 'Enter' && currentCard) {
        e.preventDefault();
        currentCard.click();
    } else if (e.key === 'Escape') {
        goBack();
    }
});