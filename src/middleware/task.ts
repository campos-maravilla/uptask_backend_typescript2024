

import type { NextFunction, Request, Response } from "express";
import Task, { ITask } from "../models/Task";

//esto es de typescript 
declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function taskExists(req: Request, res: Response, next: NextFunction) {

    try {
        //proyectId=>viene de proyectRoutes(router.post('/:projectId/tasks'))
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if (!task) {
            return res.status(404).json({
                error: 'Tarea No Encontrada'
            })
        }
        //ya esta pasando el proyecto en el request('/:projectId/tasks')
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {

    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('Acción no válida')
        return res.status(400).json({ error: error.message })
    }
    next()
}

// tiene autorizaciòn
export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
    //si el usuario que esta haciendo estas acciones es diferente al manager
    if (req.user._id.toString() !== req.project.manager.toString()) {
        const error = new Error('Acción no válida')
        return res.status(400).json({ error: error.message })
    }
    next()
}