
import jwt from 'jsonwebtoken'

export const generateJWT = () => {
    const data = {
        name: 'juan',
        credit_card: '12345678901',
        password: 'password'
    }
    const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: '6m' //6m=6 meses
    })
    return token
}