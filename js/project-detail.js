document.addEventListener('DOMContentLoaded', async function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');

    if (mobileMenuBtn && mobileNavMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNavMenu.classList.toggle('hidden');
        });
    }

    // Get project ID from URL
    const pathParts = window.location.pathname.split('/');
    const projectFileName = pathParts[pathParts.length - 1];
    const projectId = projectFileName.replace('.html', '');

    // Load and display project
    await loadProject(projectId);
});

async function loadProject(projectId) {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const projectContainer = document.getElementById('project-container');

    try {
        // Show loading state
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        projectContainer.innerHTML = '';

        // Load project data
        const projectResponse = await fetch(`../data/projects/${projectId}/project.json`);
        if (!projectResponse.ok) throw new Error('Failed to load project');

        const project = await projectResponse.json();

        // Hide loading state
        loadingElement.classList.add('hidden');

        // Display project
        displayProject(project, projectContainer);

    } catch (error) {
        console.error('Error loading project:', error);
        loadingElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
    }
}

function displayProject(project, container) {
    const projectElement = createProjectDetail(project);
    container.appendChild(projectElement);
}

function createProjectDetail(project) {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'space-y-16';

    const statusBadge = project.status === 'completed'
        ? '<span class="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">Completed</span>'
        : '<span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">In Progress</span>';

    projectDiv.innerHTML = `
        <!-- Project Header -->
        <div class="fade-in bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
            ${createImageCarousel(project)}

            <div class="p-8">
                <div class="flex justify-between items-start mb-6">
                    <div class="flex-1">
                        <h1 class="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">${project.title}</h1>
                        <p class="text-xl text-gray-600 leading-relaxed">${project.shortDescription}</p>
                    </div>
                    <div class="ml-6 flex flex-col items-end space-y-2">
                        ${statusBadge}
                        <p class="text-sm text-gray-500">${formatDateRange(project.startDate, project.endDate)}</p>
                    </div>
                </div>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2">
                    ${project.tags.map(tag => `
                        <span class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">${tag}</span>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- Project Overview -->
        <div class="fade-in bg-white rounded-2xl shadow-sm border-0 p-8">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">Project Overview</h2>
            <p class="text-gray-700 leading-relaxed text-lg">${project.description}</p>
        </div>

        <!-- Motivation & Objectives -->
        <div class="fade-in bg-white rounded-2xl shadow-sm border-0 p-8">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">Motivation & Objectives</h2>
            <div class="text-gray-700 leading-relaxed">${formatMultilineText(project.motivation)}</div>
        </div>

        <!-- Results and Impact -->
        ${createResultsSection(project.results)}

        <!-- Awards and Recognition -->
        ${project.awards && project.awards.length > 0 ? createAwardsSection(project.awards) : ''}

        <!-- Team Members -->
        ${createTeamSection(project.team)}

        <!-- Project Resources -->
        ${createLinksSection(project.links)}
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
            ${project.images.map((image, index) => `
                <img src="../${image.url}"
                     alt="${image.caption || project.title}"
                     class="carousel-image absolute inset-0 w-full h-full object-cover ${index === 0 ? 'opacity-100' : 'opacity-0'}"
                     data-index="${index}">
            `).join('')}

            ${project.images.length > 1 ? `
                <button class="carousel-nav prev" onclick="changeImage('${carouselId}', -1)">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-nav next" onclick="changeImage('${carouselId}', 1)">
                    <i class="fas fa-chevron-right"></i>
                </button>

                <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    ${project.images.map((_, index) => `
                        <div class="w-3 h-3 rounded-full bg-white opacity-60 cursor-pointer carousel-dot ${index === 0 ? 'opacity-100' : ''}"
                             onclick="goToImage('${carouselId}', ${index})"></div>
                    `).join('')}
                </div>

                <div class="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    <span id="current-caption-${carouselId}">${project.images[0].caption}</span>
                </div>
            ` : `
                <div class="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    ${project.images[0].caption}
                </div>
            `}
        </div>
    `;
}

function createResultsSection(results) {
    if (!results) return '';

    return `
        <div class="fade-in bg-white rounded-2xl shadow-sm border-0 p-8">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">${results.title || 'Results & Impact'}</h2>

            <div class="space-y-8">
                <div class="bg-gray-50 p-6 rounded-xl border-0">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">Performance</h3>
                    <p class="text-gray-700 leading-relaxed text-lg">${results.performance}</p>
                </div>

                ${results.contributions && results.contributions.length > 0 ? `
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">Key Contributions</h3>
                        <div class="grid md:grid-cols-2 gap-6">
                            ${results.contributions.map(contrib => `
                                <div class="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-400">
                                    <h4 class="text-lg font-semibold text-blue-800 mb-3">${contrib.title}</h4>
                                    <p class="text-gray-700 leading-relaxed">${contrib.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="bg-green-50 p-6 rounded-xl border-0">
                    <h3 class="text-xl font-semibold text-green-800 mb-4">Impact</h3>
                    <p class="text-gray-700 leading-relaxed text-lg">${results.impact}</p>
                </div>
            </div>
        </div>
    `;
}

function createAwardsSection(awards) {
    return `
        <div class="fade-in bg-white rounded-2xl shadow-sm border-0 p-8">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">Awards & Recognition</h2>
            <div class="space-y-6">
                ${awards.map(award => `
                    <div class="bg-yellow-50 p-6 rounded-xl border-0">
                        <h3 class="text-xl font-semibold text-yellow-800 mb-3">${award.title}</h3>
                        <p class="text-gray-700 mb-4 leading-relaxed">${award.description}</p>

                        ${award.details ? `
                            <div class="text-sm text-gray-600 space-y-2 bg-white p-4 rounded-lg">
                                ${award.details.paper_title ? `<p><strong>Paper:</strong> ${award.details.paper_title}</p>` : ''}
                                ${award.details.authors ? `<p><strong>Authors:</strong> ${award.details.authors.join(', ')}</p>` : ''}
                                ${award.details.conference ? `<p><strong>Conference:</strong> ${award.details.conference}</p>` : ''}
                                ${award.details.date ? `<p><strong>Date:</strong> ${award.details.date}</p>` : ''}
                                ${award.details.pages ? `<p><strong>Pages:</strong> ${award.details.pages}</p>` : ''}
                                ${award.details.publisher ? `<p><strong>Publisher:</strong> ${award.details.publisher}</p>` : ''}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function createTeamSection(team) {
    if (!team || team.length === 0) return '';

    return `
        <div class="fade-in bg-white rounded-2xl shadow-sm border-0 p-8">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">Team Members</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${team.map(member => `
                    <div class="bg-gray-50 p-6 rounded-xl text-center border-0">
                        <div class="mb-4">
                            <h3 class="text-lg font-semibold text-gray-800">${member.name}</h3>
                            <p class="text-blue-600 font-medium">${member.role}</p>
                        </div>
                        <p class="text-gray-600 text-sm mb-4 leading-relaxed">${member.description}</p>

                        <div class="flex justify-center space-x-4">
                            ${member.email ? `<a href="mailto:${member.email}" class="text-gray-500 hover:text-blue-600 text-lg"><i class="fas fa-envelope"></i></a>` : ''}
                            ${member.links?.scholar && member.links.scholar !== '#' ? `<a href="${member.links.scholar}" target="_blank" class="text-gray-500 hover:text-blue-600 text-lg"><i class="fas fa-graduation-cap"></i></a>` : ''}
                            ${member.links?.linkedin && member.links.linkedin !== '#' ? `<a href="${member.links.linkedin}" target="_blank" class="text-gray-500 hover:text-blue-600 text-lg"><i class="fab fa-linkedin"></i></a>` : ''}
                            ${member.links?.github && member.links.github !== '#' ? `<a href="${member.links.github}" target="_blank" class="text-gray-500 hover:text-blue-600 text-lg"><i class="fab fa-github"></i></a>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function createLinksSection(links) {
    if (!links || links.length === 0) return '';

    const primaryLinks = links.filter(link => link.type === 'primary');
    const secondaryLinks = links.filter(link => link.type === 'secondary');

    return `
        <div class="fade-in bg-white rounded-2xl shadow-sm border-0 p-8">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">Project Resources</h2>

            <div class="space-y-6">
                ${primaryLinks.length > 0 ? `
                    <div class="flex flex-wrap gap-4">
                        ${primaryLinks.map(link => `
                            <a href="${link.url}"
                               target="_blank"
                               rel="noopener noreferrer"
                               class="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-lg">
                                <i class="${link.icon} mr-3"></i>
                                ${link.title}
                            </a>
                        `).join('')}
                    </div>
                ` : ''}

                ${secondaryLinks.length > 0 ? `
                    <div class="flex flex-wrap gap-3">
                        ${secondaryLinks.map(link => `
                            <a href="${link.url}"
                               target="_blank"
                               rel="noopener noreferrer"
                               class="inline-flex items-center px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">
                                <i class="${link.icon} mr-2"></i>
                                ${link.title}
                            </a>
                        `).join('')}
                    </div>
                ` : ''}
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
    return text.split('\\n').map(line => {
        if (line.startsWith('**') && line.endsWith('**')) {
            const content = line.slice(2, -2);
            return `<h3 class="text-lg font-semibold text-gray-800 mt-6 mb-3">${content}</h3>`;
        }
        return `<p class="mb-4 text-lg leading-relaxed">${line}</p>`;
    }).join('');
}

// Carousel functionality
let currentImageIndex = {};

window.changeImage = function(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const images = carousel.querySelectorAll('.carousel-image');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const captionElement = document.getElementById(`current-caption-${carouselId}`);

    if (!currentImageIndex[carouselId]) currentImageIndex[carouselId] = 0;

    // Hide current image
    images[currentImageIndex[carouselId]].classList.remove('opacity-100');
    images[currentImageIndex[carouselId]].classList.add('opacity-0');
    if (dots[currentImageIndex[carouselId]]) {
        dots[currentImageIndex[carouselId]].classList.remove('opacity-100');
        dots[currentImageIndex[carouselId]].classList.add('opacity-60');
    }

    // Calculate new index
    currentImageIndex[carouselId] += direction;
    if (currentImageIndex[carouselId] >= images.length) currentImageIndex[carouselId] = 0;
    if (currentImageIndex[carouselId] < 0) currentImageIndex[carouselId] = images.length - 1;

    // Show new image
    images[currentImageIndex[carouselId]].classList.remove('opacity-0');
    images[currentImageIndex[carouselId]].classList.add('opacity-100');
    if (dots[currentImageIndex[carouselId]]) {
        dots[currentImageIndex[carouselId]].classList.remove('opacity-60');
        dots[currentImageIndex[carouselId]].classList.add('opacity-100');
    }

    // Update caption
    if (captionElement) {
        const projectData = JSON.parse(sessionStorage.getItem('currentProject'));
        if (projectData && projectData.images && projectData.images[currentImageIndex[carouselId]]) {
            captionElement.textContent = projectData.images[currentImageIndex[carouselId]].caption;
        }
    }
};

window.goToImage = function(carouselId, index) {
    const carousel = document.getElementById(carouselId);
    const images = carousel.querySelectorAll('.carousel-image');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const captionElement = document.getElementById(`current-caption-${carouselId}`);

    if (!currentImageIndex[carouselId]) currentImageIndex[carouselId] = 0;

    // Hide current image
    images[currentImageIndex[carouselId]].classList.remove('opacity-100');
    images[currentImageIndex[carouselId]].classList.add('opacity-0');
    if (dots[currentImageIndex[carouselId]]) {
        dots[currentImageIndex[carouselId]].classList.remove('opacity-100');
        dots[currentImageIndex[carouselId]].classList.add('opacity-60');
    }

    // Set new index
    currentImageIndex[carouselId] = index;

    // Show new image
    images[index].classList.remove('opacity-0');
    images[index].classList.add('opacity-100');
    if (dots[index]) {
        dots[index].classList.remove('opacity-60');
        dots[index].classList.add('opacity-100');
    }

    // Update caption
    if (captionElement) {
        const projectData = JSON.parse(sessionStorage.getItem('currentProject'));
        if (projectData && projectData.images && projectData.images[index]) {
            captionElement.textContent = projectData.images[index].caption;
        }
    }
};