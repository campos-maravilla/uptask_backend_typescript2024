import type { Request, Response } from "express"
import Project from "../models/Project"

export class ProjectController {

  static createProjects = async (req: Request, res: Response) => {
    const project = new Project(req.body)

    // Asigna un manager 
    project.manager = req.user.id
    // console.log(req.user)

    try {
      // await Project.create(req.body)
      await project.save()
      res.send('Proyecto Creado Correctamente')
    } catch (error) {
      console.log(error)
    }
  }

  static getAllProjects = async (req: Request, res: Response) => {

    try {
      const projects = await Project.find({
        $or: [
          { manager: { $in: req.user.id } },
          //si eres parte del equipo ,puedes ver los proyectos
          { team: { $in: req.user.id } }
        ]
      })
      res.json(projects)
    } catch (error) {
      console.log(error)
    }
  }

  static geProjectById = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const project = await Project.findById(id).populate('tasks')

      if (!project) {
        return res.status(404).json({
          error: 'Proyecto No Encontrado'
        })
      }
      //&& !project.team.includes(req.user.id)=para que el colaborador pueda ver el proyecto
      if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
        return res.status(404).json({
          error: 'Accion no vàlida'
        })
      }
      res.json(project)
    } catch (error) {
      console.log(error)
    }
  }

  static updateProject = async (req: Request, res: Response) => {


    try {

      req.project.projectName = req.body.projectName
      req.project.clientName = req.body.clientName
      req.project.description = req.body.description
      await req.project.save()
      res.send('Proyecto Actualizado')
    } catch (error) {
      console.log(error)
    }
  }

  static deleteProject = async (req: Request, res: Response) => {


    try {


      await req.project.deleteOne()
      res.send('Proyecto Eliminado')
    } catch (error) {
      console.log(error)

    }
  }
}