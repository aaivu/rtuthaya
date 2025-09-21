# Academic Website Makefile
# Dr. Uthayasanker Thayasivam's Research Portfolio

.PHONY: help dev serve format lint clean install check

# Default target
help:
	@echo "📚 Academic Website Development Commands"
	@echo "=====================================\n"
	@echo "🚀 Development:"
	@echo "  make dev     - Start development server on http://localhost:8000"
	@echo "  make serve   - Alias for 'make dev'"
	@echo ""
	@echo "🎨 Code Quality:"
	@echo "  make format  - Format HTML, CSS, JS files"
	@echo "  make lint    - Lint and check code quality"
	@echo "  make check   - Run both format and lint"
	@echo ""
	@echo "🛠️  Setup:"
	@echo "  make install - Install development dependencies"
	@echo "  make clean   - Clean temporary files"
	@echo ""
	@echo "📖 Usage Examples:"
	@echo "  make dev              # Start dev server"
	@echo "  make format           # Format all files"
	@echo "  make lint             # Check code quality"
	@echo "  make check            # Format + lint"

# Development server
dev:
	@echo "🚀 Starting development server..."
	@echo "📍 Local server: http://localhost:8000"
	@echo "📁 Serving from: $(PWD)"
	@echo "⏹️  Press Ctrl+C to stop\n"
	@python3 -m http.server 8000

serve: dev

# Install development dependencies
install:
	@echo "🛠️  Installing development dependencies..."
	@command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found. Please install Node.js first."; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "❌ npm not found. Please install npm first."; exit 1; }
	@echo "📦 Installing Prettier for code formatting..."
	@npm install -g prettier 2>/dev/null || echo "⚠️  Prettier installation may require sudo"
	@echo "📦 Installing HTMLHint for HTML linting..."
	@npm install -g htmlhint 2>/dev/null || echo "⚠️  HTMLHint installation may require sudo"
	@echo "📦 Installing ESLint for JavaScript linting..."
	@npm install -g eslint 2>/dev/null || echo "⚠️  ESLint installation may require sudo"
	@echo "✅ Installation complete!"
	@echo "💡 If installations failed, run with sudo: sudo make install"

# Format code
format:
	@echo "🎨 Formatting code..."
	@command -v prettier >/dev/null 2>&1 || { echo "❌ Prettier not found. Run 'make install' first."; exit 1; }
	@echo "📄 Formatting HTML files..."
	@find . -name "*.html" -not -path "./node_modules/*" | xargs prettier --write --tab-width 4 --print-width 120
	@echo "🎨 Formatting CSS files..."
	@find . -name "*.css" -not -path "./node_modules/*" | xargs prettier --write --tab-width 4 --print-width 120
	@echo "📜 Formatting JavaScript files..."
	@find . -name "*.js" -not -path "./node_modules/*" | xargs prettier --write --tab-width 4 --print-width 120 --single-quote
	@echo "📋 Formatting JSON files..."
	@find . -name "*.json" -not -path "./node_modules/*" | xargs prettier --write --tab-width 2
	@echo "✅ Code formatting complete!"

# Lint code
lint:
	@echo "🔍 Linting code..."
	@echo "📄 Checking HTML files..."
	@command -v htmlhint >/dev/null 2>&1 && find . -name "*.html" -not -path "./node_modules/*" -exec htmlhint {} \; || echo "⚠️  HTMLHint not available. Run 'make install' to enable HTML linting."
	@echo "📜 Checking JavaScript files..."
	@command -v eslint >/dev/null 2>&1 && find . -name "*.js" -not -path "./node_modules/*" -exec eslint {} \; || echo "⚠️  ESLint not available. Run 'make install' to enable JS linting."
	@echo "🔍 Basic file structure check..."
	@echo "📋 Checking for required files..."
	@test -f index.html && echo "✅ index.html found" || echo "❌ index.html missing"
	@test -f biography.html && echo "✅ biography.html found" || echo "❌ biography.html missing"
	@test -f projects.html && echo "✅ projects.html found" || echo "❌ projects.html missing"
	@test -f conferences.html && echo "✅ conferences.html found" || echo "❌ conferences.html missing"
	@test -f teaching.html && echo "✅ teaching.html found" || echo "❌ teaching.html missing"
	@test -d js && echo "✅ js/ directory found" || echo "❌ js/ directory missing"
	@test -d data && echo "✅ data/ directory found" || echo "❌ data/ directory missing"
	@test -d images && echo "✅ images/ directory found" || echo "❌ images/ directory missing"
	@echo "✅ Linting complete!"

# Run both format and lint
check: format lint
	@echo "✅ Code quality check complete!"

# Clean temporary files
clean:
	@echo "🧹 Cleaning temporary files..."
	@find . -name ".DS_Store" -delete 2>/dev/null || true
	@find . -name "*.tmp" -delete 2>/dev/null || true
	@find . -name "*.log" -delete 2>/dev/null || true
	@find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
	@echo "✅ Cleanup complete!"

# Development workflow
dev-setup: clean install
	@echo "🎯 Development environment ready!"
	@echo "🚀 Run 'make dev' to start the development server"

# Quick development start
quick:
	@echo "🚀 Quick development start..."
	@echo "📍 Opening browser to http://localhost:8000"
	@python3 -m http.server 8000 &
	@sleep 2
	@command -v open >/dev/null 2>&1 && open http://localhost:8000 || echo "💡 Open http://localhost:8000 in your browser"

# Validate all JSON files
validate-json:
	@echo "🔍 Validating JSON files..."
	@find ./data -name "*.json" | while read file; do \
		echo "📋 Checking $$file..."; \
		python3 -m json.tool "$$file" > /dev/null && echo "✅ $$file is valid" || echo "❌ $$file is invalid"; \
	done
	@echo "✅ JSON validation complete!"

# Check for broken links (basic check)
check-links:
	@echo "🔗 Checking for potential broken links..."
	@find . -name "*.html" -exec grep -l "href=" {} \; | while read file; do \
		echo "📄 Checking links in $$file..."; \
		grep -o 'href="[^"]*"' "$$file" | grep -v "http" | grep -v "mailto" | grep -v "#" || true; \
	done
	@echo "✅ Link check complete!"

# Project info
info:
	@echo "📚 Academic Website Information"
	@echo "=============================="
	@echo "👨‍🏫 Dr. Uthayasanker Thayasivam"
	@echo "🏛️  University of Moratuwa"
	@echo "🔬 Computer Science & Engineering"
	@echo ""
	@echo "📊 Project Statistics:"
	@find . -name "*.html" | wc -l | sed 's/^/📄 HTML files: /'
	@find . -name "*.js" | wc -l | sed 's/^/📜 JavaScript files: /'
	@find . -name "*.json" | wc -l | sed 's/^/📋 JSON files: /'
	@find ./images -name "*" 2>/dev/null | wc -l | sed 's/^/🖼️  Images: /' || echo "🖼️  Images: 0"