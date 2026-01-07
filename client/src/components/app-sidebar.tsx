
import {
    Home,
    Monitor,
    Pin,
    History,
    BarChart,
    Bell,
    Settings,
    Plug,
    User,
    CreditCard,
    HelpCircle,
    LogOut
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"

// Menu items grouped structure
const mainItems = [
    { title: "Dashboard", url: "/navigate", icon: Home },
    { title: "Monitors", url: "#", icon: Monitor },
    { title: "Add Monitor (Pin)", url: "/navigate/pinning", icon: Pin },
    { title: "Change History", url: "#", icon: History },
    { title: "Analytics", url: "#", icon: BarChart },
    { title: "Alerts", url: "#", icon: Bell },
]

const configItems = [
    { title: "Settings", url: "#", icon: Settings },
    { title: "Integrations", url: "#", icon: Plug },
]

const userItems = [
    { title: "Profile", url: "#", icon: User },
    { title: "Billing", url: "#", icon: CreditCard },
    { title: "Help", url: "#", icon: HelpCircle },
    { title: "Logout", url: "#", icon: LogOut },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                {/* Main Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>DeepPing</SidebarGroupLabel>
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

                <SidebarSeparator />

                {/* Configuration Group */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {configItems.map((item) => (
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

                <SidebarSeparator />

                {/* User Group */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {userItems.map((item) => (
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
        </Sidebar>
    )
}
