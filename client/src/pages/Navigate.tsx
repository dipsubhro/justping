
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navigate() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="h-4 w-px bg-border mx-2" />
                    <nav className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">Dashboard</span>
                    </nav>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="outline" size="sm">Feedback</Button>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {/* Stats Row */}
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Total Monitors</CardTitle>
                                <Badge variant="outline">Active</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground">+2 from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Incidents</CardTitle>
                                <Badge variant="destructive">Critical</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1</div>
                                <p className="text-xs text-muted-foreground">Last 24 hours</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                                <Badge variant="secondary">All Systems</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">99.9%</div>
                                <p className="text-xs text-muted-foreground">+0.1% from last week</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest checks from your monitors.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-red-500' : 'bg-green-500'}`} />
                                                <div>
                                                    <p className="text-sm font-medium leading-none">api.justping.com</p>
                                                    <p className="text-xs text-muted-foreground">Latency: {20 + i * 5}ms</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">Just now</span>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>Pause Monitor</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>System Status</CardTitle>
                                <CardDescription>Operational status of regions.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">North America</span>
                                        <Badge variant="outline" className="text-green-500 border-green-500">Operational</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Europe</span>
                                        <Badge variant="outline" className="text-green-500 border-green-500">Operational</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Asia Pacific</span>
                                        <Badge variant="outline" className="text-yellow-500 border-yellow-500">Degraded</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
