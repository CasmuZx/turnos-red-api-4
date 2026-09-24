import type { NextFunction, Request, Response } from 'express';
import { turnosService } from '../services/turnos.service.js';

export async function listarTurnos(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const turnos = turnosService.obtenerTodos(res.locals.query);
    return res.status(200).json(turnos);
  } catch (error) {
    next(error);
  }
}

export async function obtenerTurno(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const turno = turnosService.obtenerPorId(res.locals.params.id);
    return res.status(200).json(turno);
  } catch (error) {
    next(error);
  }
}

export async function crearTurno(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const turno = turnosService.crear(res.locals.body);
    return res.status(201).json(turno);
  } catch (error) {
    next(error);
  }
}

export async function actualizarTurno(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const turno = turnosService.actualizar(
      res.locals.params.id,
      res.locals.body,
    );
    return res.status(200).json(turno);
  } catch (error) {
    next(error);
  }
}

export async function eliminarTurno(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    turnosService.eliminar(res.locals.params.id);
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}