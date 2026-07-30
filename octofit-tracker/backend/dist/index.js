"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./config/database");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 8000;
app.use(express_1.default.json());
app.use((request, response, next) => {
    const allowedOrigin = process.env.CODESPACE_NAME
        ? `https://${process.env.CODESPACE_NAME}-5173.app.github.dev`
        : 'http://localhost:5173';
    response.header('Access-Control-Allow-Origin', allowedOrigin);
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (request.method === 'OPTIONS') {
        response.sendStatus(204);
        return;
    }
    next();
});
app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok', service: 'OctoFit Tracker API' });
});
app.use('/api', routes_1.default);
app.use((_request, response) => {
    response.status(404).json({ message: 'Endpoint not found.' });
});
app.use((error, _request, response, _next) => {
    console.error(error);
    const status = error.code === 11000 ? 409 : 500;
    response.status(status).json({ message: status === 409 ? 'That record already exists.' : 'Something went wrong.' });
});
app.listen(port, '0.0.0.0', () => {
    const codespaceName = process.env.CODESPACE_NAME;
    const baseUrl = codespaceName
        ? `https://${codespaceName}-${port}.app.github.dev`
        : `http://localhost:${port}`;
    console.log(`OctoFit Tracker API running at ${baseUrl}`);
});
