import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useDemo } from "@/context/DemoContext"
import { Button } from "@/components/ui/button"

export default function Navigate() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isDemoMode, resetDemo } = useDemo();
    
    const getPageTitle = (pathname: string) => {
        switch (pathname) {
            case '/navigate':
            case '/navigate/':
                return 'Dashboard';
            case '/navigate/monitors':
                return 'Monitors';
            case '/navigate/pinning':
                return 'Create Monitor';
            case '/navigate/billing':
                return 'Pricing';
            case '/navigate/alerts':
                return 'Alerts';
            case '/navigate/analytics':
                return 'Analytics';
            case '/navigate/integrations':
                return 'Integrations';
            default:
                return 'Dashboard';
        }
    };

    return (
        <SidebarProvider className="h-screen w-screen overflow-hidden">
            <AppSidebar />
            <SidebarInset className="flex flex-col flex-1 h-full overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="h-4 w-px bg-border mx-2" />
                    <nav className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">{getPageTitle(location.pathname)}</span>
                    </nav>
                </header>
                <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
                    <Outlet />
                </div>
            </SidebarInset>

            {isDemoMode && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button 
                        variant="destructive" 
                        className="shadow-lg rounded-full px-6 animate-in fade-in slide-in-from-bottom-4"
                        onClick={() => { resetDemo(); navigate('/'); }}
                    >
                        Exit Demo Mode
                    </Button>
                </div>
            )}
        </SidebarProvider>
    );
}
