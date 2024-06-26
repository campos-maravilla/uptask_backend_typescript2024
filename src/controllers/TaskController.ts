
import type { Request, Response } from "express";

import Task from "../models/Task";

export class TaskController {
    static createTask = async (req: Request, res: Response) => {

        try {
            const task = new Task(req.body)
            //task.proyect=>viene de task project.id es la instancia de project const project=await Project.findById(projectId))
            //req=>viene de middleware/project.ts
            task.project = req.project.id
            req.project.tasks.push(task.id)//agregando la tarea al proyecto

            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Tarea creada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            //populate('project')=>trae todo lo de project
            const tasks = await Task.find({ project: req.project.id }).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const task = await Task.findById(req.task.id).populate({ path: 'completedBy.user', select: 'id name email' }).populate({ path: 'notes', populate: { path: 'createdBy', select: 'id name email' } })
            res.json(task)
        } catch (error) {
            if (error.kind === 'ObjectId') {
                const error = new Error('Tarea no Encontrada')
                return res.status(404).json({ msg: error.message })
            }
            // res.status(500).json({error:'Hubo un error'})
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            res.send('Tarea actualizada correctamente')

        } catch (error) {
            /* if (error.kind === 'ObjectId') {
               const error = new Error('Tarea no Encontrada')
               return res.status(404).json({ msg: error.message })
           }  */
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString())

            await Promise.allSettled([req.task.deleteOne(), req.project.save()])
            res.send('Tarea Eliminada Correctamente')
        } catch (error) {
            /* if (error.kind === 'ObjectId') {
               const error = new Error('Tarea no Encontrada')
               return res.status(404).json({ msg: error.message })
           }  */
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        // req.task.completedBy = req.user.id para saber quien cambio el status de la tarea
        try {

            const { status } = req.body
            req.task.status = status
            const data = {
                user: req.user.id,
                status
            }
            /*  if (status === 'pending') {
                 req.task.completedBy = null
             } else {
                 req.task.completedBy = req.user.id
             } */
            req.task.completedBy.push(data)//user y status vienen del modelo de tarea
            await req.task.save()
            res.send('Tarea Actualizada')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
}
