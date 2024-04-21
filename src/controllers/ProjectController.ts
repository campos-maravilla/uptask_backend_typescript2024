import type { Request,Response } from "express"
import Project from "../models/Project"

export class ProjectController{
    
    static createProjects=async(req:Request,res:Response)=>{
        const project=new Project(req.body)
        try {
           // await Project.create(req.body)
            await project.save()
            res.send('Proyecto Creado Correctamente')
        } catch (error) {
            console.log(error)
        }
    }
    static getAllProjects=async(req:Request,res:Response)=>{
       try {
        const projects=await Project.find({})
        res.json(projects)
       } catch (error) {
        console.log(error)
       }
    }
}