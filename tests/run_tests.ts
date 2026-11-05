import { parsePdfBuffer } from '../server/pdfParser.ts';
import { GameConfigSchema, LessonDataSchema } from '../src/types/game.ts';
import { evaluateGameNode } from '../server/agents/evaluator.ts';
import { DEMO_LESSON_DATA, DEMO_GAME_CONFIG } from '../server/demo/photosynthesisDemo.ts';

async function runAllTests() {
  console.log('=====================================================');
  console.log('🧪 RUNNING LESSON2GAME PROTOTYPE V0.1 TEST SUITE');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} - ${details || 'Assertion failed'}`);
      failed++;
    }
  }

  // 1. Test Schema Validation on Demo Data
  try {
    const lessonResult = LessonDataSchema.safeParse(DEMO_LESSON_DATA);
    assert('Lesson Schema: Demo lesson validates successfully', lessonResult.success);

    const gameResult = GameConfigSchema.safeParse(DEMO_GAME_CONFIG);
    assert('Game Config Schema: Demo game config validates successfully', gameResult.success);
  } catch (e: any) {
    assert('Schema validation error', false, e.message);
  }

  // 2. Test Evaluator on Valid Game
  try {
    const report = evaluateGameNode(DEMO_LESSON_DATA, DEMO_GAME_CONFIG, 0);
    assert('Evaluator: Valid demo passes all checks', report.overall_status === 'passed');
    assert('Evaluator: schema_valid === true', report.schema_valid === true);
    assert('Evaluator: question_count_valid === true', report.question_count_valid === true);
    assert('Evaluator: answer_index_valid === true', report.answer_index_valid === true);
    assert('Evaluator: source_grounding_valid === true', report.source_grounding_valid === true);
    assert('Evaluator: Zero validation errors on clean data', report.validation_errors.length === 0);
  } catch (e: any) {
    assert('Evaluator pass check', false, e.message);
  }

  // 3. Test Evaluator Catches Invalid Answer Index
  try {
    const corruptedConfig = JSON.parse(JSON.stringify(DEMO_GAME_CONFIG));
    corruptedConfig.questions[0].correct_answer_index = 99; // Invalid index!
    const report = evaluateGameNode(DEMO_LESSON_DATA, corruptedConfig, 0);
    assert(
      'Evaluator: Catches invalid answer index out of 0-3 range',
      report.overall_status === 'failed' &&
        report.answer_index_valid === false &&
        report.validation_errors.some((err) => err.includes('không hợp lệ'))
    );
  } catch (e: any) {
    assert('Evaluator invalid index check', false, e.message);
  }

  // 4. Test Evaluator Catches Less Than 5 Questions
  try {
    const shortConfig = JSON.parse(JSON.stringify(DEMO_GAME_CONFIG));
    shortConfig.questions = shortConfig.questions.slice(0, 3); // only 3 questions
    const report = evaluateGameNode(DEMO_LESSON_DATA, shortConfig, 0);
    assert(
      'Evaluator: Catches insufficient questions (< 5)',
      report.overall_status === 'failed' &&
        report.question_count_valid === false &&
        report.validation_errors.some((err) => err.includes('không đạt yêu cầu tối thiểu'))
    );
  } catch (e: any) {
    assert('Evaluator min questions check', false, e.message);
  }

  // 5. Test Evaluator Catches Missing Source Grounding
  try {
    const ungroundedConfig = JSON.parse(JSON.stringify(DEMO_GAME_CONFIG));
    ungroundedConfig.questions[1].related_concept_id = 'non_existent_concept_999';
    const report = evaluateGameNode(DEMO_LESSON_DATA, ungroundedConfig, 0);
    assert(
      'Evaluator: Catches question referencing non-existent concept',
      report.overall_status === 'failed' &&
        report.source_grounding_valid === false &&
        report.validation_errors.some((err) => err.includes('không tồn tại'))
    );
  } catch (e: any) {
    assert('Evaluator grounding check', false, e.message);
  }

  // 6. Test PDF Parser on Invalid File Format
  try {
    const fakeBuffer = Buffer.from('This is a text file, not a PDF');
    await parsePdfBuffer(fakeBuffer, 'test.txt');
    assert('PDF Parser: Rejects non-PDF file', false, 'Should have thrown an error');
  } catch (err: any) {
    assert(
      'PDF Parser: Correctly rejects non-PDF file',
      err.message.includes('không phải là định dạng PDF chuẩn')
    );
  }

  // 7. Test PDF Parser on Empty Buffer
  try {
    const emptyBuffer = Buffer.from([]);
    await parsePdfBuffer(emptyBuffer, 'empty.pdf');
    assert('PDF Parser: Rejects empty buffer', false, 'Should have thrown an error');
  } catch (err: any) {
    assert(
      'PDF Parser: Correctly rejects empty buffer',
      err.message.includes('rỗng hoặc không có dữ liệu')
    );
  }

  // 8. Test PDF Parser on Valid PDF Structure
  try {
    // Generate minimal valid PDF with text
    const minimalPdf = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <<>>>> endobj
4 0 obj <</Length 200>>
stream
BT
/F1 12 Tf
72 712 Td
(Quang hop o thuc vat la qua trinh bien doi nang luong anh sang mat troi thanh hoa nang trong hop chat huu co glucose va giai phong khi oxy phuc vu su song tren trai dat.) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000216 00000 n 
trailer <</Size 5 /Root 1 0 R>>
startxref
468
%%EOF`;

    const validBuffer = Buffer.from(minimalPdf);
    const parsed = await parsePdfBuffer(validBuffer, 'sample_quang_hop.pdf');
    assert(
      'PDF Parser: Extracts valid PDF text and word count',
      parsed.text.length > 50 && parsed.wordCount > 10 && parsed.numPages === 1
    );
  } catch (err: any) {
    assert('PDF Parser valid buffer', false, err.message);
  }

  console.log('\n=====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
