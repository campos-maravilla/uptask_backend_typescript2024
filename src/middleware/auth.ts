import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

// para protejer las rutas(proyectos y tareas)
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if (!bearer) {
        const error = new Error('No Authorizado')
        return res.status(401).json({ error: error.message })
    }
    // const [, token]= bearer.split(' ')
    const token = bearer.split(' ')[1]
    //console.log(bearer)
    // console.log(token)
    try {
        //que el token sea valido,y que no haya expirado 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id)
            console.log(user)
        }
    } catch (error) {
        res.status(500).json({ error: 'Token no vàlido' })
    }

    next()
} 