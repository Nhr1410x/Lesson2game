# Lesson2Game Development Roadmap

## Phase 1: Prototype v0.1 (Current 30% Scope - Completed)
- [x] Modern EdTech Landing Page with workflow overview and demo launcher.
- [x] PDF text extraction and validation pipeline (10MB limit, page parser, scanned PDF detection).
- [x] Server-side 3-Node Agentic AI Pipeline:
  - **Node 1: Curriculum Parser**: Extracts educational concepts, grade level, objectives, excerpts.
  - **Node 2: Pedagogical Designer**: Formulates 5-10 multiple-choice questions grounded in concepts.
  - **Node 3: Evaluator**: Verifies schema, index boundaries, source grounding, with auto-retry.
- [x] Kaplay.js 2D Quiz Runner Game:
  - Dynamic procedural runner mechanics with interactive obstacles.
  - Live question challenges, jumping/sliding animations, collision detection.
  - Live hearts (HP), combo score counter, instant pedagogical explanations.
- [x] Demonstration Mode: Standardized Biology lesson ("Quang hợp ở thực vật") ready for zero-key evaluation.
- [x] Game Preview & Review screens: Teachers can review questions, objectives, and test the game.

## Phase 2: Core Platform Expansion (Future 40% Scope)
- [ ] Multi-format Document Ingestion: Support for DOCX, PPTX slides, YouTube lecture transcripts, and web links.
- [ ] Additional Game Templates:
  - **Tower Defense**: Place towers answered by concept recall to defend against misconceptions.
  - **Classroom RPG / Dungeon Crawler**: Solve syllabus puzzles to unlock chests and defeat bosses.
  - **Card Battler**: Trade cards mapped to key concepts and their counters.
- [ ] Audio & Visual Asset Generation: Integration with Imagen 3 / Lyria for thematic sprites and 8-bit background music.
- [ ] Teacher Customization Studio: Inline question editor to tweak AI-generated questions and adjust runner speed.

## Phase 3: Full Enterprise & 7-Agent Architecture (Future 30% Scope)
- [ ] Complete 7-Agent Autonomous Swarm:
  1. Ingestion Agent
  2. Curriculum Analysis Agent
  3. Game Design Agent
  4. Asset & Sound Synthesis Agent
  5. Code / Ast Validation Agent
  6. QA & Playability Evaluator Agent
  7. Analytics & Pedagogical Feedback Agent
- [ ] Model Context Protocol (MCP) Server: Integration with classroom LMS (Google Classroom, Canvas, Moodle).
- [ ] Real-time Multiplayer Classroom Kahoot-style Competitions with WebSockets.
- [ ] Student Performance Analytics & Bloom's Taxonomy Mastery Dashboard.
