import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Clock, RefreshCw, ArrowRight, Plus, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { monitorApi, type Monitor } from "@/api/monitors"

export default function MonitorList() {
    const [monitors, setMonitors] = useState<Monitor[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadMonitors()
    }, [])

    const loadMonitors = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await monitorApi.getMonitors()
            setMonitors(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load monitors')
            console.error('Error loading monitors:', err)
        } finally {
            setLoading(false)
        }
    }

    // Helper function to format time ago
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    }

    // Helper to format frequency
    const formatFrequency = (frequency: { value: number; unit: string }) => {
        return `Every ${frequency.value} ${frequency.unit}`
    }

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Loading monitors...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                        <span className="text-2xl">❌</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Error Loading Monitors
                        </h2>
                        <p className="text-muted-foreground mt-2">{error}</p>
                    </div>
                    <Button onClick={loadMonitors}>
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

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
                        key={monitor._id}
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
                                    <span>{formatTimeAgo(monitor.lastChecked)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    <span>{formatFrequency(monitor.frequency)}</span>
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
                                    <Link to={`/navigate/monitors/${monitor._id}`}>
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
