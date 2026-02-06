import { useEffect, useState } from "react"
import {
    Home,
    Monitor,
    Pin,
    BarChart,
    Bell,
    Plug,
    CreditCard,
    LogOut
} from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { authClient } from "@/lib/auth-client"
import { fetchAlerts, type Alert } from "@/api/alerts"
import { useDemo } from "@/context/DemoContext"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items grouped structure
const mainItems = [
    { title: "Dashboard", url: "/navigate/dashboard", icon: Home },
    { title: "Monitors", url: "/navigate/monitors", icon: Monitor },
    { title: "Create Monitor", url: "/navigate/pinning", icon: Pin },
    { title: "Analytics", url: "/navigate/analytics", icon: BarChart },
    { title: "Alerts", url: "/navigate/alerts", icon: Bell },
    { title: "Integrations", url: "/navigate/integrations", icon: Plug },
]

const footerItems = [
    { title: "Pricing", url: "/navigate/billing", icon: CreditCard },
    { title: "Sign Out", url: "#", icon: LogOut },
]

export function AppSidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname

    const { isDemoMode, demoAlerts } = useDemo()
    const [hasUnreadAlerts, setHasUnreadAlerts] = useState(false)

    useEffect(() => {
        const checkAlerts = async () => {
            try {
                let currentAlerts: Alert[] = [];
                if (isDemoMode) {
                    currentAlerts = demoAlerts;
                } else {
                    currentAlerts = await fetchAlerts();
                }
                setHasUnreadAlerts(currentAlerts.some((a: Alert) => !a.checked));
            } catch (err) {
                console.error("Failed to fetch alerts for sidebar indicator", err);
            }
        };

        checkAlerts();
    }, [isDemoMode, demoAlerts, pathname]);

    const handleSignOut = async () => {
        await authClient.signOut()
        navigate('/')
    }

    return (
        <Sidebar>
            <SidebarContent>
                {/* Logo Section */}
                <Link to="/" className="block p-4 mb-2 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-2 px-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <span className="text-lg font-bold">JustPing</span>
                    </div>
                </Link>

                <SidebarGroup>
                    <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton 
                                        asChild 
                                        isActive={pathname === item.url || (item.url === "/navigate" && pathname === "/navigate/dashboard")}
                                    >
                                        <Link to={item.url}>
                                            <div className="relative flex items-center justify-center">
                                                <item.icon />
                                                {item.title === "Alerts" && hasUnreadAlerts && (
                                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                    </span>
                                                )}
                                            </div>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    {footerItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            {item.title === "Sign Out" ? (
                                <SidebarMenuButton
                                    onClick={handleSignOut}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                    <item.icon />
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            ) : (
                                <SidebarMenuButton asChild>
                                    <Link to={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
