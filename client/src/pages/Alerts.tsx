import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

type AlertType = "info" | "warning" | "error" | "success";

interface AlertMessage {
    id: string;
    type: AlertType;
    title: string;
    message: string;
    timestamp: string;
    source: string;
}

const dummyAlerts: AlertMessage[] = [
    {
        id: "1",
        type: "error",
        title: "Connection Failed",
        message: "Failed to connect to monitoring node us-east-1. Retrying in 30s.",
        timestamp: "Just now",
        source: "System"
    },
    {
        id: "2",
        type: "warning",
        title: "High Latency Warning",
        message: "Observed latency > 300ms on endpoint /api/v1/status.",
        timestamp: "2 mins ago",
        source: "Monitor #42"
    },
    {
        id: "3",
        type: "success",
        title: "Backup Completed",
        message: "Daily database notification snapshot created successfully.",
        timestamp: "1 hour ago",
        source: "Backup Job"
    },
    {
        id: "4",
        type: "info",
        title: "Maintenance Scheduled",
        message: "System maintenance scheduled for Sunday at 02:00 UTC.",
        timestamp: "3 hours ago",
        source: "Admin"
    },
    {
        id: "5",
        type: "info",
        title: "New Integration Added",
        message: "Slack integration was successfully authorized by user.",
        timestamp: "5 hours ago",
        source: "Integrations"
    },
    {
        id: "6",
        type: "warning",
        title: "Rate Limit Approaching",
        message: "API usage is at 85% of daily quota.",
        timestamp: "Yesterday",
        source: "Rate Limiter"
    }
];

const getIcon = (type: AlertType) => {
    switch (type) {
        case "error": return <AlertCircle className="h-5 w-5 text-red-500" />;
        case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        case "success": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        case "info": return <Info className="h-5 w-5 text-blue-500" />;
    }
};

const getBadgeVariant = (type: AlertType) => {
    switch (type) {
        case "error": return "destructive";
        case "warning": return "secondary"; // Using secondary for warning as a fallback or could customize
        case "success": return "default"; // Green if themed, or use default
        case "info": return "secondary";
        default: return "default";
    }
};

const getBadgeColorClass = (type: AlertType) => {
    switch (type) {
        case "warning": return "bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-yellow-500/20";
        case "success": return "bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20";
        case "info": return "bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-blue-500/20";
        default: return "";
    }
}

export default function Alerts() {
    return (
        <div className="h-full flex flex-col p-4 md:p-6 max-w-5xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
                    <p className="text-muted-foreground mt-1">
                        System notifications and monitoring events stack.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-secondary/50 transition-colors">
                        All
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-secondary/50 transition-colors opacity-50">
                        Unread
                    </Badge>
                </div>
            </div>

            <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="space-y-4 pb-8">
                    {dummyAlerts.map((alert) => (
                        <Card key={alert.id} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-secondary/10 transition-colors border-l-4"
                            style={{
                                borderLeftColor:
                                    alert.type === 'error' ? 'var(--destructive)' :
                                        alert.type === 'warning' ? '#eab308' :
                                            alert.type === 'success' ? '#22c55e' :
                                                '#3b82f6'
                            }}>
                            <div className="shrink-0 mt-1 sm:mt-0">
                                {getIcon(alert.type)}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-base">{alert.title}</h3>
                                    <Badge variant={getBadgeVariant(alert.type) as any} className={getBadgeColorClass(alert.type)}>
                                        {alert.type}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {alert.message}
                                </p>
                                <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground/70">
                                    <span className="flex items-center gap-1">
                                        Source: <span className="font-medium text-foreground/80">{alert.source}</span>
                                    </span>
                                    <span>•</span>
                                    <span>{alert.timestamp}</span>
                                </div>
                            </div>
                        </Card>
                    ))}

                    <div className="text-center py-8 text-muted-foreground text-sm">
                        End of notifications
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
