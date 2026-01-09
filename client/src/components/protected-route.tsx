import { authClient } from "@/lib/auth-client";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const { data: session, isPending, error } = authClient.useSession();

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (error || !session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
