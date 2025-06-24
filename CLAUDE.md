# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Running the Game:**
- Open `index.html` directly in any modern web browser
- No build system, package manager, or dependencies required
- For development: Use browser's developer tools for debugging

**Testing:**
- Manual testing only - open `index.html` and play through the game
- Test team setup (2-4 teams), question selection, scoring, and game completion
- Test responsive design on different screen sizes
- No automated test suite

## Architecture Overview

This is a single-page web application implementing a Summer Camp themed Jeopardy game using vanilla HTML, CSS, and JavaScript.

### Core Files Structure
- **index.html**: Main game interface with setup screen, game board, question modal, and final results
- **app.js**: Game logic, state management, scoring system, and all interaction handlers
- **style.css**: Design system with CSS variables, responsive layout, and themed styling
- **questions.json**: Game data in JSON format (6 categories × 5 questions each = 30 total)
- **questions_template.csv**: Template for creating new question sets

### Game Architecture
- **Frontend-only application**: No server, database, or external dependencies
- **State management**: Plain JavaScript objects for teams, questions, and game state
- **Data loading**: Fetches questions.json on page load, converts to nested object structure
- **Screen management**: Show/hide different game screens (setup → game → final results)

### Key Components
- **Team Setup**: 2-4 team configuration with name validation
- **Game Board**: 6×5 grid matching categories from questions.json
- **Question Modal**: Displays question/answer with scoring controls
- **Scoring System**: Real-time score tracking with add/subtract point controls
- **Responsive Design**: Mobile-first approach with touch device optimizations

### Question Data Format
Questions are stored in JSON format with structure:
```json
{"category": "Category Name", "points": 100, "question": "Question text", "answer": "What is the answer?"}
```

Categories are hardcoded in HTML but should match question data: Candy Corner, Pet Pals, Fun Places, Playground Games, Summer Camp Fun, Movie Magic.

### CSS Architecture
- **CSS Variables**: Extensive use of custom properties for theming
- **Design System**: Consistent spacing, typography, and color palette
- **Summer Camp Theme**: Bright colors with gradients and playful styling
- **Component-based**: Modular CSS classes for buttons, cards, modals, etc.

### Game Flow
1. Team setup screen (validate 2+ teams)
2. Main game board with category headers and point buttons
3. Question modal with show answer functionality
4. Score controls appear with question modal
5. Game ends after all 30 questions used
6. Final results screen with winner highlighting

### Browser Compatibility
- Modern browsers with ES6+ support
- Web Audio API for sound effects (currently disabled)
- CSS Grid and Flexbox for layout
- No polyfills or transpilation needed