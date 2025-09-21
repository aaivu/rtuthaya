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
            searchProjects(e.target.value);
        });
    }

    // Load and display projects
    await loadProjects();
});

let allProjects = [];
let filteredProjects = [];
let currentFilter = 'all';
const allTags = new Set();

async function loadProjects() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const projectsContainer = document.getElementById('projects-container');

    try {
        // Show loading state
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        projectsContainer.innerHTML = '';

        // Load projects index
        const projectsResponse = await fetch('data/projects/projects.json');
        if (!projectsResponse.ok) throw new Error('Failed to load projects index');

        const projectsIndex = await projectsResponse.json();

        // Load each project
        const projects = [];
        for (const projectRef of projectsIndex.projects) {
            try {
                const projectResponse = await fetch(`data/projects/${projectRef.id}/project.json`);
                if (projectResponse.ok) {
                    const project = await projectResponse.json();
                    project.featured = projectRef.featured || false;
                    projects.push(project);

                    // Collect all tags
                    if (project.tags) {
                        project.tags.forEach(tag => allTags.add(tag));
                    }
                }
            } catch (err) {
                console.warn(`Failed to load project ${projectRef.id}:`, err);
            }
        }

        // Hide loading state
        loadingElement.classList.add('hidden');

        if (projects.length === 0) {
            throw new Error('No projects found');
        }

        allProjects = projects;
        filteredProjects = [...allProjects];

        // Sort projects - featured first, then by start date
        sortProjects();

        // Generate tag filters
        generateTagFilters();

        // Display projects
        displayProjects(filteredProjects, projectsContainer);
    } catch (error) {
        console.error('Error loading projects:', error);
        loadingElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
    }
}

function sortProjects() {
    filteredProjects.sort((a, b) => {
        // Featured projects first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;

        // Then by start date (newest first)
        return new Date(b.startDate) - new Date(a.startDate);
    });
}

function generateTagFilters() {
    const tagsContainer = document.getElementById('tags-container');
    const tagsArray = Array.from(allTags).sort();

    const tagButtons = tagsArray
        .map(
            tag =>
                `<button onclick="toggleTagFilter('${tag}')" class="tag-chip px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer">${tag}</button>`
        )
        .join('');

    tagsContainer.innerHTML = `
        <span class="text-sm font-medium text-gray-700">Tags:</span>
        ${tagButtons}
    `;
}

function displayProjects(projects) {
    const container = document.getElementById('projects-container');
    const noResults = document.getElementById('no-results');

    if (projects.length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');

    container.innerHTML = '';
    projects.forEach((project, index) => {
        const projectElement = createProjectCard(project, index);
        container.appendChild(projectElement);
    });
}

function createProjectCard(project, index) {
    const projectDiv = document.createElement('div');
    projectDiv.className =
        'fade-in project-card bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer';
    projectDiv.style.animationDelay = `${index * 0.1}s`;

    const statusBadge =
        project.status === 'completed'
            ? '<span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Completed</span>'
            : '<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">In Progress</span>';

    const codebaseLink = project.links?.find(
        link =>
            link.title.toLowerCase().includes('code') ||
            link.title.toLowerCase().includes('github') ||
            link.icon?.includes('github')
    );

    projectDiv.innerHTML = `
        <div class="p-6">
            <!-- Header -->
            <div class="flex justify-between items-start mb-3">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-slate-800 mb-2">${project.title}</h3>
                    <p class="text-gray-600 text-sm leading-relaxed">${project.shortDescription}</p>
                </div>
                <div class="ml-3">
                    ${statusBadge}
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 mt-4">
                <button onclick="viewProject('${project.id}')"
                        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                    View Details
                </button>
                ${
                    codebaseLink
                        ? `
                    <a href="${codebaseLink.url}"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <i class="${codebaseLink.icon}"></i>
                    </a>
                `
                        : ''
                }
            </div>
        </div>
    `;

    return projectDiv;
}

function createImageCarousel(project) {
    if (!project.images || project.images.length === 0) {
        return `
            <div class="carousel-container h-96 sm:h-[28rem] md:h-[32rem] bg-gray-200 flex items-center justify-center">
                <i class="fas fa-image text-4xl text-gray-400"></i>
            </div>
        `;
    }

    const carouselId = `carousel-${project.id}`;

    return `
        <div class="carousel-container h-96 sm:h-[28rem] md:h-[32rem] relative" id="${carouselId}">
            ${project.images
                .map(
                    (image, index) => `
                <img src="${image.url}"
                     alt="${image.caption || project.title}"
                     class="carousel-image absolute inset-0 w-full h-full object-cover ${index === 0 ? 'opacity-100' : 'opacity-0'}"
                     data-index="${index}">
            `
                )
                .join('')}

            ${
                project.images.length > 1
                    ? `
                <button class="carousel-nav prev" onclick="changeImage('${carouselId}', -1)">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-nav next" onclick="changeImage('${carouselId}', 1)">
                    <i class="fas fa-chevron-right"></i>
                </button>

                <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    ${project.images
                        .map(
                            (_, index) => `
                        <div class="w-2 h-2 rounded-full bg-white opacity-50 cursor-pointer carousel-dot ${index === 0 ? 'opacity-100' : ''}"
                             onclick="goToImage('${carouselId}', ${index})"></div>
                    `
                        )
                        .join('')}
                </div>
            `
                    : ''
            }
        </div>
    `;
}

function createResultsSection(results) {
    if (!results) return '';

    return `
        <div class="mb-8">
            <h3 class="text-xl font-semibold text-slate-800 mb-4">${results.title || 'Results & Impact'}</h3>

            <div class="space-y-6">
                <div class="bg-gray-50 p-6 rounded-xl border-0">
                    <h4 class="font-semibold text-gray-800 mb-3">Performance</h4>
                    <p class="text-gray-700 leading-relaxed">${results.performance}</p>
                </div>

                ${
                    results.contributions && results.contributions.length > 0
                        ? `
                    <div>
                        <h4 class="font-semibold text-gray-800 mb-3">Key Contributions</h4>
                        <div class="grid md:grid-cols-2 gap-4">
                            ${results.contributions
                                .map(
                                    contrib => `
                                <div class="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400">
                                    <h5 class="font-medium text-blue-800 mb-2">${contrib.title}</h5>
                                    <p class="text-gray-700 text-sm leading-relaxed">${contrib.description}</p>
                                </div>
                            `
                                )
                                .join('')}
                        </div>
                    </div>
                `
                        : ''
                }

                <div class="bg-green-50 p-6 rounded-xl border-0">
                    <h4 class="font-semibold text-green-800 mb-3">Impact</h4>
                    <p class="text-gray-700 leading-relaxed">${results.impact}</p>
                </div>
            </div>
        </div>
    `;
}

function createAwardsSection(awards) {
    return `
        <div class="mb-8">
            <h3 class="text-xl font-semibold text-slate-800 mb-4">Awards & Recognition</h3>
            <div class="space-y-4">
                ${awards
                    .map(
                        award => `
                    <div class="bg-yellow-50 p-6 rounded-xl border-0">
                        <h4 class="font-semibold text-yellow-800 mb-2">${award.title}</h4>
                        <p class="text-gray-700 mb-3">${award.description}</p>

                        ${
                            award.details
                                ? `
                            <div class="text-sm text-gray-600 space-y-1">
                                ${award.details.paper_title ? `<p><strong>Paper:</strong> ${award.details.paper_title}</p>` : ''}
                                ${award.details.authors ? `<p><strong>Authors:</strong> ${award.details.authors.join(', ')}</p>` : ''}
                                ${award.details.conference ? `<p><strong>Conference:</strong> ${award.details.conference}</p>` : ''}
                                ${award.details.date ? `<p><strong>Date:</strong> ${award.details.date}</p>` : ''}
                            </div>
                        `
                                : ''
                        }
                    </div>
                `
                    )
                    .join('')}
            </div>
        </div>
    `;
}

function createTeamSection(team) {
    if (!team || team.length === 0) return '';

    return `
        <div class="mb-8">
            <h3 class="text-xl font-semibold text-slate-800 mb-4">Team Members</h3>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${team
                    .map(
                        member => `
                    <div class="bg-gray-50 p-6 rounded-xl text-center border-0">
                        <div class="mb-4">
                            <h4 class="font-semibold text-gray-800">${member.name}</h4>
                            <p class="text-blue-600 font-medium text-sm">${member.role}</p>
                        </div>
                        <p class="text-gray-600 text-sm mb-4 leading-relaxed">${member.description}</p>

                        <div class="flex justify-center space-x-3 text-sm">
                            ${member.email ? `<a href="mailto:${member.email}" class="text-gray-500 hover:text-blue-600"><i class="fas fa-envelope"></i></a>` : ''}
                            ${member.links?.scholar && member.links.scholar !== '#' ? `<a href="${member.links.scholar}" target="_blank" class="text-gray-500 hover:text-blue-600"><i class="fas fa-graduation-cap"></i></a>` : ''}
                            ${member.links?.linkedin && member.links.linkedin !== '#' ? `<a href="${member.links.linkedin}" target="_blank" class="text-gray-500 hover:text-blue-600"><i class="fab fa-linkedin"></i></a>` : ''}
                            ${member.links?.github && member.links.github !== '#' ? `<a href="${member.links.github}" target="_blank" class="text-gray-500 hover:text-blue-600"><i class="fab fa-github"></i></a>` : ''}
                        </div>
                    </div>
                `
                    )
                    .join('')}
            </div>
        </div>
    `;
}

function createLinksSection(links) {
    if (!links || links.length === 0) return '';

    const primaryLinks = links.filter(link => link.type === 'primary');
    const secondaryLinks = links.filter(link => link.type === 'secondary');

    return `
        <div class="border-t pt-8">
            <h3 class="text-xl font-semibold text-slate-800 mb-6">Project Resources</h3>

            <div class="space-y-4">
                ${
                    primaryLinks.length > 0
                        ? `
                    <div class="flex flex-wrap gap-3">
                        ${primaryLinks
                            .map(
                                link => `
                            <a href="${link.url}"
                               target="_blank"
                               rel="noopener noreferrer"
                               class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
                                <i class="${link.icon} mr-2"></i>
                                ${link.title}
                            </a>
                        `
                            )
                            .join('')}
                    </div>
                `
                        : ''
                }

                ${
                    secondaryLinks.length > 0
                        ? `
                    <div class="flex flex-wrap gap-2">
                        ${secondaryLinks
                            .map(
                                link => `
                            <a href="${link.url}"
                               target="_blank"
                               rel="noopener noreferrer"
                               class="inline-flex items-center px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">
                                <i class="${link.icon} mr-2"></i>
                                ${link.title}
                            </a>
                        `
                            )
                            .join('')}
                    </div>
                `
                        : ''
                }
            </div>
        </div>
    `;
}

// Utility functions
function formatDateRange(startDate, endDate) {
    const start = new Date(startDate).getFullYear();
    const end = endDate ? new Date(endDate).getFullYear() : 'Present';
    return start === end ? start.toString() : `${start} - ${end}`;
}

function formatMultilineText(text) {
    return text
        .split('\\n')
        .map(line => {
            if (line.startsWith('**') && line.endsWith('**')) {
                const content = line.slice(2, -2);
                return `<h4 class="font-semibold text-gray-800 mt-4 mb-2">${content}</h4>`;
            }
            return `<p class="mb-3">${line}</p>`;
        })
        .join('');
}

// Carousel functionality
const currentImageIndex = {};

window.changeImage = function (carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const images = carousel.querySelectorAll('.carousel-image');
    const dots = carousel.querySelectorAll('.carousel-dot');

    if (!currentImageIndex[carouselId]) currentImageIndex[carouselId] = 0;

    // Hide current image
    images[currentImageIndex[carouselId]].classList.remove('opacity-100');
    images[currentImageIndex[carouselId]].classList.add('opacity-0');
    if (dots[currentImageIndex[carouselId]]) {
        dots[currentImageIndex[carouselId]].classList.remove('opacity-100');
        dots[currentImageIndex[carouselId]].classList.add('opacity-50');
    }

    // Calculate new index
    currentImageIndex[carouselId] += direction;
    if (currentImageIndex[carouselId] >= images.length) currentImageIndex[carouselId] = 0;
    if (currentImageIndex[carouselId] < 0) currentImageIndex[carouselId] = images.length - 1;

    // Show new image
    images[currentImageIndex[carouselId]].classList.remove('opacity-0');
    images[currentImageIndex[carouselId]].classList.add('opacity-100');
    if (dots[currentImageIndex[carouselId]]) {
        dots[currentImageIndex[carouselId]].classList.remove('opacity-50');
        dots[currentImageIndex[carouselId]].classList.add('opacity-100');
    }
};

window.goToImage = function (carouselId, index) {
    const carousel = document.getElementById(carouselId);
    const images = carousel.querySelectorAll('.carousel-image');
    const dots = carousel.querySelectorAll('.carousel-dot');

    if (!currentImageIndex[carouselId]) currentImageIndex[carouselId] = 0;

    // Hide current image
    images[currentImageIndex[carouselId]].classList.remove('opacity-100');
    images[currentImageIndex[carouselId]].classList.add('opacity-0');
    if (dots[currentImageIndex[carouselId]]) {
        dots[currentImageIndex[carouselId]].classList.remove('opacity-100');
        dots[currentImageIndex[carouselId]].classList.add('opacity-50');
    }

    // Set new index
    currentImageIndex[carouselId] = index;

    // Show new image
    images[index].classList.remove('opacity-0');
    images[index].classList.add('opacity-100');
    if (dots[index]) {
        dots[index].classList.remove('opacity-50');
        dots[index].classList.add('opacity-100');
    }
};

// Navigate to individual project page
window.viewProject = function (projectId) {
    window.location.href = `projects/${projectId}.html`;
};

// Filter functions
const selectedTags = new Set();

window.filterProjects = function (filterType) {
    currentFilter = filterType;

    // Update active filter button
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.target.classList.add('active');

    applyFilters();
};

window.toggleTagFilter = function (tag) {
    const button = event.target;

    if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        button.classList.remove('active');
    } else {
        selectedTags.add(tag);
        button.classList.add('active');
    }

    applyFilters();
};

function applyFilters() {
    let filtered = [...allProjects];

    // Apply status/type filter
    switch (currentFilter) {
        case 'completed':
            filtered = filtered.filter(project => project.status === 'completed');
            break;
        case 'in_progress':
            filtered = filtered.filter(project => project.status === 'in_progress');
            break;
        case 'featured':
            filtered = filtered.filter(project => project.featured);
            break;
        // 'all' case - no additional filtering
    }

    // Apply tag filter
    if (selectedTags.size > 0) {
        filtered = filtered.filter(project => project.tags && project.tags.some(tag => selectedTags.has(tag)));
    }

    filteredProjects = filtered;
    sortProjects();
    displayProjects(filteredProjects);
}

function searchProjects(query) {
    if (!query.trim()) {
        // If search is empty, show current filtered results
        applyFilters();
        return;
    }

    const searchTerm = query.toLowerCase();
    const searchResults = filteredProjects.filter(
        project =>
            project.title.toLowerCase().includes(searchTerm) ||
            project.shortDescription.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );

    displayProjects(searchResults);
}

window.searchProjects = searchProjects;
