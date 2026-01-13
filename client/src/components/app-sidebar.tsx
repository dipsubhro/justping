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
import { Link, useNavigate } from "react-router-dom"
import { authClient } from "@/lib/auth-client"

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
    { title: "Dashboard", url: "/navigate", icon: Home },
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
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
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
