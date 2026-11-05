# Lesson2Game API Contract (v0.1)

Base URL: `/api/v1`

---

### 1. Health & Configuration Check
- **Endpoint**: `GET /api/v1/health`
- **Description**: Returns backend status, Gemini API configuration status, and model name.
- **Response**: `200 OK`
```json
{
  "status": "healthy",
  "gemini_configured": true,
  "model": "gemini-3.8-flash",
  "timestamp": "2026-11-04T07:16:00.000Z"
}
```

---

### 2. Generate Game from PDF
- **Endpoint**: `POST /api/v1/games/generate`
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `file`: PDF binary file (max 10MB)
- **Response**: `200 OK`
```json
{
  "generation_id": "gen_1742080000000_abc",
  "processing_status": "completed",
  "mode": "ai_pipeline",
  "lesson_data": {
    "lesson_title": "string",
    "subject": "string",
    "grade_level": "string",
    "summary": "string",
    "learning_objectives": ["string"],
    "key_concepts": [
      {
        "concept_id": "c1",
        "concept_name": "string",
        "explanation": "string",
        "source_excerpt": "string"
      }
    ]
  },
  "game_config": {
    "game_id": "game_1742080000000",
    "game_title": "string",
    "game_type": "quiz_runner",
    "difficulty": "medium",
    "estimated_duration": "5 minutes",
    "learning_objectives": ["string"],
    "questions": [
      {
        "question_id": "q1",
        "question_text": "string",
        "options": ["A", "B", "C", "D"],
        "correct_answer_index": 0,
        "explanation": "string",
        "related_concept_id": "c1",
        "source_excerpt": "string"
      }
    ]
  },
  "evaluation_report": {
    "schema_valid": true,
    "question_count_valid": true,
    "answer_index_valid": true,
    "source_grounding_valid": true,
    "validation_errors": [],
    "retry_count": 0,
    "overall_status": "passed"
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: `{ "error": "Vui lòng chọn file PDF hợp lệ dưới 10MB." }`
  - `422 Unprocessable Entity`: `{ "error": "Không thể trích xuất văn bản từ tài liệu PDF (tài liệu rỗng hoặc là bản scan ảnh)." }`
  - `500 Internal Server Error`: `{ "error": "Quá trình sinh dữ liệu game gặp sự cố.", "details": "..." }`

---

### 3. Demo Mode (Photosynthesis Biology Lesson)
- **Endpoint**: `POST /api/v1/games/demo`
- **Description**: Returns the pre-verified standardized curriculum & game configuration for "Quang hợp ở thực vật" (Photosynthesis).
- **Response**: `200 OK`
```json
{
  "generation_id": "demo_quang_hop_sinh_hoc",
  "processing_status": "completed",
  "mode": "demo_mode",
  "lesson_data": { ... },
  "game_config": { ... },
  "evaluation_report": { ... }
}
```

---

### 4. Retrieve Generation
- **Endpoint**: `GET /api/v1/games/:generation_id`
- **Description**: Retrieves previously generated game by ID from server memory cache.
- **Response**: `200 OK` or `404 Not Found`
