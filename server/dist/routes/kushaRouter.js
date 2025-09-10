"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var kushaController_1 = require("../controllers/kushaController");
var router = (0, express_1.Router)();
// Experiment routes
router.get('/', kushaController_1.getAllExperimentEntriesCsv);
router.post('/', kushaController_1.createExperimentEntry);
router.get('/:id', kushaController_1.getExperimentEntryById);
exports.default = router;
//# sourceMappingURL=kushaRouter.js.map