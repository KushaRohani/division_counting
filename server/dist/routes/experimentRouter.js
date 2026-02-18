"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var kushaController_1 = require("../controllers/kushaController");
var router = (0, express_1.Router)();
// Experiment routes
//router.get('/', getAllExperimentEntriesCsv);
router.post('/', kushaController_1.createExperimentEntry);
router.post('/name', kushaController_1.createNameEntry);
//router.get('/:id', getExperimentEntryById);
exports.default = router;
//# sourceMappingURL=experimentRouter.js.map