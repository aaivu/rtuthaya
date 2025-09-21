// Students page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Load and display students
    loadStudents();
});

let allStudents = [];
let filteredStudents = [];
let currentFilter = 'all';

async function loadStudents() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const studentsContainer = document.getElementById('students-container');
    const statisticsContainer = document.getElementById('statistics');

    try {
        // Show loading state
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        studentsContainer.classList.add('hidden');

        // Fetch students data
        const response = await fetch('data/students.json');
        if (!response.ok) {
            throw new Error('Failed to fetch students data');
        }

        const data = await response.json();
        const studentsData = data.students;

        // Combine undergraduate and postgraduate students
        allStudents = [
            ...studentsData.undergraduate.map(student => ({ ...student, level: 'undergraduate' })),
            ...studentsData.postgraduate.map(student => ({ ...student, level: 'postgraduate' }))
        ];

        // Sort students - featured first, then alphabetically
        allStudents.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return a.name.localeCompare(b.name);
        });

        filteredStudents = [...allStudents];

        // Hide loading and show content
        loadingElement.classList.add('hidden');
        studentsContainer.classList.remove('hidden');

        // Display statistics
        displayStatistics(studentsData.summary);

        // Display students
        displayStudents(filteredStudents);
    } catch (error) {
        console.error('Error loading students:', error);
        loadingElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
    }
}

function displayStatistics(summary) {
    const statisticsContainer = document.getElementById('statistics');

    statisticsContainer.innerHTML = `
        <h2 class="text-2xl font-bold text-slate-800 mb-6 text-center">Student Statistics</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="text-center p-4 bg-blue-50 rounded-xl">
                <div class="text-3xl font-bold text-blue-600">${summary.totalStudents}</div>
                <div class="text-sm text-blue-700 font-medium">Total Students</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-xl">
                <div class="text-3xl font-bold text-green-600">${summary.undergraduate}</div>
                <div class="text-sm text-green-700 font-medium">Undergraduate</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-xl">
                <div class="text-3xl font-bold text-purple-600">${summary.postgraduate}</div>
                <div class="text-sm text-purple-700 font-medium">Postgraduate</div>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-xl">
                <div class="text-3xl font-bold text-orange-600">${summary.activeProjects}</div>
                <div class="text-sm text-orange-700 font-medium">Active Projects</div>
            </div>
        </div>
    `;
}

function displayStudents(students) {
    const container = document.getElementById('students-container');
    const noResultsElement = document.getElementById('no-results');

    if (students.length === 0) {
        container.classList.add('hidden');
        noResultsElement.classList.remove('hidden');
        return;
    }

    noResultsElement.classList.add('hidden');
    container.classList.remove('hidden');
    container.innerHTML = '';

    students.forEach((student, index) => {
        const studentCard = createStudentCard(student, index);
        container.appendChild(studentCard);
    });
}

function createStudentCard(student, index) {
    const studentDiv = document.createElement('div');
    studentDiv.className =
        'fade-in student-card bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300';
    studentDiv.style.animationDelay = `${index * 0.1}s`;

    const levelBadge =
        student.level === 'undergraduate'
            ? '<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Undergraduate</span>'
            : '<span class="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Postgraduate</span>';

    const featuredBadge = student.featured
        ? '<span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full ml-2"><i class="fas fa-star mr-1"></i>Featured</span>'
        : '';

    studentDiv.innerHTML = `
        <div class="p-6">
            <!-- Header -->
            <div class="flex flex-col items-center text-center mb-4">
                <div class="mb-4">
                    <img
                        src="${student.photo}"
                        alt="${student.name}"
                        class="student-photo rounded-full mx-auto"
                        onerror="this.src='images/default-avatar.jpg'"
                    />
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-800 mb-1">${student.name}</h3>
                    <p class="text-blue-600 font-medium text-sm mb-2">${student.shortTitle}</p>
                    <div class="flex flex-wrap justify-center gap-1">
                        ${levelBadge}
                        ${featuredBadge}
                    </div>
                </div>
            </div>

            <!-- Motto -->
            ${
                student.motto
                    ? `
                <div class="text-center mb-4 px-4">
                    <p class="text-gray-600 italic text-sm">"${student.motto}"</p>
                </div>
            `
                    : ''
            }

            <!-- Academic Info -->
            <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-600">
                    <i class="fas fa-graduation-cap mr-2 text-blue-500"></i>
                    <span>${student.year} - ${student.degree}</span>
                </div>
                <div class="flex items-center text-sm text-gray-600">
                    <i class="fas fa-star mr-2 text-blue-500"></i>
                    <span>${student.specialization}</span>
                </div>
            </div>

            <!-- Research Areas -->
            <div class="mb-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">Research Areas</h4>
                <div class="flex flex-wrap gap-1">
                    ${student.researchAreas
                        .slice(0, 3)
                        .map(
                            area =>
                                `<span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">${area}</span>`
                        )
                        .join('')}
                    ${
                        student.researchAreas.length > 3
                            ? `<span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">+${student.researchAreas.length - 3} more</span>`
                            : ''
                    }
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 mt-6">
                <button
                    onclick="viewStudentDetails('${student.id}')"
                    class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                    View Details
                </button>
                <a
                    href="mailto:${student.email}"
                    class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Send Email"
                >
                    <i class="fas fa-envelope"></i>
                </a>
            </div>
        </div>
    `;

    return studentDiv;
}

// Filter students by level
window.filterStudents = function (filterType) {
    currentFilter = filterType;

    // Update active filter button
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active', 'bg-blue-600', 'text-white');
        chip.classList.add('bg-gray-100', 'text-gray-700');
    });

    event.target.classList.remove('bg-gray-100', 'text-gray-700');
    event.target.classList.add('active', 'bg-blue-600', 'text-white');

    applyFilters();
};

// Search students
window.searchStudents = function () {
    applyFilters();
};

function applyFilters() {
    let filtered = [...allStudents];
    const searchTerm = document.getElementById('student-search').value.toLowerCase();

    // Apply level filter
    if (currentFilter === 'undergraduate') {
        filtered = filtered.filter(student => student.level === 'undergraduate');
    } else if (currentFilter === 'postgraduate') {
        filtered = filtered.filter(student => student.level === 'postgraduate');
    }

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(
            student =>
                student.name.toLowerCase().includes(searchTerm) ||
                student.specialization.toLowerCase().includes(searchTerm) ||
                student.researchAreas.some(area => area.toLowerCase().includes(searchTerm)) ||
                student.bio.toLowerCase().includes(searchTerm) ||
                (student.projects &&
                    student.projects.some(
                        project =>
                            project.title.toLowerCase().includes(searchTerm) ||
                            project.description.toLowerCase().includes(searchTerm)
                    ))
        );
    }

    filteredStudents = filtered;
    displayStudents(filteredStudents);
}

// View student details (navigate to separate page)
window.viewStudentDetails = function (studentId) {
    // Navigate to individual student page
    window.location.href = `students/${studentId}.html`;
};
