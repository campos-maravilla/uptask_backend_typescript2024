import { Request, Response, NextFunction } from "express"

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
    console.log(token)

    next()
} 