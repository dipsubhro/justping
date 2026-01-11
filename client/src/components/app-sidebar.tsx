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
    { title: "Analytics", url: "#", icon: BarChart },
    { title: "Alerts", url: "/navigate/alerts", icon: Bell },
    { title: "Integrations", url: "#", icon: Plug },
]

const footerItems = [
    { title: "Pricing", url: "/navigate/billing", icon: CreditCard },
    { title: "Sign Out", url: "#", icon: LogOut },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>JustPing</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
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
                            <SidebarMenuButton
                                asChild
                                className={item.title === "Sign Out" ? "text-red-500 hover:text-red-600 hover:bg-red-50" : ""}
                            >
                                <a href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
