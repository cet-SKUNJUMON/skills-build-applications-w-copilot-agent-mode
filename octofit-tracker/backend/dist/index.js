"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./config/database");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const port = 8000;
function getApiBaseUrl() {
    const codespaceName = process.env.CODESPACE_NAME;
    return codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';
}
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
app.get('/', (_request, response) => {
    response.status(200).send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OctoFit Tracker API</title>
    <style>
      body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; margin: 2rem; line-height: 1.5; }
      h1 { margin-bottom: 0.5rem; }
      ul { padding-left: 1.2rem; }
      a { color: #0f766e; text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <h1>OctoFit Tracker API</h1>
    <p>The API is running on port 8000.</p>
    <ul>
      <li><a href="/api/health">GET /api/health</a></li>
      <li><a href="/api/users">GET /api/users</a></li>
      <li><a href="/api/activities">GET /api/activities</a></li>
    </ul>
  </body>
</html>`);
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
    console.log(`OctoFit Tracker API running at ${getApiBaseUrl()}`);
});
