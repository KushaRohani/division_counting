/**
 * Test script: POST various payloads to /experiment to find which cause 500.
 * Run: node scripts/post-experiment-tests.js
 * Requires: server running (npm run dev) and DATABASE_URL in .env
 */

const axios = require('axios');

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3001';
const EXPERIMENT_URL = `${BASE}/experiment`;

// Minimal required fields for experiment_data + per_question (all strings for survey fields)
const basePayload = {
  name: '',
  age: '25',
  sex: 'female',
  years_programming: '2',
  school_year: 'junior',
  study_major: 'CS',
  last_math_class_years: '2',
  preferred_language: 'en',
  highest_math_course: 'calc',
  used_vertical_division: 'yes',
  ids: ['1', '2'],
  task_accuracy: [true, false],
  durations: [30, 30],
  totalTime: 60,
  overallAccuracy: 0.8,
};

async function runOne(name, payload) {
  try {
    const res = await axios.post(EXPERIMENT_URL, payload, {
      validateStatus: () => true,
      timeout: 10000,
    });
    const status = res.status;
    const ok = status >= 200 && status < 300;
    return { name, status, ok, error: ok ? null : (res.data?.message || res.data?.error || JSON.stringify(res.data).slice(0, 120)) };
  } catch (err) {
    const status = err.response?.status ?? 'ERR';
    const message = err.response?.data?.message || err.response?.data?.error || err.message || '';
    return { name, status, ok: false, error: String(message).slice(0, 120) };
  }
}

async function main() {
  console.log('POST', EXPERIMENT_URL);
  console.log('Using base URL:', BASE);
  console.log('');

  const results = [];

  // 1. Minimal valid (no questionnaire)
  results.push(await runOne('1. Minimal valid (no questionnaire)', { ...basePayload }));

  // 2. With questionnaire: easier_form "slash", thoughts "test"
  results.push(await runOne('2. Questionnaire: easier_form=slash, thoughts=test', {
    ...basePayload,
    easier_form: 'slash',
    easier_form_thoughts: 'test',
    used_calculator: true,
    used_scratch_paper: false,
    difficulty_rating: 3,
  }));

  // 3. Suspected problem: easier_form "both", easier_form_thoughts "test"
  results.push(await runOne('3. Questionnaire: easier_form=both, thoughts=test', {
    ...basePayload,
    easier_form: 'both',
    easier_form_thoughts: 'test',
    used_calculator: false,
    used_scratch_paper: true,
    difficulty_rating: 5,
  }));

  // 4. easier_form "bar", thoughts with special chars
  results.push(await runOne('4. Questionnaire: easier_form=bar, thoughts with quotes "test"', {
    ...basePayload,
    easier_form: 'bar',
    easier_form_thoughts: 'test "quoted" and \'apostrophe\'',
    used_calculator: true,
    used_scratch_paper: true,
    difficulty_rating: 4,
  }));

  // 5. easier_form "neither", empty thoughts
  results.push(await runOne('5. Questionnaire: easier_form=neither, empty thoughts', {
    ...basePayload,
    easier_form: 'neither',
    easier_form_thoughts: '',
    used_calculator: false,
    used_scratch_paper: false,
    difficulty_rating: 7,
  }));

  // 6. Sex missing (undefined)
  const payloadNoSex = { ...basePayload };
  delete payloadNoSex.sex;
  results.push(await runOne('6. Missing sex', payloadNoSex));

  // 7. Sex empty string
  results.push(await runOne('7. Sex empty string', { ...basePayload, sex: '' }));

  // 8. ids missing
  const payloadNoIds = { ...basePayload };
  delete payloadNoIds.ids;
  results.push(await runOne('8. Missing ids', payloadNoIds));

  // 9. ids empty array
  results.push(await runOne('9. ids=[] (empty array)', { ...basePayload, ids: [], task_accuracy: [], durations: [] }));

  // 10. task_accuracy missing
  const payloadNoAcc = { ...basePayload };
  delete payloadNoAcc.task_accuracy;
  results.push(await runOne('10. Missing task_accuracy', payloadNoAcc));

  // 11. durations missing
  const payloadNoDurations = { ...basePayload };
  delete payloadNoDurations.durations;
  results.push(await runOne('11. Missing durations', payloadNoDurations));

  // 12. Questionnaire: easier_form_thoughts as number (wrong type)
  results.push(await runOne('12. Questionnaire: easier_form_thoughts as number', {
    ...basePayload,
    easier_form: 'both',
    easier_form_thoughts: 12345,
    used_calculator: true,
    used_scratch_paper: false,
    difficulty_rating: 3,
  }));

  // 13. Questionnaire: easier_form as number
  results.push(await runOne('13. Questionnaire: easier_form as number', {
    ...basePayload,
    easier_form: 999,
    easier_form_thoughts: 'test',
    used_calculator: false,
    used_scratch_paper: false,
    difficulty_rating: 2,
  }));

  // 14. difficulty_rating as string "5"
  results.push(await runOne('14. difficulty_rating as string "5"', {
    ...basePayload,
    easier_form: 'slash',
    easier_form_thoughts: 'test',
    used_calculator: true,
    used_scratch_paper: false,
    difficulty_rating: '5',
  }));

  // 15. used_calculator as string "true"
  results.push(await runOne('15. used_calculator as string "true"', {
    ...basePayload,
    easier_form: 'both',
    easier_form_thoughts: 'test',
    used_calculator: 'true',
    used_scratch_paper: 'false',
    difficulty_rating: 4,
  }));

  // 16. Very long easier_form_thoughts
  results.push(await runOne('16. Very long easier_form_thoughts', {
    ...basePayload,
    easier_form: 'both',
    easier_form_thoughts: 'A'.repeat(10000),
    used_calculator: false,
    used_scratch_paper: false,
    difficulty_rating: 1,
  }));

  // 17. Unicode in thoughts
  results.push(await runOne('17. Unicode in easier_form_thoughts', {
    ...basePayload,
    easier_form: 'both',
    easier_form_thoughts: 'Slash était plus facile 日本語 🎉',
    used_calculator: false,
    used_scratch_paper: true,
    difficulty_rating: 3,
  }));

  // 18. Only questionnaire fields (no experiment arrays) - might be invalid
  results.push(await runOne('18. Only questionnaire, no ids/accuracy/durations', {
    ...basePayload,
    ids: [],
    task_accuracy: [],
    durations: [],
    easier_form: 'both',
    easier_form_thoughts: 'test',
  }));

  // 19. ids with non-numeric string
  results.push(await runOne('19. ids with non-numeric string', {
    ...basePayload,
    ids: ['abc', '2'],
    task_accuracy: [true, false],
    durations: [30, 30],
  }));

  // 20. task_accuracy has undefined at index
  results.push(await runOne('20. task_accuracy shorter than ids', {
    ...basePayload,
    ids: ['1', '2', '3'],
    task_accuracy: [true, false],
    durations: [30, 30, 30],
  }));

  // Print summary
  console.log('--- RESULTS ---\n');
  let passed = 0;
  let failed = 0;
  for (const r of results) {
    const icon = r.ok ? '✓' : '✗';
    const status = typeof r.status === 'number' ? r.status : r.status;
    console.log(`${icon} ${r.name}`);
    console.log(`   Status: ${status}${r.error ? ` | ${r.error}` : ''}`);
    if (r.ok) passed++; else failed++;
  }
  console.log('');
  console.log(`Passed: ${passed} | Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Script error:', err);
  process.exit(1);
});
