# Summer Camp Jeopardy - Agent Guidelines

## Project Overview
A single-page web application implementing a Summer Camp themed Jeopardy game with team setup, game board, scoring, and final results. Built with vanilla HTML, CSS, and JavaScript.

## Build/Test Commands
- No build system: Open `index.html` directly in browser
- No package manager or dependencies
- Testing: Manual testing by opening index.html in browser
- No automated tests - test by playing through game functionality

## Architecture
- **Frontend-only**: Static HTML/CSS/JS files
- **index.html**: Main game interface with setup, game board, question modal, and final screen
- **app.js**: Game logic, state management, scoring, and interaction handlers
- **style.css**: Design system with CSS variables, responsive layout, and themed styling

## Code Style
- **JavaScript**: Vanilla ES6+, camelCase variables, descriptive function names
- **CSS**: Custom properties (CSS variables), BEM-style naming, mobile-first responsive design
- **HTML**: Semantic markup, accessibility features, data attributes for JavaScript hooks
- **Colors**: Summer camp theme with bright colors (--color-primary: #FF6B35, --color-secondary: #4ECDC4)
- **No external dependencies**: Self-contained application using only browser APIs

## Key Features
- Team setup (2-4 teams), 6x5 question grid, point-based scoring
- Audio feedback using Web Audio API, keyboard shortcuts for accessibility
- Modal-based question display, touch device optimizations
