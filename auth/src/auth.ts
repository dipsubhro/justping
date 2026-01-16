import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { magicLink, twoFactor } from 'better-auth/plugins'
import { client } from './db.js'

export const auth = betterAuth({
    database: mongodbAdapter(client.db()),

    secret: process.env.BETTER_AUTH_SECRET!,

    baseURL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 8787}`,
    
    emailAndPassword: {
        enabled: true,
        // requireEmailVerification: true, // optional
    },

    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },

    plugins: [
        twoFactor({
            otpOptions: {
                async sendOTP({ user, otp }, request) {
                    console.log(`Sending OTP ${otp} to ${user.email}`);
                }
            }
        }),
        magicLink({
            sendMagicLink: async ({ email, token, url }, request) => {
                console.log(`Sending magic link to ${email}: ${url}`);
            }
        }),
    ],

    trustedOrigins: process.env.TRUSTED_ORIGINS
        ? process.env.TRUSTED_ORIGINS.split(',')
        : ['http://localhost:5173', 'http://localhost:3000'],
})