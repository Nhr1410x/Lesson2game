# Lesson2Game – Prototype v0.1 Architecture

## 1. Executive Overview
Lesson2Game is an Agentic AI Educational Game Factory designed for EdTech Hackathons. It transforms static educational documents (PDF lesson plans) into interactive, browser-playable 2D runner games using an orchestrated 3-node agent workflow and Kaplay.js game engine.

## 2. Core Architecture: Modular Monolith

```
                                  [ Teacher / User ]
                                           │
                                  PDF Upload / Demo
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React + Vite + Tailwind)                │
│  - Landing Page: Hero, Feature Cards, 4-step workflow, Demo trigger         │
│  - Create Game: Drag & drop PDF uploader (10MB limit), validation           │
│  - AI Processing: Live step-by-step agent telemetry & status visualization  │
│  - Game Preview: Lesson metadata, concepts, questions list                  │
│  - Game Player: Kaplay.js 2D Quiz Runner with canvas rendering              │
│  - Results Screen: Score tally, accuracy %, concept breakdown, retry        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / REST (/api/v1/*)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVER (Node.js + Express)                   │
│  - PDF Parser: File validation, MIME check, text extraction, page parsing   │
│  - In-Memory Generation Store: Session & generation result caching          │
│  - Demo Provider: Built-in standardized Biology curriculum & game config   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AGENTIC AI ORCHESTRATION PIPELINE                        │
│                                                                             │
│  ┌──────────────────────┐                                                   │
│  │ NODE 1:              │ Input: Extracted PDF Document Text                │
│  │ Curriculum Parser    │ Task: Extract title, subject, objectives, concepts│
│  │ (Gemini 3.8 Flash)   │ Output: Lesson JSON (Zod validated)               │
│  └──────────┬───────────┘                                                   │
│             │                                                               │
│             ▼                                                               │
│  ┌──────────────────────┐                                                   │
│  │ NODE 2:              │ Input: Lesson JSON                                │
│  │ Pedagogical Designer │ Task: Select Quiz Runner, generate 5-10 questions │
│  │ (Gemini 3.8 Flash)   │ Output: Game Config JSON (4 options, index 0-3)   │
│  └──────────┬───────────┘ ◄────────────┐ (Retry on evaluation error, max 2) │
│             │                          │                                    │
│             ▼                          │                                    │
│  ┌──────────────────────┐              │                                    │
│  │ NODE 3:              │ Input: Lesson JSON + Game Config JSON             │
│  │ Evaluator            │ Checks: Schema, question count (>=5), 4 options,  │
│  │                      │ grounding in source, answer index, explanations   │
│  └──────────┬───────────┘ ─────────────┘                                    │
│             │ (Pass)                                                        │
│             ▼                                                               │
│     [ Final Game Config ]                                                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       KAPLAY.JS 2D QUIZ RUNNER ENGINE                       │
│  - Side-scrolling runner terrain & dynamic animated background              │
│  - Hero runner with run / jump / hurt sprite animations                     │
│  - Dynamic obstacle spawning synchronized with question popups              │
│  - 4 Interactive answer portals / buttons with keyboard (1-4) & click       │
│  - Immediate visual/audio feedback, obstacle clearing, HP hearts, points    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3. Data Schemas
- **Lesson JSON**: `lesson_title`, `subject`, `grade_level`, `summary`, `learning_objectives`, `key_concepts` (`concept_id`, `concept_name`, `explanation`, `source_excerpt`).
- **Game Config JSON**: `game_id`, `game_title`, `game_type` (`"quiz_runner"`), `difficulty`, `estimated_duration`, `learning_objectives`, `questions` (`question_id`, `question_text`, `options` [exact 4], `correct_answer_index` [0-3], `explanation`, `related_concept_id`, `source_excerpt`).
- **Evaluation Report**: `schema_valid`, `question_count_valid`, `answer_index_valid`, `source_grounding_valid`, `validation_errors`, `overall_status` (`"passed"` | `"failed"`).

## 4. Technical Risks & Mitigations
- **API Key Absence**: Demo Mode provided with authentic Biology lesson ("Quang hợp ở thực vật") allowing full offline/unkeyed hackathon demo.
- **Scanned PDF without text**: Server checks text length ($> 100$ characters) and returns informative message in Vietnamese/English.
- **Malformed LLM Output**: Strict Zod JSON schema validation and retry loop (up to 2 retries) with targeted error feedback.
- **Game Performance**: Lightweight Kaplay.js canvas rendering with 60 FPS target, no heavy external sprite dependencies, resilient geometric and procedural art assets.
