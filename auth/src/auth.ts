// src/auth.ts
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { client } from './db.js'

export const auth = betterAuth({
    database: mongodbAdapter(client.db()),

    secret: process.env.BETTER_AUTH_SECRET!,

    baseURL: `http://localhost:${process.env.PORT || 8787}`,
    
    emailAndPassword: {
        enabled: true,
        // autoSignIn: true,           // optional: sign in automatically after signup
        // requireEmailVerification: true, // optional
    },
    trustedOrigins: process.env.TRUSTED_ORIGINS
        ? process.env.TRUSTED_ORIGINS.split(',')
        : ['http://localhost:5173', 'http://localhost:3000'],

    // You can add these later (very easy to enable)
    // socialProviders: {
    //     google: { enabled: true, /* clientId, clientSecret */ },
    //     github: { enabled: true, /* ... */ },
    // },

    // plugins: [
    //     twoFactor(),
    //     magicLink(),
    //     organization(),
    //     passkey(),
    // ]
})