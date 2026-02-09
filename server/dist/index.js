"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server/index.ts
var express_1 = __importDefault(require("express"));
var experimentRouter_1 = __importDefault(require("./routes/experimentRouter"));
var errorHandler_1 = require("./middlewares/errorHandler");
var app = (0, express_1.default)();
//app.use(cors())
app.use(express_1.default.json());
// Static file serving removed - PDFs are now served from client's public folder
// health check
app.get('/', function (_req, res) {
    res.send('Server is running!');
});
// all /experiment endpoints
app.use('/experiment', experimentRouter_1.default);
// error handler (must have 4 params: (err, req, res, next))
app.use(errorHandler_1.errorHandler);
var PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
    return console.log("\uD83D\uDE80  Server ready at http://localhost:".concat(PORT));
});
//# sourceMappingURL=index.js.map