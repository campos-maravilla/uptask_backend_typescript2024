import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import projectRoutes from './routes/projectRoutes'
import cors from 'cors'
import { corsConfig } from './config/cors'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes'

dotenv.config()

connectDB()

const app=express()

//app.use(cors(corsConfig))

// Logging 
app.use(morgan('dev'))

app.use(express.json())//para poder leer datos del formulario

app.use('/api/projects',projectRoutes)
app.use('/api/auth',authRoutes)

export default app 