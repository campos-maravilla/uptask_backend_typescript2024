
import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"




export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body

            // Prevenir duplicados 
            const userExists = await User.findOne({ email })
            if (userExists) {
                const error = new Error('El Usuario ya esta registrado')
                return res.status(409).json({ error: error.message })
            }

            const user = new User(req.body)

            // Hash Password 
            // const salt = await bcrypt.genSalt(10)
            // user.password = await bcrypt.hash(password, salt)
            user.password = await hashPassword(password)

            // Generar el token 
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // Enviar el email 
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta creada,revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    //para validar el token
    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no vàlido')
                return res.status(404).json({ error: error.message })
            }
            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })

            if (!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error: error.message })
            }
            if (!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                //enviar email 
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('La cuenta no ha sido confirmada,hemos enviado un e-mail de confirmacíon')
                return res.status(401).json({ error: error.message })
            }
            //revisar si es correcto el pass
            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) {
                const error = new Error('Password Incorrecto')
                return res.status(401).json({ error: error.message })
            }
            res.send('Autenticado...')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    //para pedir un nuevo token-si ya expiro 
    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Usuario existe 
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('El Usuario no esta registrado')
                return res.status(404).json({ error: error.message })
            }

            if (user.confirmed) {
                const error = new Error('El Usuario ya esta confirmado')
                return res.status(403).json({ error: error.message })
            }

            // Generar el token 
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // Enviar el email 
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Se envió un nuevo token a tu e-mail')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
    //endpoint para reestablecer password
    static forgotPasword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Usuario existe 
            const user = await User.findOne({ email })
            if (!user) {
                const error = new Error('El Usuario no esta registrado')
                return res.status(404).json({ error: error.message })
            }

            // Generar el token 
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            // Enviar el email 
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Revisa tu e-mail,para instrucciones')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    //validando-token-para-reestablecer contraseña
    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error('Token no vàlido')
                return res.status(404).json({ error: error.message })
            }

            res.send('Token vàlido,Define tu nuevo password')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
}

