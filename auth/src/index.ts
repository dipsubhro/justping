// src/index.ts
import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'

const app = express()
const port = Number(process.env.PORT) || 8787

app.use(cors({
    origin: process.env.TRUSTED_ORIGINS?.split(',') || [
        'http://localhost:5173',
        'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))


app.all('/api/auth/*path', toNodeHandler(auth))

app.use(express.json())

app.get('/health', (req, res) => {
    res.send('Auth service is healthy')
})

app.listen(port, () => {
    console.log(`Auth server running → http://localhost:${port}`)
    console.log('Health check →   http://localhost:' + port + '/health')
})