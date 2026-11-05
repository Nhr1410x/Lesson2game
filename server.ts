import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { isGeminiConfigured, GEMINI_MODEL } from './server/geminiClient.ts';
import { parsePdfBuffer } from './server/pdfParser.ts';
import { runAgentWorkflow } from './server/agents/orchestrator.ts';
import { DEMO_RESPONSE } from './server/demo/photosynthesisDemo.ts';
import { GenerationResponse } from './src/types/game.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// In-memory store for generations
const generationsStore = new Map<string, GenerationResponse>();
generationsStore.set(DEMO_RESPONSE.generation_id, DEMO_RESPONSE);

// Setup multer in-memory storage with 10MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    const isPdf =
      file.mimetype === 'application/pdf' ||
      file.originalname.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận tệp định dạng PDF.'));
    }
  },
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use((req, _res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// ----------------------------------------------------------------------
// API ROUTES (/api/v1)
// ----------------------------------------------------------------------

// 1. Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'healthy',
    gemini_configured: isGeminiConfigured(),
    model: GEMINI_MODEL,
    timestamp: new Date().toISOString(),
  });
});

// 2. Demo generation (supports both GET and POST)
app.all('/api/v1/games/demo', (_req, res) => {
  res.json(DEMO_RESPONSE);
});

// 3. Generate from PDF
app.post('/api/v1/games/generate', upload.single('file'), async (req, res): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({
        error: 'Vui lòng tải lên tệp PDF bài học (tối đa 10MB).',
      });
      return;
    }

    // 1. Extract text from PDF
    let pdfResult;
    try {
      pdfResult = await parsePdfBuffer(file.buffer, file.originalname);
    } catch (parseError: any) {
      res.status(422).json({
        error: parseError.message || 'Không thể đọc nội dung PDF.',
      });
      return;
    }

    // 2. Check if Gemini API is configured
    if (!isGeminiConfigured()) {
      res.status(400).json({
        error: 'Chưa cấu hình GEMINI_API_KEY. Vui lòng sử dụng chế độ Demo hoặc cấu hình API Key.',
        can_use_demo: true,
      });
      return;
    }

    // 3. Execute 3-Node Agentic AI Pipeline
    const result = await runAgentWorkflow(pdfResult.text, pdfResult.filename);

    // Cache in memory
    generationsStore.set(result.generation_id, result);

    res.json(result);
  } catch (error: any) {
    console.error('Lỗi trong quá trình sinh game:', error);
    res.status(500).json({
      error: error.message || 'Hệ thống gặp sự cố khi phân tích tài liệu và tạo game.',
      details: error.stack,
    });
  }
});

// 4. Retrieve Generation by ID
app.get('/api/v1/games/:generation_id', (req, res): void => {
  const { generation_id } = req.params;
  const item = generationsStore.get(generation_id);
  if (!item) {
    res.status(404).json({ error: 'Không tìm thấy dữ liệu trò chơi tương ứng.' });
    return;
  }
  res.json(item);
});

// ----------------------------------------------------------------------
// Vite Dev Server / Static Hosting
// ----------------------------------------------------------------------
async function startServer() {
  const fs = await import('fs');
  const distPath = path.resolve(__dirname, 'dist', 'index.html');
  const hasDist = fs.existsSync(distPath);

  if (process.env.NODE_ENV === 'production' || (hasDist && process.env.VITE_DEV !== 'true')) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) return next();
      res.sendFile(distPath);
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace?.(e);
        next(e);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Lesson2Game Server] Running on http://localhost:${PORT}`);
    console.log(`[Gemini API] Configured: ${isGeminiConfigured()} (${GEMINI_MODEL})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
