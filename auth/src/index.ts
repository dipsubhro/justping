// src/index.ts
import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'

const app = express()
const port = Number(process.env.PORT) || 8787

// CORS must come BEFORE body parser
app.use(cors({
    origin: process.env.TRUSTED_ORIGINS?.split(',') || [
        'http://localhost:5173',
        'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())

app.get('/health', (req, res) => {
    console.log('Health check requested');
    res.send('Auth service is healthy')
})

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.headers.origin}`);
    console.log('Headers:', JSON.stringify(req.headers));
    next();
});

app.all('/api/auth/*path', toNodeHandler(auth));

app.listen(port, () => {
    console.log(`Auth server running → http://localhost:${port}`)
    console.log('Health check →   http://localhost:' + port + '/health')
})