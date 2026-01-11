import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Clock, RefreshCw, ArrowRight, Plus } from "lucide-react"

// Mock data - replace with actual API calls later
const mockMonitors = [
    {
        id: "1",
        websiteName: "Documentation Site",
        targetType: "Element - Product pricing table",
        status: "active" as const,
        lastChecked: "2 mins ago",
        frequency: "Every 5 minutes",
        hasChanged: true,
    },
    {
        id: "2",
        websiteName: "Competitor API",
        targetType: "API - /v1/products endpoint",
        status: "active" as const,
        lastChecked: "5 mins ago",
        frequency: "Every 10 minutes",
        hasChanged: false,
    },
    {
        id: "3",
        websiteName: "News Portal",
        targetType: "Full Page - Homepage",
        status: "paused" as const,
        lastChecked: "1 hour ago",
        frequency: "Every 30 minutes",
        hasChanged: false,
    },
    {
        id: "4",
        websiteName: "E-commerce Dashboard",
        targetType: "Element - Product inventory",
        status: "error" as const,
        lastChecked: "10 mins ago",
        frequency: "Every 15 minutes",
        hasChanged: true,
    },
]

export default function MonitorList() {
    const monitors = mockMonitors // Toggle to [] to see empty state

    // Empty state
    if (monitors.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            No monitors created yet
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Start monitoring changes on your favorite websites by creating your first monitor.
                        </p>
                    </div>
                    <Button asChild size="lg" className="mt-4">
                        <Link to="/navigate/pinning">
                            <Plus className="mr-2 h-4 w-4" />
                            Create your first monitor
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Monitor list view
    return (
        <div className="flex flex-1 flex-col gap-6 p-6 overflow-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Monitors</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and track all your website monitors
                    </p>
                </div>
                <Button asChild>
                    <Link to="/navigate/pinning">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Monitor
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {monitors.map((monitor) => (
                    <Card
                        key={monitor.id}
                        className="hover:shadow-md transition-shadow cursor-pointer group"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-lg leading-tight">
                                        {monitor.websiteName}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                        {monitor.targetType}
                                    </p>
                                </div>
                                {monitor.status === "active" && (
                                    <span className="flex-shrink-0 text-lg" title="Active">
                                        🟢
                                    </span>
                                )}
                                {monitor.status === "paused" && (
                                    <span className="flex-shrink-0 text-lg" title="Paused">
                                        ⏸
                                    </span>
                                )}
                                {monitor.status === "error" && (
                                    <span className="flex-shrink-0 text-lg" title="Error">
                                        🔴
                                    </span>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{monitor.lastChecked}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    <span>{monitor.frequency}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                {monitor.hasChanged ? (
                                    <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                                        🟡 Changed
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">No change</Badge>
                                )}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="group-hover:text-primary"
                                    asChild
                                >
                                    <Link to={`/navigate/monitors/${monitor.id}`}>
                                        View Details
                                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
