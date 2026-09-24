import type { Request, Response } from 'express';

export async function bienvenida(_req: Request, res: Response): Promise<Response> {
  let status = 200;

  try {
    return res.status(status).json({
      nombre: 'TurnosRed API',
      estado: 'activa',
      version: '2.0.0',
    });
  } catch {
    status = 500;
    return res.status(status).json({
      status,
      message: 'Error interno del servidor.',
      code: 'INTERNAL_ERROR',
      details: [],
    });
  }
}

export async function rutaNoEncontrada(_req: Request, res: Response): Promise<Response> {
  let status = 404;

  try {
    throw new Error('Ruta no encontrada.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor.';
    if (!(error instanceof Error)) status = 500;

    return res.status(status).json({
      status,
      message,
      code: status === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR',
      details: [],
    });
  }
}