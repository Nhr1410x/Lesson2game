import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');

export interface ExtractedPdfResult {
  text: string;
  numPages: number;
  wordCount: number;
  charCount: number;
  filename: string;
}

export async function parsePdfBuffer(buffer: Buffer, filename: string): Promise<ExtractedPdfResult> {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  if (!buffer || buffer.length === 0) {
    throw new Error('File PDF rỗng hoặc không có dữ liệu.');
  }

  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error('Dung lượng file vượt quá giới hạn cho phép (tối đa 10MB).');
  }

  // Check PDF magic header '%PDF-'
  const header = buffer.subarray(0, 5).toString('ascii');
  if (!header.startsWith('%PDF-')) {
    throw new Error('Tệp tải lên không phải là định dạng PDF chuẩn.');
  }

  try {
    let rawText = '';
    let numPages = 1;

    if (pdfParseModule.PDFParse) {
      const parser = new pdfParseModule.PDFParse({ data: buffer });
      const res = await parser.getText();
      rawText = res?.text || '';
      numPages = res?.total || res?.pages?.length || 1;
      if (typeof parser.destroy === 'function') {
        await parser.destroy();
      }
    } else if (typeof pdfParseModule === 'function') {
      const data = await pdfParseModule(buffer);
      rawText = data?.text || '';
      numPages = data?.numpages || 1;
    } else {
      throw new Error('Không thể khởi tạo bộ giải mã PDF trong môi trường runtime.');
    }

    // Clean up whitespace & page headers added by parser
    let extractedText = rawText
      .replace(/-- \d+ of \d+ --/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (extractedText.length < 50) {
      throw new Error(
        'Tài liệu PDF không chứa văn bản có thể trích xuất. Có thể đây là bản scan ảnh hoặc file PDF chỉ chứa hình. Vui lòng cung cấp file PDF có chứa văn bản kỹ thuật số.'
      );
    }

    // Truncate to safe token budget if excessively long (e.g. 30,000 characters)
    const MAX_CHARS = 30000;
    if (extractedText.length > MAX_CHARS) {
      extractedText =
        extractedText.substring(0, MAX_CHARS) +
        '\n\n[...Đã lược bớt phần sau để tối ưu hóa quá trình phân tích...]';
    }

    const words = extractedText.split(/\s+/).filter(Boolean);

    return {
      text: extractedText,
      numPages,
      wordCount: words.length,
      charCount: extractedText.length,
      filename,
    };
  } catch (error: any) {
    if (
      error.message &&
      (error.message.includes('không chứa văn bản') ||
        error.message.includes('không phải là định dạng') ||
        error.message.includes('rỗng hoặc không có dữ liệu') ||
        error.message.includes('vượt quá giới hạn'))
    ) {
      throw error;
    }
    throw new Error(`Lỗi khi đọc file PDF: ${error.message || 'Tài liệu bị lỗi hoặc mã hóa'}`);
  }
}
