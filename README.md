# 🏛️ Dr. Uthayasanker Thayasivam's Academic Website

[![CI/CD Pipeline](https://github.com/username/repo/workflows/🔍%20Academic%20Website%20CI/CD/badge.svg)](https://github.com/username/repo/actions)
[![Code Quality](https://img.shields.io/badge/code%20quality-passing-green)](https://github.com/username/repo/actions)
[![JSON Valid](https://img.shields.io/badge/JSON-valid-success)](https://github.com/username/repo/actions)

> **Research Portfolio & Academic Website**
> University of Moratuwa - Computer Science & Engineering Department

## 👨‍🏫 About

This is the official academic website for Dr. Uthayasanker Thayasivam, showcasing:

- 🔬 Research projects in NLP, Machine Learning, and Data Science
- 👨‍🎓 150+ courses taught across undergraduate and postgraduate programs
- 🏆 Awards, grants, and academic achievements
- 📚 Publications and conference presentations
- 📅 Upcoming academic conferences and journals

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd rtuthaya

# Start development server
make dev
# or
python3 -m http.server 8000

# Open http://localhost:8000
```

## 🛠️ Development

### Prerequisites
- Python 3.9+
- Node.js 18+ (for linting/formatting)
- Make (for automation)

### Available Commands

```bash
# Development
make dev              # Start development server
make serve            # Alias for dev
make quick            # Start server + open browser

# Code Quality
make format           # Format all code (Prettier)
make lint             # Lint HTML/JS files
make check            # Format + Lint + Validate

# Setup
make install          # Install dev dependencies
make dev-setup        # Full development setup
make clean            # Clean temporary files

# Validation
make validate-json    # Validate all JSON files
make check-links      # Check for broken links
make info             # Show project statistics
```

## 📁 Project Structure

```
rtuthaya/
├── 📄 HTML Pages
│   ├── index.html           # Main page
│   ├── biography.html       # Complete biography
│   ├── projects.html        # Research projects grid
│   ├── conferences.html     # Academic conferences
│   └── teaching.html        # Teaching experience
│
├── 📜 JavaScript
│   ├── js/main.js          # Main page functionality
│   ├── js/projects.js      # Projects page logic
│   ├── js/conferences.js   # Conferences functionality
│   ├── js/teaching.js      # Teaching page logic
│   └── js/project-detail.js # Individual project pages
│
├── 📋 Data (JSON-driven)
│   ├── data/content.json       # Main content
│   ├── data/teaching.json      # Teaching data (150+ courses)
│   ├── data/conferences.json   # Conference listings
│   └── data/projects/          # Project details
│       ├── projects.json       # Projects index
│       ├── 01/project.json     # Individual projects
│       └── 02/project.json
│
├── 🖼️ Assets
│   └── images/             # Images and media
│
└── ⚙️ Configuration
    ├── .github/workflows/  # GitHub Actions CI/CD
    ├── .gitlab-ci.yml     # GitLab CI/CD
    ├── Makefile           # Development automation
    ├── .eslintrc.json     # JavaScript linting
    ├── .htmlhintrc        # HTML linting
    └── .prettierrc        # Code formatting
```

## 🔄 CI/CD Pipeline

### Automated Checks

✅ **JSON Validation**
- Syntax validation for all JSON files
- Schema validation for content structure
- Cross-reference validation (projects, courses)

✅ **Code Quality**
- HTML linting (HTMLHint)
- JavaScript linting (ESLint)
- Code formatting (Prettier)
- Broken link detection

✅ **Security & Performance**
- Secret scanning
- File size monitoring
- Image optimization checks

✅ **Deployment**
- Automated testing
- GitHub Pages / GitLab Pages deployment
- Deployment reports

### Platforms Supported

- **GitHub Actions** (`.github/workflows/ci.yml`)
- **GitLab CI** (`.gitlab-ci.yml`)

## 📊 Features

### 🏠 Main Page
- Professional introduction with photo
- Featured courses overview
- Research areas summary
- Quick navigation to detailed sections

### 📚 Teaching (150+ Courses)
- **Comprehensive course listing** organized by intake year
- **Advanced filtering** by level, role, category
- **Search functionality** across all course data
- **Professional statistics** dashboard

### 🔬 Research Projects
- **Project showcase** with detailed information
- **Image galleries** with carousel functionality
- **Team member profiles** and contact details
- **Publication links** and resources
- **Tags and filtering** system

### 📅 Academic Conferences
- **21+ conferences** in AI, ML, NLP fields
- **Submission deadline tracking** with countdown
- **Smart filtering** by type, status, topics
- **Direct links** to conference websites

### 🎯 Professional Features
- **Responsive design** (mobile-first)
- **JSON-driven content** (easy updates)
- **SEO optimized** with proper meta tags
- **Fast loading** with optimized assets
- **Accessibility** compliant

## 🏗️ Data Management

All content is managed through JSON files for easy updates:

```javascript
// data/teaching.json - 150+ courses
{
  "teaching": {
    "summary": { "totalCourses": 150, "yearsOfTeaching": "12+ years" },
    "featured": [...],  // Main page display
    "courses": [...],   // Complete course listing
    "categories": {...} // Course categorization
  }
}

// data/projects/01/project.json - Research projects
{
  "id": "01",
  "title": "Multilingual Speech Emotion Recognition",
  "team": [...],      // Team members
  "results": {...},   // Research outcomes
  "awards": [...],    // Recognition received
  "links": [...]      // Papers, demos, code
}
```

## 🚀 Deployment

### GitHub Pages
1. Push to `main` branch
2. GitHub Actions automatically runs CI/CD
3. Deploys to GitHub Pages on success

### GitLab Pages
1. Push to `main` branch
2. GitLab CI automatically runs pipeline
3. Deploys to GitLab Pages on success

### Manual Deployment
```bash
# Test locally
make dev

# Run full quality checks
make check

# Deploy to any static hosting
# (Netlify, Vercel, AWS S3, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run quality checks (`make check`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

All contributions are automatically validated through CI/CD pipeline.

## 📞 Contact

**Dr. Uthayasanker Thayasivam**
- 🏛️ Department of Computer Science & Engineering
- 🌐 University of Moratuwa, Sri Lanka
- 📧 uthaya@cse.mrt.ac.lk
- ☎️ +94 11 2640381

**Website Designer**
- 👨‍💻 Luxshan Thavarasa
- 📧 luxshan.20@cse.mrt.ac.lk

---

<div align="center">

**🏛️ University of Moratuwa - Computer Science & Engineering**

*Advancing research in Natural Language Processing, Machine Learning, and Data Science*

</div>