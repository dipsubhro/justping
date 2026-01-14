import type { Monitor } from '@/api/monitors';
import type { Alert } from '@/api/alerts';

export const DEMO_USER = {
    id: "demo-user",
    name: "Demo User",
    email: "demo@justping.com",
    avatar: "https://github.com/shadcn.png"
};

const now = new Date();

export const DEMO_MONITORS: Monitor[] = [
    {
        _id: "demo_1",
        userId: "demo-user",
        websiteName: "Google Production",
        targetType: "URL Availability",
        url: "https://google.com",
        status: "active",
        lastChecked: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), // 2 mins ago
        frequency: { value: 5, unit: "minutes" },
        hasChanged: false,
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now.toISOString()
    },
    {
        _id: "demo_2",
        userId: "demo-user",
        websiteName: "Competitor Pricing",
        targetType: "Price Selector",
        url: "https://example.com/pricing",
        selector: ".price-tag",
        status: "active",
        lastChecked: new Date(now.getTime() - 45 * 60 * 1000).toISOString(), // 45 mins ago
        frequency: { value: 1, unit: "hours" },
        hasChanged: true,
        createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now.toISOString()
    },
    {
        _id: "demo_3",
        userId: "demo-user",
        websiteName: "Internal Dashboard",
        targetType: "Text Content",
        url: "https://internal.dashboard.com",
        status: "error",
        lastChecked: new Date(now.getTime() - 10 * 60 * 1000).toISOString(), // 10 mins ago
        frequency: { value: 10, unit: "minutes" },
        hasChanged: false,
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now.toISOString()
    },
    {
        _id: "demo_4",
        userId: "demo-user",
        websiteName: "GitHub Status",
        targetType: "API Status",
        url: "https://www.githubstatus.com/",
        status: "paused",
        lastChecked: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        frequency: { value: 30, unit: "minutes" },
        hasChanged: false,
        createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: now.toISOString()
    }
];

export const DEMO_ALERTS: Alert[] = [
    {
        _id: "alert_1",
        userId: "demo-user",
        monitorId: "demo_2",
        monitorName: "Competitor Pricing",
        checked: false,
        receivedAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
        payload: {
            watch_url: "https://example.com/pricing",
            diff: "Price drop! $199 -> $179"
        }
    },
    {
        _id: "alert_2",
        userId: "demo-user",
        monitorId: "demo_3",
        monitorName: "Internal Dashboard",
        checked: true,
        receivedAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
        payload: {
            watch_title: "Dashboard Error",
            current_snapshot: "500 Internal Server Error"
        }
    },
    {
        _id: "alert_3",
        userId: "demo-user",
        monitorId: "demo_1",
        monitorName: "Google Production",
        checked: true,
        receivedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        payload: {
            watch_url: "https://google.com",
            diff: "Status code changed: 200 -> 200 (Stable)"
        }
    }
];
