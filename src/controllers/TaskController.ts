
import type { Request,Response } from "express";
import Project from "../models/Project";
import Task from "../models/Task";

export class TaskController{
    static createTask=async(req:Request,res:Response)=>{
        //proyectId=>viene de proyectRoutes(router.post('/:projectId/tasks'))
        const {projectId}=req.params
        const project=await Project.findById(projectId)
        if(!project){
            return res.status(404).json({
              error:'Proyecto No Encontrado'
            })
          }
        try {
            const task=new Task(req.body) 
            //task.proyect=>viene de task project.id es la instancia de project const project=await Project.findById(projectId))
            task.project=project.id
            project.tasks.push(task.id)//agregando la tarea al proyecto
            await task.save()
            await project.save()
            res.send('Tarea creada correctamente')
        } catch (error) {
            console.log(error)
        }
    }
}