import type { Request, Response } from "express"
import User from "../models/User"
import Project from "../models/Project"

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body

        // Find User
        const user = await User.findOne({ email }).select('id email name')
        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ error: error.message })
        }

        res.json(user)
    }

    // para agregar un miembro o colaborador
    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body

        const user = await User.findById(id).select('id')
        if (!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({ error: error.message })
        }
        //si en el proyecto que estamos incluye(some)
        if (req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('El usuario ya existe en el proyecto')
            return res.status(404).json({ error: error.message })
        }
        //agregar el usuario al proyecto
        req.project.team.push(user.id)
        await req.project.save()

        res.send('Usuario agregado correctamente')
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params

        //si en el proyecto que estamos incluye(some)
        if (!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error('El usuario no existe en el proyecto')
            return res.status(404).json({ error: error.message })
        }
        //para eliminarlo del proyecto
        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId)

        await req.project.save()

        res.send('Usuario eliminado correctamente')
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate({
            path: 'team',
            select: 'id email name'
        })
        res.json(project.team)
    }
}