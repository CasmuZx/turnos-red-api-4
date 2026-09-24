import type { NextFunction, Request, Response } from 'express';
import { medicosService } from '../services/medicos.service.js';
import { updateDoctor, deleteDoctor } from '../services/medical-management.service.js';

export async function listarMedicos(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const status = 200;

  try {
    const medicos = medicosService.obtenerTodos(res.locals.query);
    return res.status(status).json(medicos);
  } catch (error) {
    next(error);
  }
}

export async function obtenerMedico(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const status = 200;

  try {
    const medico = medicosService.obtenerPorId(res.locals.params.id);
    return res.status(status).json(medico);
  } catch (error) {
    next(error);
  }
}

export async function crearMedico(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const status = 201;

  try {
    const medico = medicosService.crear(res.locals.body);
    return res.status(status).json(medico);
  } catch (error) {
    next(error);
  }
}

export async function actualizarMedico(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const status = 200;

  try {
    const medico = updateDoctor(res.locals.params.id, res.locals.body);
    return res.status(status).json(medico);
  } catch (error) {
    next(error);
  }
}

export async function eliminarMedico(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  const status = 204;

  try {
    deleteDoctor(res.locals.params.id);
    return res.status(status).end();
  } catch (error) {
    next(error);
  }
}