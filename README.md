# Lesson2Game – Agentic AI Educational Game Factory (Prototype v0.1)

> **"Turn Every Lesson Into an Adventure."**  
> Chuyển đổi tài liệu giáo án tĩnh thành trò chơi 2D tương tác bằng Agentic AI pipeline và engine Kaplay.js.

---

## 1. Tổng Quan Dự Án

Lesson2Game là giải pháp EdTech đột phá phục vụ Hackathon, giải quyết bài toán biến đổi giáo án tĩnh của giáo viên thành trải nghiệm học tập sinh động cho học sinh:

1. **Giáo viên tải lên giáo án PDF** (tối đa 10MB).
2. **PDF Parser** thẩm định định dạng, trích xuất văn bản kỹ thuật số và tính toàn vẹn.
3. **Agentic AI Pipeline (3 Node StateGraph)**:
   - **Node 1: Curriculum Parser** (Gemini 3.8 Flash): Trích xuất tên bài, môn học, tóm tắt, mục tiêu sư phạm và các khái niệm trọng tâm kèm câu trích dẫn căn cứ khoa học.
   - **Node 2: Pedagogical Designer** (Gemini 3.8 Flash): Lựa chọn Quiz Runner 2D, sinh 5-8 câu hỏi trắc nghiệm (mỗi câu đúng 4 lựa chọn, chỉ số 0-3, lời giải thích sư phạm).
   - **Node 3: Evaluator**: Thẩm định 100% schema Zod, tính hợp lệ của đáp án, độ dài và đối soát căn cứ tài liệu nguồn. Nếu sai, kích hoạt vòng lặp tự sửa lỗi (tối đa 2 lần).
4. **Quiz Runner 2D Engine (Kaplay.js / HTML5 Canvas)**:
   - Game chạy cuộn cảnh side-scrolling, nền parallax đa tầng.
   - Nhân vật vượt qua các cổng chướng ngại vật bằng cách trả lời đúng câu hỏi.
   - Hệ thống mạng (3 tim), combo điểm thưởng, âm thanh 8-bit procedural qua Web Audio API.
   - Bảng tổng kết năng lực tri thức, tỷ lệ chính xác và bài học cần ôn tập.
5. **Chế độ Demo Mode**: Tích hợp sẵn bộ dữ liệu bài học Sinh Học ("Quang hợp ở thực vật") giúp ban giám khảo trải nghiệm hoàn chỉnh ngay cả khi chưa cấu hình API key.

---

## 2. Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Game Engine**: Kaplay.js 2D, HTML5 Canvas 60 FPS, Web Audio API Synthesizer.
- **Backend**: Node.js 22, Express, Multer, PDF Parser (v2).
- **AI Model**: Google Gemini (`gemini-3.8-flash`) với Structured JSON Schema qua `@google/genai`.
- **Validation**: Zod (Schema runtime type-safety tương đương Pydantic).

---

## 3. Cấu Trúc Thư Mục

```
.
├── docs/
│   ├── architecture.md           # Kiến trúc hệ thống và luồng dữ liệu
│   ├── api-contract.md           # Chi tiết các REST API endpoints
│   └── development-roadmap.md    # Lộ trình 30% Prototype -> 100% 7 Agents
├── public/
│   └── sample_quang_hop.pdf      # Tệp PDF mẫu để thử nghiệm upload
├── server/
│   ├── agents/
│   │   ├── curriculumParser.ts   # Node 1: Curriculum Parser Agent
│   │   ├── pedagogicalDesigner.ts# Node 2: Pedagogical Designer Agent
│   │   ├── evaluator.ts          # Node 3: Evaluator Validation Node
│   │   └── orchestrator.ts       # StateGraph workflow với retry loop
│   ├── demo/
│   │   └── photosynthesisDemo.ts # Bộ dữ liệu giáo án Sinh học chuẩn hoá
│   ├── geminiClient.ts           # Khởi tạo Gemini SDK với telemetry
│   └── pdfParser.ts              # Trích xuất và tiền xử lý văn bản PDF
├── src/
│   ├── components/
│   │   ├── Navbar.tsx            # Top bar theo chuẩn 3-zone contract
│   │   ├── LandingView.tsx       # Landing page giới thiệu và demo
│   │   ├── UploadView.tsx        # Drag & drop upload PDF (10MB)
│   │   ├── ProcessingView.tsx    # Giao diện hiển thị 5 bước AI thực tế
│   │   ├── PreviewView.tsx       # Xem trước câu hỏi và thông số game
│   │   └── ResultView.tsx        # Báo cáo kết quả và đánh giá sư phạm
│   ├── games/
│   │   └── quiz-runner/
│   │       ├── QuizRunnerEngine.tsx # Kaplay 2D Quiz Runner
│   │       └── types.ts             # Kiểu dữ liệu gameplay
│   ├── lib/
│   │   └── soundEffects.ts       # Bộ tổng hợp âm thanh Web Audio API
│   ├── types/
│   │   └── game.ts               # Zod Schemas (Lesson, GameConfig, Evaluator)
│   ├── App.tsx                   # Điều phối toàn bộ luồng ứng dụng
│   ├── index.css                 # Tailwind CSS cấu hình font Plus Jakarta Sans
│   └── main.tsx
├── tests/
│   └── run_tests.ts              # Bộ kiểm thử 14 bài test tự động
├── server.ts                     # Express server phục vụ API và Vite dev
├── package.json
└── README.md
```

---

## 4. Hướng Dẫn Cài Đặt & Chạy Local

### Bước 1: Clone và Cài đặt Dependencies
```bash
npm install
```

### Bước 2: Cấu hình Môi Trường
Sao chép `.env.example` thành `.env`:
```bash
cp .env.example .env
```
Cấu hình API Key (tuỳ chọn nếu muốn dùng AI thật):
```env
GEMINI_API_KEY="your-gemini-api-key-here"
GEMINI_MODEL="gemini-3.8-flash"
```
*(Nếu không có API key, ứng dụng vẫn cho phép trải nghiệm 100% tính năng thông qua nút "Bản Mẫu Sinh Học / Try Demo" hoặc tải file mẫu).*

### Bước 3: Chạy Kiểm Thử
```bash
npx tsx tests/run_tests.ts
```

### Bước 4: Khởi Động Máy Chủ
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`

---

## 5. Kết Quả Kiểm Thử (Definition of Done)

- [x] **Frontend**: Giao diện EdTech sắc nét, tuân thủ anti-slop, font Plus Jakarta Sans, không broken images, hỗ trợ phím tắt và click chuột.
- [x] **Backend**: Express xử lý upload PDF, kiểm tra MIME và kích thước 10MB.
- [x] **PDF Parser**: Trích xuất chính xác văn bản, phát hiện PDF rỗng hoặc file scan ảnh không có text.
- [x] **Gemini API**: Tích hợp `@google/genai` với model `gemini-3.8-flash` qua server proxy an toàn.
- [x] **3-Node Agent Workflow**: Curriculum Parser -> Pedagogical Designer -> Evaluator (tự sửa lỗi max 2 lần).
- [x] **Zod Data Schemas**: Lesson Data, Game Config (quiz_runner, 4 options, index 0-3), Evaluation Report.
- [x] **Quiz Runner 2D (Kaplay.js)**: Nhân vật chạy side-scrolling, chướng ngại vật, nhảy khi trả lời đúng, trừ mạng khi trả lời sai, âm thanh procedural.
- [x] **Demo Mode**: Bài mẫu "Quang hợp ở thực vật" chạy mượt mà không cần API key.
- [x] **Unit Tests**: Đạt 14/14 bài test (Schema, Evaluator, Bounds, Grounding, PDF Parser).
