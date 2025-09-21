class AcademicWebsite {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadContent();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupScrollHighlight();
    }

    async loadContent() {
        try {
            const data = await this.fetchData('data/content.json');
            this.renderContent(data);
        } catch (error) {
            console.error('Error loading content:', error);
            this.showError('Failed to load content');
        }
    }

    async fetchData(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    renderContent(data) {
        const contentContainer = document.getElementById('content');

        Object.keys(data).forEach(section => {
            const sectionData = data[section];
            const sectionElement = this.createSection(section, sectionData);
            contentContainer.appendChild(sectionElement);
        });
    }

    createSection(sectionName, sectionData) {
        const section = document.createElement('div');
        section.id = sectionName;
        section.className = 'section-card bg-white p-6 sm:p-8 mb-12 fade-in';

        const title = document.createElement('h2');
        title.className = 'text-2xl sm:text-3xl font-bold text-slate-800 mb-6 relative';

        // Add decorative element for home section
        if (sectionName === 'home') {
            title.className += ' text-center pb-4 border-b border-gray-200';
        }
        title.textContent = sectionData.title || this.capitalize(sectionName);

        section.appendChild(title);

        // Add subtitle for home and teaching sections
        if (sectionName === 'home') {
            if (sectionData.subtitle) {
                const subtitle = document.createElement('p');
                subtitle.className = 'text-lg text-blue-600 font-semibold mb-2 text-center';
                subtitle.textContent = sectionData.subtitle;
                section.appendChild(subtitle);
            }
            if (sectionData.university) {
                const university = document.createElement('p');
                university.className = 'text-gray-600 mb-8 text-center';
                university.textContent = sectionData.university;
                section.appendChild(university);
            }
        } else if (sectionName === 'teaching' && sectionData.subtitle) {
            const subtitle = document.createElement('p');
            subtitle.className = 'text-lg text-gray-600 mb-8 text-center';
            subtitle.textContent = sectionData.subtitle;
            section.appendChild(subtitle);
        }

        const content = document.createElement('div');
        content.className = 'prose max-w-none';

        // Handle special sections
        if (sectionName === 'teaching') {
            this.createTeachingSection(sectionData, content);
        } else if (sectionName === 'awards') {
            this.createAwardsSection(sectionData, content);
        } else if (sectionName === 'biography') {
            this.createBiographySection(sectionData, content, section);
        } else {
            if (sectionData.content) {
                content.innerHTML = sectionData.content;
            }

            if (sectionData.items && Array.isArray(sectionData.items)) {
                const list = this.createList(sectionData.items);
                content.appendChild(list);
            }
        }

        section.appendChild(content);

        return section;
    }

    createTeachingSection(sectionData, content) {
        // Create undergraduate section
        if (sectionData.undergraduate) {
            const undergraduateDiv = document.createElement('div');
            undergraduateDiv.className = 'mb-10';

            const undergraduateTitle = document.createElement('h3');
            undergraduateTitle.className = 'text-xl font-semibold text-gray-700 mb-6';
            undergraduateTitle.textContent = sectionData.undergraduate.title;
            undergraduateDiv.appendChild(undergraduateTitle);

            const undergraduateGrid = this.createCourseGrid(sectionData.undergraduate.courses);
            undergraduateDiv.appendChild(undergraduateGrid);
            content.appendChild(undergraduateDiv);
        }

        // Create postgraduate section
        if (sectionData.postgraduate) {
            const postgraduateDiv = document.createElement('div');
            postgraduateDiv.className = 'mb-6';

            const postgraduateTitle = document.createElement('h3');
            postgraduateTitle.className = 'text-xl font-semibold text-gray-700 mb-6';
            postgraduateTitle.textContent = sectionData.postgraduate.title;
            postgraduateDiv.appendChild(postgraduateTitle);

            const postgraduateGrid = this.createCourseGrid(sectionData.postgraduate.courses);
            postgraduateDiv.appendChild(postgraduateGrid);
            content.appendChild(postgraduateDiv);
        }
    }

    createCourseGrid(courses) {
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

        const courseIcons = {
            'Data Structures and Algorithms': 'fas fa-code-branch',
            'Information Retrieval': 'fas fa-search',
            'Machine Learning': 'fas fa-brain',
            'Presentation Skills': 'fas fa-presentation',
            'Advanced Database Systems': 'fas fa-database',
            'Statistical Inference': 'fas fa-chart-line',
            'Big Data': 'fas fa-server'
        };

        courses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.className = 'group flex items-center space-x-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer';

            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-300';

            const icon = document.createElement('i');
            icon.className = `${courseIcons[course] || 'fas fa-book'} text-blue-600 text-lg group-hover:text-blue-700 transition-colors duration-300`;

            const courseContent = document.createElement('div');
            courseContent.className = 'flex-grow';

            const courseName = document.createElement('h4');
            courseName.className = 'text-gray-800 font-semibold text-sm leading-tight group-hover:text-blue-700 transition-colors duration-300';
            courseName.textContent = course;

            const courseType = document.createElement('p');
            courseType.className = 'text-xs text-gray-500 mt-1';
            courseType.textContent = 'Course Module';

            iconWrapper.appendChild(icon);
            courseContent.appendChild(courseName);
            courseContent.appendChild(courseType);
            courseItem.appendChild(iconWrapper);
            courseItem.appendChild(courseContent);
            grid.appendChild(courseItem);
        });

        return grid;
    }

    createAwardsSection(sectionData, content) {
        // Create grants section
        if (sectionData.grants) {
            const grantsDiv = document.createElement('div');
            grantsDiv.className = 'mb-10';

            const grantsTitle = document.createElement('h3');
            grantsTitle.className = 'text-xl font-semibold text-gray-700 mb-6';
            grantsTitle.textContent = 'Grants';
            grantsDiv.appendChild(grantsTitle);

            const grantsList = this.createList(sectionData.grants);
            grantsDiv.appendChild(grantsList);
            content.appendChild(grantsDiv);
        }

        // Create awards section
        if (sectionData.awards) {
            const awardsDiv = document.createElement('div');
            awardsDiv.className = 'mb-10';

            const awardsTitle = document.createElement('h3');
            awardsTitle.className = 'text-xl font-semibold text-gray-700 mb-6';
            awardsTitle.textContent = 'Awards';
            awardsDiv.appendChild(awardsTitle);

            const awardsList = this.createList(sectionData.awards);
            awardsDiv.appendChild(awardsList);
            content.appendChild(awardsDiv);
        }

        // Create leadership section
        if (sectionData.leadership) {
            const leadershipDiv = document.createElement('div');
            leadershipDiv.className = 'mb-6';

            const leadershipTitle = document.createElement('h3');
            leadershipTitle.className = 'text-xl font-semibold text-gray-700 mb-6';
            leadershipTitle.textContent = 'Leadership & Professional Memberships';
            leadershipDiv.appendChild(leadershipTitle);

            const leadershipList = this.createList(sectionData.leadership);
            leadershipDiv.appendChild(leadershipList);
            content.appendChild(leadershipDiv);
        }
    }

    createBiographySection(sectionData, content, section) {
        // Create brief biography with read more button
        content.innerHTML = sectionData.content;

        // Store detailed biography data for later use
        if (sectionData.detailed) {
            section.setAttribute('data-detailed', JSON.stringify(sectionData.detailed));
        }
    }


    createList(items) {
        const list = document.createElement('ul');
        list.className = 'space-y-4 mt-6';

        items.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'group border-l-3 border-blue-400 pl-4 py-3 hover:border-blue-600 transition-all duration-200';
            listItem.style.animationDelay = `${index * 0.1}s`;

            if (typeof item === 'string') {
                listItem.textContent = item;
            } else if (typeof item === 'object') {
                if (item.title) {
                    const title = document.createElement('h4');
                    title.className = 'font-semibold text-slate-800 text-lg mb-2 group-hover:text-blue-700 transition-colors';
                    title.textContent = item.title;
                    listItem.appendChild(title);
                }
                if (item.description) {
                    const desc = document.createElement('p');
                    desc.className = 'text-gray-600 leading-relaxed';
                    desc.textContent = item.description;
                    listItem.appendChild(desc);
                }
                if (item.link && item.link !== '#') {
                    const link = document.createElement('a');
                    link.className = 'inline-flex items-center mt-3 text-blue-600 hover:text-blue-800 font-medium transition-colors';
                    link.href = item.link;
                    link.innerHTML = 'Read more <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';
                    listItem.appendChild(link);
                }
            }

            list.appendChild(listItem);
        });

        return list;
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileNavMenu = document.getElementById('mobile-nav-menu');

        if (mobileMenuBtn && mobileNavMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileNavMenu.classList.toggle('hidden');
                mobileNavMenu.classList.toggle('flex');
            });

            // Close mobile menu when clicking on links
            const mobileLinks = mobileNavMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileNavMenu.classList.add('hidden');
                    mobileNavMenu.classList.remove('flex');
                });
            });
        }
    }

    showError(message) {
        const contentContainer = document.getElementById('content');
        contentContainer.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-2 sm:mx-0">
                <strong>Error:</strong> ${message}
            </div>
        `;
    }
}

// Make showDetailedBiography globally accessible
window.showDetailedBiography = function() {
    const biographySection = document.getElementById('biography');
    const detailedData = JSON.parse(biographySection.getAttribute('data-detailed'));

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    };

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto p-6';

    // Create header
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-6 border-b pb-4';
    header.innerHTML = `
        <h2 class="text-2xl font-bold text-slate-800">Complete Biography</h2>
        <button onclick="document.body.removeChild(this.closest('.fixed')); document.body.style.overflow = 'auto';" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
    `;

    modalContent.appendChild(header);

    // Create biography content
    Object.entries(detailedData).forEach(([key, section]) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'mb-8';

        const title = document.createElement('h3');
        title.className = 'text-xl font-semibold text-blue-600 mb-4';
        title.textContent = section.title;

        const content = document.createElement('p');
        content.className = 'text-gray-700 leading-relaxed';
        content.textContent = section.content;

        sectionDiv.appendChild(title);
        sectionDiv.appendChild(content);
        modalContent.appendChild(sectionDiv);
    });

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
};

document.addEventListener('DOMContentLoaded', () => {
    new AcademicWebsite();
});