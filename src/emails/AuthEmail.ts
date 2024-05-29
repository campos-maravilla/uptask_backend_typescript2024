import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirma cuenta',
            text: 'UpTask - Confirma cuenta',
            html: `<p>Hola : ${user.name}, has creado tu cuenta en UpTask,ya casi esta todo listo,solo debes confirma tu cuenta</p>
            <p>Visita el siguiente enlace:</p>
            <a href="">Confirmar cuenta</a>
            <p>E ingresa el còdigo: <b>${user.token}</b></p>
            <p>Este token expira en 10 minuto</p>
            `
        })
        console.log('Mensaje enviado', info.messageId)
    }
}