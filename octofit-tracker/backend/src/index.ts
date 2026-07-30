import express from 'express';
import './config/database';
import apiRouter from './routes';

const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(express.json());
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

app.use('/api', apiRouter);

app.use((_request, response) => {
  response.status(404).json({ message: 'Endpoint not found.' });
});

app.use((error: Error & { code?: number }, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
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