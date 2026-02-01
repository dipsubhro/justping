import { useState } from "react"
import { User, LogOut, Mail, AtSign } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useNavigate } from "react-router-dom"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserData {
    id: string
    name: string
    email: string
    image?: string | null
}

// Helper to get initials from name
function getInitials(name: string): string {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
}

// Helper to generate a gradient based on name
function getGradientFromName(name: string): string {
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const hue1 = hash % 360
    const hue2 = (hash * 7) % 360
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 40%))`
}

export function ProfileButton() {
    // Use the reactive session hook instead of manual fetching
    const { data: session, isPending } = authClient.useSession()
    const user = session?.user as UserData | undefined
    
    const [signInOpen, setSignInOpen] = useState(false)
    const [signInLoading, setSignInLoading] = useState(false)
    const [signInError, setSignInError] = useState<string | null>(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await authClient.signOut()
        navigate("/")
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setSignInLoading(true)
        setSignInError(null)

        await authClient.signIn.email(
            { email, password },
            {
                onSuccess: () => {
                    setSignInLoading(false)
                    setSignInOpen(false)
                    // Session will be updated reactively via useSession hook
                    setEmail("")
                    setPassword("")
                },
                onError: (ctx) => {
                    setSignInLoading(false)
                    setSignInError(ctx.error.message)
                },
            }
        )
    }

    const handleGoogleSignIn = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: window.location.pathname,
        })
    }

    // Render avatar content (image or initials)
    const renderAvatar = () => {
        if (user?.image) {
            return (
                <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    className="w-full h-full object-cover"
                />
            )
        }
        
        if (user?.name) {
            return (
                <div
                    className="w-full h-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ background: getGradientFromName(user.name) }}
                >
                    {getInitials(user.name)}
                </div>
            )
        }

        // Default placeholder avatar
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700 text-white">
                <User className="w-4 h-4" />
            </div>
        )
    }

    if (isPending) {
        return (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
        )
    }

    // User is not signed in
    if (!user) {
        return (
            <>
                <button
                    onClick={() => setSignInOpen(true)}
                    className="group relative h-9 w-9 rounded-full overflow-hidden border-2 border-border hover:border-primary/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Sign In"
                >
                    {renderAvatar()}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                </button>

                {/* Sign In Modal */}
                <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">Welcome back</DialogTitle>
                            <DialogDescription>
                                Sign in to access your account and monitors
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="signin-email">Email</Label>
                                <Input
                                    id="signin-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signin-password">Password</Label>
                                <Input
                                    id="signin-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {signInError && (
                                <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                                    {signInError}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={signInLoading}
                            >
                                {signInLoading ? "Signing in..." : "Sign In"}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleGoogleSignIn}
                            >
                                <svg
                                    className="mr-2 h-4 w-4"
                                    aria-hidden="true"
                                    focusable="false"
                                    viewBox="0 0 488 512"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                                    />
                                </svg>
                                Sign in with Google
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    className="text-primary hover:underline underline-offset-4 font-medium"
                                    onClick={() => {
                                        setSignInOpen(false)
                                        navigate("/signup")
                                    }}
                                >
                                    Sign up
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </>
        )
    }

    // User is signed in - show dropdown
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="group relative h-9 w-9 rounded-full overflow-hidden border-2 border-border hover:border-primary/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="User Menu"
                >
                    {renderAvatar()}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-72 p-0">
                {/* User info header */}
                <div className="p-4 border-b border-border bg-gradient-to-br from-muted/50 to-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-border shadow-md">
                            {renderAvatar()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">
                                {user.name || "User"}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account details */}
                <div className="p-2">
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wide px-2 py-1">
                        Account Details
                    </DropdownMenuLabel>
                    
                    <div className="space-y-1 mt-1">
                        <div className="flex items-center gap-3 px-2 py-2 rounded-md text-sm">
                            <AtSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">Username</p>
                                <p className="font-medium truncate">{user.name || "Not set"}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 px-2 py-2 rounded-md text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="font-medium truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <DropdownMenuSeparator />

                <div className="p-2">
                    <DropdownMenuItem
                        onClick={handleSignOut}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
