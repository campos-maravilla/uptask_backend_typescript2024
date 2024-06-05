import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User, { IUser } from "../models/User"

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

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
            const user = await User.findById(decoded.id).select('_id name email')
            // console.log(user)
            if (user) {
                req.user = user
            } else {
                res.status(500).json({ error: 'Token no vàlido' })
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Token no vàlido' })
    }

    next()
} 