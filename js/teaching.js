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
            searchCourses(e.target.value);
        });
    }

    // Load and display teaching data
    await loadTeachingData();
});

let allCourses = [];
let filteredCourses = [];
let currentFilter = 'all';
const selectedCategories = new Set();

async function loadTeachingData() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const coursesContainer = document.getElementById('courses-container');

    try {
        // Show loading state
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        coursesContainer.innerHTML = '';

        // Load teaching data
        const response = await fetch('data/teaching.json');
        if (!response.ok) throw new Error('Failed to load teaching data');

        const data = await response.json();
        allCourses = data.teaching.courses;
        filteredCourses = [...allCourses];

        // Hide loading state
        loadingElement.classList.add('hidden');

        // Display summary statistics
        displaySummaryStats(data.teaching.summary);

        // Generate category filters
        generateCategoryFilters(data.teaching.categories);

        // Sort and display courses
        sortCourses();
        displayCourses(filteredCourses);
    } catch (error) {
        console.error('Error loading teaching data:', error);
        loadingElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
    }
}

function displaySummaryStats(summary) {
    const summaryContainer = document.getElementById('summary-stats');

    summaryContainer.innerHTML = `
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
            <h2 class="text-2xl font-bold text-slate-800 text-center mb-6">Teaching Overview</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div class="bg-white rounded-xl p-4 shadow-sm">
                    <div class="text-3xl font-bold text-blue-600 mb-2">${summary.totalCourses}+</div>
                    <div class="text-sm text-gray-600 font-medium">Total Courses</div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm">
                    <div class="text-3xl font-bold text-green-600 mb-2">${summary.yearsOfTeaching}</div>
                    <div class="text-sm text-gray-600 font-medium">Years Experience</div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm">
                    <div class="text-3xl font-bold text-purple-600 mb-2">${summary.degrees.length}</div>
                    <div class="text-sm text-gray-600 font-medium">Degree Programs</div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm">
                    <div class="text-3xl font-bold text-orange-600 mb-2">${summary.roles.length}</div>
                    <div class="text-sm text-gray-600 font-medium">Teaching Roles</div>
                </div>
            </div>

            <div class="mt-8 grid md:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-3">Degree Programs</h4>
                    <div class="flex flex-wrap gap-2">
                        ${summary.degrees
                            .map(
                                degree =>
                                    `<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">${degree}</span>`
                            )
                            .join('')}
                    </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-3">Teaching Roles</h4>
                    <div class="flex flex-wrap gap-2">
                        ${summary.roles
                            .map(
                                role =>
                                    `<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">${role}</span>`
                            )
                            .join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateCategoryFilters(categories) {
    const categoriesContainer = document.getElementById('categories-container');

    const categoryButtons = Object.keys(categories)
        .map(category => {
            const categoryData = categories[category];
            const colorClass = getCategoryColorClass(categoryData.color);
            return `<button onclick="toggleCategoryFilter('${category}')"
                        class="category-chip px-3 py-1 rounded-full text-xs font-medium ${colorClass.bg} ${colorClass.text} hover:opacity-80 transition-all cursor-pointer">
                    <i class="${categoryData.icon} mr-1"></i>${category} (${categoryData.count})
                </button>`;
        })
        .join('');

    categoriesContainer.innerHTML = `
        <span class="text-sm font-medium text-gray-700">Categories:</span>
        ${categoryButtons}
    `;
}

function getCategoryColorClass(color) {
    const colorMap = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
        green: { bg: 'bg-green-100', text: 'text-green-700' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-700' },
        gray: { bg: 'bg-gray-100', text: 'text-gray-700' },
        red: { bg: 'bg-red-100', text: 'text-red-700' },
        indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
        pink: { bg: 'bg-pink-100', text: 'text-pink-700' },
        yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
        teal: { bg: 'bg-teal-100', text: 'text-teal-700' },
        cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700' }
    };
    return colorMap[color] || { bg: 'bg-gray-100', text: 'text-gray-700' };
}

function sortCourses() {
    filteredCourses.sort((a, b) => {
        // Sort by intake (newest first), then by semester
        const intakeA = parseInt(a.intake.replace('In', ''));
        const intakeB = parseInt(b.intake.replace('In', ''));

        if (intakeA !== intakeB) {
            return intakeB - intakeA; // Newest first
        }

        // If same intake, sort by semester
        const semesterA = parseInt(a.semester.replace('S', ''));
        const semesterB = parseInt(b.semester.replace('S', ''));
        return semesterB - semesterA;
    });
}

function displayCourses(courses) {
    const container = document.getElementById('courses-container');
    const noResults = document.getElementById('no-results');

    if (courses.length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');

    // Group courses by intake year for better organization
    const groupedCourses = groupCoursesByIntake(courses);

    container.innerHTML = Object.keys(groupedCourses)
        .sort((a, b) => parseInt(b.replace('In', '')) - parseInt(a.replace('In', '')))
        .map(intake => createIntakeSection(intake, groupedCourses[intake]))
        .join('');
}

function groupCoursesByIntake(courses) {
    return courses.reduce((groups, course) => {
        const intake = course.intake;
        if (!groups[intake]) groups[intake] = [];
        groups[intake].push(course);
        return groups;
    }, {});
}

function createIntakeSection(intake, courses) {
    const intakeYear = `20${intake.replace('In', '')}`;

    return `
        <div class="bg-white rounded-2xl shadow-sm border-0 p-6 fade-in">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-slate-800">Intake ${intake} (${intakeYear})</h3>
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">${courses.length} courses</span>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${courses.map(course => createCourseCard(course)).join('')}
            </div>
        </div>
    `;
}

function createCourseCard(course) {
    const categoryColor = getCategoryColor(course.category);
    const roleColor = getRoleColor(course.role);
    const levelIcon = course.level === 'Undergraduate' ? 'fas fa-user-graduate' : 'fas fa-university';

    return `
        <div class="course-card bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-white transition-all">
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 ${categoryColor.bg} rounded-lg flex items-center justify-center">
                        <i class="fas fa-book ${categoryColor.text} text-sm"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-800 text-sm">${course.code}</h4>
                        <span class="text-xs ${categoryColor.text} font-medium">${course.category}</span>
                    </div>
                </div>
                <span class="px-2 py-1 ${roleColor.bg} ${roleColor.text} text-xs rounded-full font-medium">${course.role}</span>
            </div>

            <h5 class="font-semibold text-gray-800 mb-2 text-sm leading-tight">${course.name}</h5>

            <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span class="flex items-center">
                    <i class="${levelIcon} mr-1"></i>
                    ${course.level}
                </span>
                <span>${course.semester}</span>
            </div>

            <div class="text-xs text-gray-600 leading-relaxed">
                <strong>Program:</strong> ${course.degree}
            </div>
        </div>
    `;
}

function getCategoryColor(category) {
    const colors = {
        'Machine Learning': { bg: 'bg-blue-50', text: 'text-blue-600' },
        'Data Science': { bg: 'bg-green-50', text: 'text-green-600' },
        'AI & NLP': { bg: 'bg-purple-50', text: 'text-purple-600' },
        'Big Data': { bg: 'bg-orange-50', text: 'text-orange-600' },
        Programming: { bg: 'bg-gray-50', text: 'text-gray-600' },
        Analytics: { bg: 'bg-red-50', text: 'text-red-600' },
        Statistics: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
        Research: { bg: 'bg-pink-50', text: 'text-pink-600' },
        'Information Systems': { bg: 'bg-yellow-50', text: 'text-yellow-600' },
        'Business Intelligence': { bg: 'bg-teal-50', text: 'text-teal-600' },
        Projects: { bg: 'bg-cyan-50', text: 'text-cyan-600' }
    };
    return colors[category] || { bg: 'bg-gray-50', text: 'text-gray-600' };
}

function getRoleColor(role) {
    const colors = {
        'Main Examiner': { bg: 'bg-green-100', text: 'text-green-800' },
        Moderator: { bg: 'bg-blue-100', text: 'text-blue-800' },
        'Co Examiner': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
        Evaluator: { bg: 'bg-purple-100', text: 'text-purple-800' }
    };
    return colors[role] || { bg: 'bg-gray-100', text: 'text-gray-800' };
}

// Filter functions
window.filterCourses = function (filterType) {
    currentFilter = filterType;

    // Update active filter button
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.target.classList.add('active');

    applyFilters();
};

window.toggleCategoryFilter = function (category) {
    const button = event.target.closest('.category-chip');

    if (selectedCategories.has(category)) {
        selectedCategories.delete(category);
        button.classList.remove('active');
    } else {
        selectedCategories.add(category);
        button.classList.add('active');
    }

    applyFilters();
};

function applyFilters() {
    let filtered = [...allCourses];

    // Apply level/role filter
    switch (currentFilter) {
        case 'undergraduate':
            filtered = filtered.filter(course => course.level === 'Undergraduate');
            break;
        case 'postgraduate':
            filtered = filtered.filter(course => course.level === 'Postgraduate');
            break;
        case 'main_examiner':
            filtered = filtered.filter(course => course.role === 'Main Examiner');
            break;
        case 'moderator':
            filtered = filtered.filter(course => course.role === 'Moderator');
            break;
        // 'all' case - no additional filtering
    }

    // Apply category filter
    if (selectedCategories.size > 0) {
        filtered = filtered.filter(course => selectedCategories.has(course.category));
    }

    filteredCourses = filtered;
    sortCourses();
    displayCourses(filteredCourses);
}

function searchCourses(query) {
    if (!query.trim()) {
        // If search is empty, show current filtered results
        applyFilters();
        return;
    }

    const searchTerm = query.toLowerCase();
    const searchResults = filteredCourses.filter(
        course =>
            course.name.toLowerCase().includes(searchTerm) ||
            course.code.toLowerCase().includes(searchTerm) ||
            course.degree.toLowerCase().includes(searchTerm) ||
            course.category.toLowerCase().includes(searchTerm) ||
            course.intake.toLowerCase().includes(searchTerm)
    );

    displayCourses(searchResults);
}

window.searchCourses = searchCourses;
