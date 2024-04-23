
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
            
         await   Promise.allSettled([task.save(),req.project.save()])
            res.send('Tarea creada correctamente')
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }
    }
    
    static getProjectTasks=async(req:Request,res:Response)=>{
        try {
            //populate('project')=>trae todo lo de project
            const tasks=await Task.find({project:req.project.id}).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }
    }
    
    static getTaskById=async(req:Request,res:Response)=>{
        try {
            const {taskId}=req.params
            const task=await Task.findById(taskId)
           /*  if(!task){
                return res.status(404).json({
                  error:'Proyecto No Encontrado'
                })
              } */
             // console.log(task.project.toString())
             // console.log(req.project.id)
             if(task.project.toString() !== req.project.id){
                const error=new Error('Acción no válida')
                return res.status(400).json({error:error.message})
            } 
            res.json({task})
        } catch (error) {
             if (error.kind === 'ObjectId') {
                const error = new Error('Tarea no Encontrada')
                return res.status(404).json({ msg: error.message })
            } 
           // res.status(500).json({error:'Hubo un error'})
        }
    }
}
