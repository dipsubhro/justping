import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, Activity, Eye, Bell, Clock } from "lucide-react";

const changesData = [
    { month: "Jan", changes: 12 },
    { month: "Feb", changes: 19 },
    { month: "Mar", changes: 8 },
    { month: "Apr", changes: 24 },
    { month: "May", changes: 16 },
    { month: "Jun", changes: 31 },
];

const alertsData = [
    { day: "Mon", alerts: 4 },
    { day: "Tue", alerts: 7 },
    { day: "Wed", alerts: 3 },
    { day: "Thu", alerts: 9 },
    { day: "Fri", alerts: 5 },
    { day: "Sat", alerts: 2 },
    { day: "Sun", alerts: 1 },
];

const chartConfig = {
    changes: {
        label: "Changes",
        color: "var(--chart-1)",
    },
    alerts: {
        label: "Alerts",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export default function Analytics() {
    return (
        <div className="h-full flex flex-col p-4 md:p-6 max-w-6xl mx-auto w-full space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                <p className="text-muted-foreground mt-1">
                    Monitor trends and insights across your watches.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Monitors</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-500">+2</span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Changes Detected</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">110</div>
                        <div className="flex items-center text-xs text-green-500">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +12% from last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alerts Sent</CardTitle>
                        <Bell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">31</div>
                        <div className="flex items-center text-xs text-red-500">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            -5% from last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.2s</div>
                        <p className="text-xs text-muted-foreground">
                            Across all monitors
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Changes Over Time</CardTitle>
                        <CardDescription>Number of detected changes per month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <BarChart data={changesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="changes" fill="var(--chart-1)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Alerts</CardTitle>
                        <CardDescription>Alerts triggered this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <LineChart data={alertsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line 
                                    type="monotone" 
                                    dataKey="alerts" 
                                    stroke="var(--chart-2)" 
                                    strokeWidth={2}
                                    dot={{ fill: "var(--chart-2)" }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
