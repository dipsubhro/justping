
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Link, useLocation, Outlet } from "react-router-dom"

export default function Navigate() {
    const location = useLocation();
    
    return (
        <SidebarProvider className="h-screen w-screen overflow-hidden">
            <AppSidebar />
            <SidebarInset className="flex flex-col flex-1 h-full overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="h-4 w-px bg-border mx-2" />
                    <nav className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">Dashboard</span>
                    </nav>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="outline" size="sm">Feedback</Button>
                        <Button variant="default" size="sm" asChild>
                            <Link to="/login" state={{ backgroundLocation: location }}>
                                Login
                            </Link>
                        </Button>
                    </div>
                </header>
                <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
