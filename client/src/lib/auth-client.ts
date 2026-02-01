import { createAuthClient } from "better-auth/react"
import { magicLinkClient, twoFactorClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:8787",
    fetchOptions: {
        credentials: "include"
    },
    plugins: [
        magicLinkClient(),
        twoFactorClient()
    ]
})

