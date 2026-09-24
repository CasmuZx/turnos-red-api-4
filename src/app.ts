import express from 'express';
import { bienvenida, rutaNoEncontrada } from './controllers/general.controller.js';
import { errorHandler } from './middlewares/error-handler.js';
import { turnosRouter } from './routes/turnos.routes.js';
import { medicosRouter } from './routes/medicos.routes.js';

export const app = express();

app.use(express.json({ limit: '100kb' }));
app.use(express.static('public'));

app.get('/', bienvenida);
app.use('/turnos', turnosRouter);
app.use('/medicos', medicosRouter);

app.use(rutaNoEncontrada);
app.use(errorHandler);