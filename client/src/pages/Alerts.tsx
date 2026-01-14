import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Bell, CheckCircle2, Loader2 } from "lucide-react";
import { fetchAlerts, markAlertsAsChecked, type Alert } from "@/api/alerts";
import { useDemo } from "@/context/DemoContext";

export default function Alerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isDemoMode, demoAlerts } = useDemo();

    useEffect(() => {
        const loadAlerts = async () => {
            try {
                setLoading(true);
                
                if (isDemoMode) {
                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 600));
                    setAlerts(demoAlerts);
                    setLoading(false);
                    return;
                }

                // Fetch alerts
                const data = await fetchAlerts();
                setAlerts(data);
                
                // Mark as checked when page opens (fire and forget)
                if (data.some(a => !a.checked)) {
                    markAlertsAsChecked().catch(console.error);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load alerts");
            } finally {
                setLoading(false);
            }
        };

        loadAlerts();
    }, [isDemoMode]);

    // Format relative time
    const formatRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    // Get alert title from payload
    const getAlertTitle = (alert: Alert) => {
        const payload = alert.payload;
        if (payload.watch_title) return String(payload.watch_title);
        if (payload.watch_url) return `Change on ${String(payload.watch_url)}`;
        return alert.monitorName || "Monitor Alert";
    };

    // Get alert message from payload
    const getAlertMessage = (alert: Alert) => {
        const payload = alert.payload;
        if (payload.diff) return `Content changed: ${String(payload.diff).slice(0, 150)}...`;
        if (payload.current_snapshot) {
            const snapshot = String(payload.current_snapshot);
            return snapshot.length > 150 ? `${snapshot.slice(0, 150)}...` : snapshot;
        }
        return "A change was detected on the monitored page.";
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4 p-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-muted-foreground">{error}</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-4 md:p-6 max-w-5xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
                    <p className="text-muted-foreground mt-1">
                        Notifications from your monitored pages.
                    </p>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                    {alerts.length} total
                </Badge>
            </div>

            {alerts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="rounded-full bg-muted p-4">
                        <Bell className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">No alerts yet</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                            When a monitored page changes, you'll see alerts here.
                        </p>
                    </div>
                </div>
            ) : (
                <ScrollArea className="flex-1 -mx-4 px-4">
                    <div className="space-y-4 pb-8">
                        {alerts.map((alert) => (
                            <Card 
                                key={alert._id} 
                                className={`p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-secondary/10 transition-colors border-l-4 ${
                                    alert.checked ? 'opacity-70' : ''
                                }`}
                                style={{ borderLeftColor: '#3b82f6' }}
                            >
                                <div className="shrink-0 mt-1 sm:mt-0">
                                    {alert.checked ? (
                                        <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <Bell className="h-5 w-5 text-blue-500" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-base">{getAlertTitle(alert)}</h3>
                                        {!alert.checked && (
                                            <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/20">
                                                New
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {getAlertMessage(alert)}
                                    </p>
                                    <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground/70">
                                        {alert.monitorName && (
                                            <>
                                                <span className="flex items-center gap-1">
                                                    Monitor: <span className="font-medium text-foreground/80">{alert.monitorName}</span>
                                                </span>
                                                <span>•</span>
                                            </>
                                        )}
                                        <span>{formatRelativeTime(alert.receivedAt)}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        <div className="text-center py-8 text-muted-foreground text-sm">
                            End of notifications
                        </div>
                    </div>
                </ScrollArea>
            )}
        </div>
    );
}
