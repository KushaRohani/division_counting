"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var kushaController_1 = require("../controllers/kushaController");
var router = (0, express_1.Router)();
// Experiment routes
router.get('/', kushaController_1.getAllExperimentEntriesCsv);
router.post('/', kushaController_1.createExperimentEntry);
router.get('/next-group', kushaController_1.getNextGroup);
router.get('/:id', kushaController_1.getExperimentEntryById);
exports.default = router;
//# sourceMappingURL=experimentRouter.js.map