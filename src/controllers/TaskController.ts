
import type { Request,Response } from "express";

export class TaskController{
    static createProject=async(req:Request,res:Response)=>{
        //proyectId=>viene de proyectRoutes(router.post('/:projectId/tasks'))
        const {projectId}=req.params
        console.log(projectId)
        try {
            
        } catch (error) {
            console.log(error)
        }
    }
}