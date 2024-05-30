
import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
    // Hash Password 
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}
//enteredPassword este es el que introduce el usuario 
//storeHash=este es el que esta almacenado en la bd
export const checkPassword = async (enteredPassword: string, storeHash: string) => {
    return await bcrypt.compare(enteredPassword, storeHash)
}