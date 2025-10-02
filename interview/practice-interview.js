// Practice Interview JavaScript

// YouTube links data
const youtubeResources = {
    aptitude: [
        {
            title: "Aptitude Made Easy - Complete Course",
            description: "Complete quantitative aptitude tutorial for interviews",
            url: "https://www.youtube.com/watch?v=GYL1fyZoqRw",
            duration: "2:15:30"
        },
        {
            title: "Quantitative Aptitude Tricks",
            description: "Shortcuts and tricks for faster calculations",
            url: "https://www.youtube.com/watch?v=8jLOx1hD3_o",
            duration: "45:20"
        },
        {
            title: "Logical Reasoning Masterclass",
            description: "Complete logical reasoning and puzzles tutorial",
            url: "https://www.youtube.com/watch?v=7uV7h7t7_7c",
            duration: "1:30:15"
        }
    ],
    
    technical: [
        {
            title: "OOP Concepts Explained",
            description: "Object-Oriented Programming concepts with examples",
            url: "https://www.youtube.com/watch?v=pTB0EiLXUC8",
            duration: "35:45"
        },
        {
            title: "Data Structures & Algorithms",
            description: "Complete DSA course for technical interviews",
            url: "https://www.youtube.com/watch?v=8hly31xKli0",
            duration: "8:15:20"
        },
        {
            title: "System Design Basics",
            description: "System design principles and interview questions",
            url: "https://www.youtube.com/watch?v=UzLMhqg3_Wc",
            duration: "1:22:10"
        }
    ],
    coding: [
        {
            title: "Array Problems & Solutions",
            description: "Common array-based coding interview problems",
            url: "https://www.youtube.com/watch?v=QJ1wfko0OZQ",
            duration: "50:30"
        },
        {
            title: "Dynamic Programming",
            description: "DP patterns and problem-solving strategies",
            url: "https://www.youtube.com/watch?v=oBt53YbR9Kk",
            duration: "2:45:15"
        },
        {
            title: "Tree Algorithms",
            description: "Binary trees, BST, and tree traversal algorithms",
            url: "https://www.youtube.com/watch?v=oz9cEqFynHU",
            duration: "1:15:40"
        }
    ],
    behavioral: [
        {
            title: "Behavioral Interview Tips",
            description: "How to answer behavioral questions effectively",
            url: "https://www.youtube.com/watch?v=PJKYqLP6MRE",
            duration: "25:15"
        },
        {
            title: "STAR Method Explained",
            description: "Master the STAR method for behavioral interviews",
            url: "https://www.youtube.com/watch?v=81nV4CJN0uQ",
            duration: "18:30"
        },
        {
            title: "Leadership Questions",
            description: "How to answer leadership and teamwork questions",
            url: "https://www.youtube.com/watch?v=G-aVEpK0pD4",
            duration: "22:45"
        }
    ]
};

// Navigation functions
function goBack() {
    window.location.href = 'topic-selection.html';
}

function startMockInterview() {
    // Start a mock interview session
    const confirmed = confirm("Ready to start a mock interview? This will test your knowledge across all categories.");
    if (confirmed) {
        // Redirect to mock interview page or start session
        alert("Mock interview session starting... (This would redirect to the interview interface)");
        // window.location.href = 'mock-interview.html';
    }
}

function openAllResources() {
    // Open all YouTube links in new tabs
    const allLinks = [
        ...youtubeResources.aptitude,
        ...youtubeResources.technical,
        ...youtubeResources.coding,
        ...youtubeResources.behavioral
    ];
    
    const confirmed = confirm(`This will open ${allLinks.length} YouTube resources in new tabs. Continue?`);
    
    if (confirmed) {
        allLinks.forEach(link => {
            window.open(link.url, '_blank');
        });
    }
}

// Track resource views
function trackResourceView(resourceTitle, category) {
    console.log(`Resource viewed: ${resourceTitle} (${category})`);
    // Here you would typically send this data to your analytics service
}

// Add click tracking to YouTube links
document.addEventListener('DOMContentLoaded', function() {
    const youtubeLinks = document.querySelectorAll('.youtube-link');
    
    youtubeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const title = this.querySelector('h4').textContent;
            const category = this.closest('.resource-category').querySelector('h2').textContent;
            trackResourceView(title, category);
        });
    });
    
    // Add animation to resource categories
    const resourceCategories = document.querySelectorAll('.resource-category');
    
    resourceCategories.forEach((category, index) => {
        category.style.animationDelay = `${index * 0.1}s`;
        category.classList.add('fade-in-up');
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
    
    .resource-category {
        animation-fill-mode: both;
    }
`;
document.head.appendChild(style);

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        goBack();
    }
    
    if (e.key === 'm' || e.key === 'M') {
        startMockInterview();
    }
});

// Progress tracking (optional feature)
let watchedResources = JSON.parse(localStorage.getItem('watchedResources') || '{}');

function markAsWatched(resourceTitle, category) {
    if (!watchedResources[category]) {
        watchedResources[category] = [];
    }
    
    if (!watchedResources[category].includes(resourceTitle)) {
        watchedResources[category].push(resourceTitle);
        localStorage.setItem('watchedResources', JSON.stringify(watchedResources));
        updateProgress();
    }
}

function updateProgress() {
    const totalResources = 12; // 3 resources per category × 4 categories
    let watchedCount = 0;
    
    Object.values(watchedResources).forEach(category => {
        watchedCount += category.length;
    });
    
    const progress = (watchedCount / totalResources) * 100;
    console.log(`Progress: ${progress.toFixed(1)}% (${watchedCount}/${totalResources} resources watched)`);
    
    // You could update a progress bar in the UI here
} 