"use strict";
// src/server/controllers/experimentController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExperimentEntriesCsv = exports.getExperimentEntryById = exports.createExperimentEntry = void 0;
var client_1 = require("@prisma/client");
var sync_1 = require("csv-stringify/sync");
var prisma = new client_1.PrismaClient();
function sanitizeSex(input) {
    // Trim whitespace and return the input as-is
    // No validation needed since we're accepting any text input
    return input.trim();
}
/**
 * POST /
 * Handles survey + experiment submission for Experiment_data.
 */
var createExperimentEntry = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, age, sexInput, ids_1, task_accuracy_1, durations_1, totalTime_1, overallAccuracy_1, 
    // Questionnaire data
    easier_form_1, easier_form_thoughts_1, used_calculator_1, used_scratch_paper_1, difficulty_rating_1, programming_experience_1, preferred_language_1, highest_math_course_1, used_vertical_division_1, parsedAge, safeAge_1, sexString_1, entry, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_1 = _a.name, age = _a.age, sexInput = _a.sex, ids_1 = _a.ids, task_accuracy_1 = _a.task_accuracy, durations_1 = _a.durations, totalTime_1 = _a.totalTime, overallAccuracy_1 = _a.overallAccuracy, easier_form_1 = _a.easier_form, easier_form_thoughts_1 = _a.easier_form_thoughts, used_calculator_1 = _a.used_calculator, used_scratch_paper_1 = _a.used_scratch_paper, difficulty_rating_1 = _a.difficulty_rating, programming_experience_1 = _a.programming_experience, preferred_language_1 = _a.preferred_language, highest_math_course_1 = _a.highest_math_course, used_vertical_division_1 = _a.used_vertical_division;
                parsedAge = parseInt(age, 10);
                safeAge_1 = isNaN(parsedAge) ? 0 : parsedAge;
                sexString_1 = sanitizeSex(sexInput);
                console.log('📥 Creating experiment entry with:', {
                    name: name_1,
                    safeAge: safeAge_1,
                    sexString: sexString_1,
                    ids: ids_1,
                    task_accuracy: task_accuracy_1,
                    durations: durations_1,
                    totalTime: totalTime_1,
                    overallAccuracy: overallAccuracy_1,
                });
                return [4 /*yield*/, prisma.$transaction(function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                        var created, perQuestionData;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(name_1 && name_1.trim())) return [3 /*break*/, 2];
                                    return [4 /*yield*/, tx.name.create({
                                            data: {
                                                name: name_1.trim(),
                                            },
                                        })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [4 /*yield*/, tx.experiment_data.create({
                                        data: {
                                            age: safeAge_1,
                                            sex: sexString_1,
                                            accuracy: overallAccuracy_1 !== null && overallAccuracy_1 !== void 0 ? overallAccuracy_1 : 0,
                                            task_accuracy: task_accuracy_1,
                                            task_ids: ids_1,
                                            total_time: totalTime_1 !== null && totalTime_1 !== void 0 ? totalTime_1 : 0,
                                            per_task_time: durations_1,
                                        },
                                    })
                                    // insert per-question rows
                                ];
                                case 3:
                                    created = _a.sent();
                                    perQuestionData = ids_1.map(function (questionId, index) { return ({
                                        question_id: parseInt(questionId, 10),
                                        user_id: created.id,
                                        result: task_accuracy_1[index],
                                        time: durations_1[index],
                                    }); });
                                    return [4 /*yield*/, tx.experiment_per_question.createMany({
                                            data: perQuestionData,
                                        })
                                        // Create questionnaire entry if questionnaire data is provided
                                    ];
                                case 4:
                                    _a.sent();
                                    if (!(easier_form_1 !== undefined ||
                                        easier_form_thoughts_1 !== undefined ||
                                        used_calculator_1 !== undefined ||
                                        used_scratch_paper_1 !== undefined ||
                                        difficulty_rating_1 !== undefined ||
                                        programming_experience_1 !== undefined ||
                                        preferred_language_1 !== undefined ||
                                        highest_math_course_1 !== undefined ||
                                        used_vertical_division_1 !== undefined)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, tx.questionnaire.create({
                                            data: {
                                                experiment_data_id: created.id,
                                                easier_form: easier_form_1 || null,
                                                easier_form_thoughts: easier_form_thoughts_1 || null,
                                                used_calculator: used_calculator_1 !== undefined
                                                    ? used_calculator_1 === true || used_calculator_1 === 'true'
                                                    : null,
                                                used_scratch_paper: used_scratch_paper_1 !== undefined
                                                    ? used_scratch_paper_1 === true || used_scratch_paper_1 === 'true'
                                                    : null,
                                                difficulty_rating: difficulty_rating_1 !== undefined
                                                    ? parseInt(difficulty_rating_1, 10) || null
                                                    : null,
                                                programming_experience: programming_experience_1 !== undefined
                                                    ? programming_experience_1 === true ||
                                                        programming_experience_1 === 'true'
                                                    : null,
                                                preferred_language: preferred_language_1 || null,
                                                highest_math_course: highest_math_course_1 || null,
                                                used_vertical_division: used_vertical_division_1 !== undefined
                                                    ? used_vertical_division_1 === true ||
                                                        used_vertical_division_1 === 'true'
                                                    : null,
                                            },
                                        })];
                                case 5:
                                    _a.sent();
                                    _a.label = 6;
                                case 6: return [2 /*return*/, created];
                            }
                        });
                    }); })];
            case 1:
                entry = _b.sent();
                res.status(201).json(entry);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                console.error('❌ Error in createExperimentEntry:', err_1);
                next(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createExperimentEntry = createExperimentEntry;
/**
 * GET /:id
 * Retrieve a single Experiment_data entry by its ID.
 */
var getExperimentEntryById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, entry, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = parseInt(req.params.id, 10);
                if (isNaN(id)) {
                    res.status(400).json({ error: 'Invalid ID format' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, prisma.experiment_data.findUnique({
                        where: { id: id }
                    })];
            case 1:
                entry = _a.sent();
                if (!entry) {
                    res.status(404).json({ error: 'Not found' });
                    return [2 /*return*/];
                }
                res.json(entry);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.error('❌ Error in getExperimentEntryById:', err_2);
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getExperimentEntryById = getExperimentEntryById;
/**
 * GET /
 * Download CSV of all Experiment_data results.
 */
var getAllExperimentEntriesCsv = function (_req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, csv, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.experiment_data.findMany()];
            case 1:
                data = _a.sent();
                csv = (0, sync_1.stringify)(data, { header: true });
                res
                    .status(200)
                    .header('Content-Type', 'text/csv')
                    .header('Content-Disposition', 'attachment; filename="experiment_data.csv"')
                    .send(csv);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.error('❌ Error in getAllExperimentEntriesCsv:', err_3);
                next(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllExperimentEntriesCsv = getAllExperimentEntriesCsv;
//# sourceMappingURL=kushaController.js.map