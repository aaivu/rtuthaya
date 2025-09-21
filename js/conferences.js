document.addEventListener('DOMContentLoaded', async function () {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');

    if (mobileMenuBtn && mobileNavMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNavMenu.classList.toggle('hidden');
        });
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            searchConferences(e.target.value);
        });
    }

    // Load and display conferences
    await loadConferences();
});

let allConferences = [];
let filteredConferences = [];
let currentFilter = 'all';

async function loadConferences() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const conferencesContainer = document.getElementById('conferences-container');

    try {
        // Show loading state
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        conferencesContainer.innerHTML = '';

        // Load conferences data
        const response = await fetch('data/conferences.json');
        if (!response.ok) throw new Error('Failed to load conferences');

        const data = await response.json();
        allConferences = data.conferences;
        filteredConferences = [...allConferences];

        // Hide loading state
        loadingElement.classList.add('hidden');

        // Sort conferences by submission deadline (upcoming first)
        sortConferences();

        // Display conferences
        displayConferences(filteredConferences);
    } catch (error) {
        console.error('Error loading conferences:', error);
        loadingElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
    }
}

function sortConferences() {
    const today = new Date();

    filteredConferences.sort((a, b) => {
        const aSubmission = new Date(a.submissionDate);
        const bSubmission = new Date(b.submissionDate);
        const aConference = new Date(a.conferenceDate);
        const bConference = new Date(b.conferenceDate);

        // Prioritize conferences with upcoming submission deadlines
        const aSubmissionOpen = aSubmission > today;
        const bSubmissionOpen = bSubmission > today;

        if (aSubmissionOpen && !bSubmissionOpen) return -1;
        if (!aSubmissionOpen && bSubmissionOpen) return 1;

        // If both have upcoming submissions or both are closed, sort by submission date
        if (aSubmissionOpen && bSubmissionOpen) {
            return aSubmission - bSubmission;
        }

        // For closed submissions, sort by conference date
        return aConference - bConference;
    });
}

function displayConferences(conferences) {
    const container = document.getElementById('conferences-container');
    const noResults = document.getElementById('no-results');

    if (conferences.length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');

    container.innerHTML = conferences.map((conference, index) => createConferenceCard(conference, index)).join('');
}

function createConferenceCard(conference, index) {
    const today = new Date();
    const submissionDate = new Date(conference.submissionDate);
    const conferenceDate = new Date(conference.conferenceDate);

    const isSubmissionOpen = submissionDate > today;
    const isConferenceUpcoming = conferenceDate > today;
    const daysToSubmission = Math.ceil((submissionDate - today) / (1000 * 60 * 60 * 24));
    const daysToConference = Math.ceil((conferenceDate - today) / (1000 * 60 * 60 * 24));

    let cardClasses = 'conference-card bg-white rounded-2xl shadow-sm border-0 p-6 fade-in';

    if (isSubmissionOpen && daysToSubmission <= 30) {
        cardClasses += ' deadline-soon';
    } else if (!isSubmissionOpen && !isConferenceUpcoming) {
        cardClasses += ' deadline-past';
    }

    const typeIcon = conference.type === 'workshop' ? 'fas fa-tools' : 'fas fa-university';
    const typeColor = conference.type === 'workshop' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';

    return `
        <div class="${cardClasses}" style="animation-delay: ${index * 0.1}s">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-xl font-bold text-slate-800">${conference.acronym}</h3>
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${typeColor}">
                            <i class="${typeIcon} mr-1"></i>${conference.type.charAt(0).toUpperCase() + conference.type.slice(1)}
                        </span>
                    </div>
                    <h4 class="text-lg text-gray-700 font-medium mb-2">${conference.name}</h4>
                    <p class="text-gray-600 flex items-center">
                        <i class="fas fa-map-marker-alt mr-2"></i>
                        ${conference.location}
                    </p>
                </div>

                ${
    isSubmissionOpen && daysToSubmission <= 30
        ? `
                    <div class="text-right">
                        <span class="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                            <i class="fas fa-clock mr-1"></i>
                            ${daysToSubmission} days left
                        </span>
                    </div>
                `
        : ''
}
            </div>

            <!-- Dates -->
            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <div class="flex items-center text-sm">
                    <div class="w-3 h-3 rounded-full ${isSubmissionOpen ? 'bg-green-500' : 'bg-red-400'} mr-2"></div>
                    <div>
                        <span class="text-gray-600">Submission:</span>
                        <span class="font-medium ml-1">${formatDate(conference.submissionDate)}</span>
                    </div>
                </div>
                <div class="flex items-center text-sm">
                    <div class="w-3 h-3 rounded-full ${isConferenceUpcoming ? 'bg-blue-500' : 'bg-gray-400'} mr-2"></div>
                    <div>
                        <span class="text-gray-600">Conference:</span>
                        <span class="font-medium ml-1">${formatDate(conference.conferenceDate)}</span>
                    </div>
                </div>
            </div>

            <!-- Topics -->
            <div class="mb-4">
                <div class="flex flex-wrap gap-2">
                    ${conference.topics
        .map(topic => {
            const colorClass = getTopicColor(topic);
            return `<span class="px-2 py-1 rounded-full text-xs font-medium ${colorClass}">${topic}</span>`;
        })
        .join('')}
                </div>
            </div>

            <!-- Action Button -->
            <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                    ${
    isSubmissionOpen
        ? '<i class="fas fa-paper-plane mr-1 text-green-600"></i>Submissions Open'
        : '<i class="fas fa-times-circle mr-1 text-red-500"></i>Submissions Closed'
}
                </div>
                <a href="${conference.website}"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <i class="fas fa-external-link-alt mr-2"></i>
                    Visit Website
                </a>
            </div>
        </div>
    `;
}

function getTopicColor(topic) {
    const colors = {
        'Artificial Intelligence': 'bg-blue-50 text-blue-700',
        'Machine Learning': 'bg-green-50 text-green-700',
        'Data Science': 'bg-purple-50 text-purple-700',
        'Computer Vision': 'bg-orange-50 text-orange-700',
        'Image Processing': 'bg-red-50 text-red-700'
    };
    return colors[topic] || 'bg-gray-50 text-gray-700';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Filter functions
window.filterConferences = function (filterType) {
    currentFilter = filterType;

    // Update active filter button
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.target.classList.add('active');

    const today = new Date();

    switch (filterType) {
    case 'all':
        filteredConferences = [...allConferences];
        break;
    case 'conference':
        filteredConferences = allConferences.filter(conf => conf.type === 'conference');
        break;
    case 'workshop':
        filteredConferences = allConferences.filter(conf => conf.type === 'workshop');
        break;
    case 'open':
        filteredConferences = allConferences.filter(conf => {
            const submissionDate = new Date(conf.submissionDate);
            return submissionDate > today;
        });
        break;
    case 'upcoming':
        filteredConferences = allConferences.filter(conf => {
            const conferenceDate = new Date(conf.conferenceDate);
            return conferenceDate > today;
        });
        break;
    }

    sortConferences();
    displayConferences(filteredConferences);
};

window.filterByTopic = function (topic) {
    // Toggle active state
    event.target.classList.toggle('opacity-50');

    const activeTopics = Array.from(document.querySelectorAll('.topic-chip.opacity-50')).map(chip =>
        chip.textContent.trim()
    );

    if (activeTopics.length === 0) {
        filteredConferences = [...allConferences];
    } else {
        const topicMap = {
            AI: 'Artificial Intelligence',
            ML: 'Machine Learning',
            'Data Science': 'Data Science',
            'Computer Vision': 'Computer Vision',
            'Image Processing': 'Image Processing'
        };

        const selectedTopics = activeTopics.map(t => topicMap[t] || t);

        filteredConferences = allConferences.filter(conf => conf.topics.some(topic => selectedTopics.includes(topic)));
    }

    // Apply current filter as well
    if (currentFilter !== 'all') {
        filterConferences(currentFilter);
        return;
    }

    sortConferences();
    displayConferences(filteredConferences);
};

function searchConferences(query) {
    if (!query.trim()) {
        // If search is empty, show current filtered results
        displayConferences(filteredConferences);
        return;
    }

    const searchTerm = query.toLowerCase();
    const searchResults = filteredConferences.filter(
        conf =>
            conf.name.toLowerCase().includes(searchTerm) ||
            conf.acronym.toLowerCase().includes(searchTerm) ||
            conf.location.toLowerCase().includes(searchTerm) ||
            conf.topics.some(topic => topic.toLowerCase().includes(searchTerm))
    );

    displayConferences(searchResults);
}

window.searchConferences = searchConferences;
