// Topic data with subtopics
const topicsData = {
    aptitude: {
        name: "Aptitude Questions",
        subtopics: ["Probability", "Percentages", "Time & Work", "Profit & Loss", "Ages", "Average", "Ratio", "Series", "Mixtures"],
        description: "Practice probability, percentages, time & work, and reasoning questions"
    },
    technical: {
        name: "Technical Questions",
        subtopics: ["OOP Concepts", "Data Structures", "Algorithms", "Database", "Networking", "OS Concepts", "System Design"],
        description: "OOP concepts, data structures, algorithms, and system design"
    },
    coding: {
        name: "Coding Problems",
        subtopics: ["Arrays", "Strings", "Linked Lists", "Trees", "Graphs", "Dynamic Programming", "Recursion", "Sorting"],
        description: "Arrays, strings, trees, graphs, and dynamic programming"
    },
    behavioral: {
        name: "Behavioral Questions",
        subtopics: ["Teamwork", "Leadership", "Conflict Resolution", "Strengths/Weaknesses", "Goals", "Challenges", "Experience"],
        description: "Teamwork, leadership, conflict resolution, and experience-based"
    },
    // ADDED: Practice Interview data
    "practice-interview": {
        name: "Practice Interview",
        subtopics: ["Complete Interview Preparation", "YouTube Resources", "Mock Interviews", "All Categories Combined"],
        description: "Complete interview preparation with YouTube resources for all categories",
        youtubeLinks: {
            aptitude: [
                "https://www.youtube.com/watch?v=GYL1fyZoqRw",
                "https://www.youtube.com/watch?v=9Y5H__yn9dM",
                "https://www.youtube.com/watch?v=7uV7h7t7_7c"
            ],
            technical: [
                "https://www.youtube.com/watch?v=pTB0EiLXUC8",
                "https://www.youtube.com/watch?v=8hly31xKli0",
                "https://www.youtube.com/watch?v=UzLMhqg3_Wc"
            ],
            coding: [
                "https://www.youtube.com/watch?v=QJ1wfko0OZQ",
                "https://www.youtube.com/watch?v=oBt53YbR9Kk",
                "https://www.youtube.com/watch?v=oz9cEqFynHU"
            ],
            behavioral: [
                "https://www.youtube.com/watch?v=PJKYqLP6MRE",
                "https://www.youtube.com/watch?v=81nV4CJN0uQ",
                "https://www.youtube.com/watch?v=G-aVEpK0pD4"
            ]
        }
    }
};

// Handle topic selection
function selectTopic(topic) {
    // Store selected topic in localStorage
    localStorage.setItem('selectedTopic', topic);
    
    // For practice-interview, show YouTube resources
    if (topic === 'practice-interview') {
        showPracticeInterviewResources();
    } else {
        // Redirect to subtopics page for other topics
        window.location.href = 'subtopics.html';
    }
}

// ADDED: Function to show practice interview resources
function showPracticeInterviewResources() {
    const topicData = topicsData['practice-interview'];
    
    // Create a modal or redirect to a page with YouTube resources
    alert(`🎯 Practice Interview Resources\n\nThis section contains YouTube links for:\n• Aptitude Questions\n• Technical Questions\n• Coding Problems\n• Behavioral Questions\n\nRedirecting to practice resources...`);
    
    // You can replace this with actual modal implementation
    // For now, we'll redirect to a practice page
    window.location.href = 'practice-interview.html';
}

// Add animation effects to topic cards
document.addEventListener('DOMContentLoaded', function() {
    const topicCards = document.querySelectorAll('.topic-card');
    
    topicCards.forEach((card, index) => {
        // Add staggered animation
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
        
        // Add click effect
        card.addEventListener('click', function() {
            const topic = this.getAttribute('data-topic');
            selectTopic(topic);
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        const topicCards = document.querySelectorAll('.topic-card');
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            // Simple keyboard navigation for demonstration
            const currentFocus = document.activeElement;
            // Implementation would depend on specific focus management
        }
    });
});

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
    
    .topic-card {
        cursor: pointer;
    }
    
    .topic-card:focus {
        outline: 3px solid #4a54e1;
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);