import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USER, DEMO_MONITORS, DEMO_ALERTS } from '@/data/demoData';
import type { Monitor } from '@/api/monitors';
import type { Alert } from '@/api/alerts';

interface DemoContextType {
    isDemoMode: boolean;
    toggleDemoMode: (enable: boolean) => void;
    demoUser: typeof DEMO_USER;
    demoMonitors: Monitor[];
    demoAlerts: Alert[];
    resetDemo: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
    const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
        return localStorage.getItem('isDemoMode') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('isDemoMode', String(isDemoMode));
    }, [isDemoMode]);

    const toggleDemoMode = (enable: boolean) => {
        setIsDemoMode(enable);
        // Force reload to clean up any real auth state if improving isolation
        // window.location.reload(); 
    };

    const resetDemo = () => {
        setIsDemoMode(false);
        localStorage.removeItem('isDemoMode');
    };

    return (
        <DemoContext.Provider value={{
            isDemoMode,
            toggleDemoMode,
            demoUser: DEMO_USER,
            demoMonitors: DEMO_MONITORS,
            demoAlerts: DEMO_ALERTS,
            resetDemo
        }}>
            {children}
        </DemoContext.Provider>
    );
}

export function useDemo() {
    const context = useContext(DemoContext);
    if (context === undefined) {
        throw new Error('useDemo must be used within a DemoProvider');
    }
    return context;
}
