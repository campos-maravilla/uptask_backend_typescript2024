
import type { Request,Response } from "express";

import Task from "../models/Task";

export class TaskController{
    static createTask=async(req:Request,res:Response)=>{
        
        try {
            const task=new Task(req.body) 
            //task.proyect=>viene de task project.id es la instancia de project const project=await Project.findById(projectId))
            //req=>viene de middleware/project.ts
            task.project=req.project.id
            req.project.tasks.push(task.id)//agregando la tarea al proyecto
            await task.save()
            await req.project.save()
            res.send('Tarea creada correctamente')
        } catch (error) {
            console.log(error)
        }
    }
}