import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: string;
    connected: boolean;
    category: "notifications" | "automation" | "storage";
}

const integrations: Integration[] = [
    {
        id: "slack",
        name: "Slack",
        description: "Get instant alerts in your Slack channels",
        icon: "💬",
        connected: true,
        category: "notifications",
    },
    {
        id: "discord",
        name: "Discord",
        description: "Send notifications to Discord servers",
        icon: "🎮",
        connected: false,
        category: "notifications",
    },
    {
        id: "email",
        name: "Email",
        description: "Receive alerts via email",
        icon: "📧",
        connected: true,
        category: "notifications",
    },
    {
        id: "telegram",
        name: "Telegram",
        description: "Get notified through Telegram bot",
        icon: "✈️",
        connected: false,
        category: "notifications",
    },
    {
        id: "webhook",
        name: "Webhooks",
        description: "Send data to any HTTP endpoint",
        icon: "🔗",
        connected: true,
        category: "automation",
    },
    {
        id: "zapier",
        name: "Zapier",
        description: "Connect to 5000+ apps via Zapier",
        icon: "⚡",
        connected: false,
        category: "automation",
    },
    {
        id: "google-sheets",
        name: "Google Sheets",
        description: "Log changes to a spreadsheet",
        icon: "📊",
        connected: false,
        category: "storage",
    },
    {
        id: "notion",
        name: "Notion",
        description: "Save changes to Notion databases",
        icon: "📝",
        connected: false,
        category: "storage",
    },
];

export default function Integrations() {
    const [connectedStates, setConnectedStates] = useState<Record<string, boolean>>(
        Object.fromEntries(integrations.map(i => [i.id, i.connected]))
    );

    const toggleConnection = (id: string) => {
        setConnectedStates(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const categories = [
        { key: "notifications", label: "Notifications" },
        { key: "automation", label: "Automation" },
        { key: "storage", label: "Storage" },
    ] as const;

    return (
        <div className="h-full flex flex-col p-4 md:p-6 max-w-5xl mx-auto w-full space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
                <p className="text-muted-foreground mt-1">
                    Connect JustPing with your favorite tools.
                </p>
            </div>

            {categories.map(category => (
                <div key={category.key} className="space-y-4">
                    <h3 className="text-lg font-semibold capitalize">{category.label}</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {integrations
                            .filter(i => i.category === category.key)
                            .map(integration => (
                                <Card key={integration.id} className="hover:bg-secondary/10 transition-colors">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{integration.icon}</span>
                                                <div>
                                                    <CardTitle className="text-base flex items-center gap-2">
                                                        {integration.name}
                                                        {connectedStates[integration.id] && (
                                                            <Badge variant="secondary" className="text-xs">Connected</Badge>
                                                        )}
                                                    </CardTitle>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={connectedStates[integration.id]}
                                                onCheckedChange={() => toggleConnection(integration.id)}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <CardDescription>{integration.description}</CardDescription>
                                        {connectedStates[integration.id] && (
                                            <Button variant="outline" size="sm" className="mt-3">
                                                Configure
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
