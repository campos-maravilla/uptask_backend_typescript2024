
import type { NextFunction, Request,Response } from "express";
import Project, { IProject } from "../models/Project";

//esto es de typescript 
declare global {
    namespace Express {
        interface Request {
            project:IProject
        }
    }
}

export async function validateProjectExists(req:Request,res:Response,next:NextFunction){
    
    try {
        //proyectId=>viene de proyectRoutes(router.post('/:projectId/tasks'))
        const {projectId}=req.params
        const project=await Project.findById(projectId)
        if(!project){
            return res.status(404).json({
              error:'Proyecto No Encontrado'
            })
          }
          //ya esta pasando el proyecto en el request('/:projectId/tasks')
          req.project=project
          next()
    } catch (error) {
        res.status(500).json({error:'Hubo un error'})
    }
    
}