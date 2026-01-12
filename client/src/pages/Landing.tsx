import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Clock, Eye, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">JustPing</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost">Sign In</Button>
                        </Link>
                        <Link to="/navigate">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-block">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <Zap className="h-4 w-4" />
                            Real-time website monitoring
                        </span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                        Monitor any element
                        <br />
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            on any website
                        </span>
                    </h1>
                    
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Track price changes, stock availability, content updates, and more.
                        Get instant notifications when something changes.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Link to="/navigate">
                            <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                                Start Monitoring Free
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl">
                            View Demo
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Free forever plan
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Everything you need to stay updated
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Powerful monitoring tools that work automatically in the background
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="border-2 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Eye className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Visual Element Selection</CardTitle>
                                <CardDescription>
                                    Point and click to select any element on any webpage. No coding required.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-2 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Flexible Scheduling</CardTitle>
                                <CardDescription>
                                    Check every 5 minutes, hourly, or daily. You control the monitoring frequency.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-2 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Bell className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Instant Alerts</CardTitle>
                                <CardDescription>
                                    Get notified via email, Slack, or webhook the moment something changes.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-2 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Smart Detection</CardTitle>
                                <CardDescription>
                                    Advanced change detection filters out noise and tracks only meaningful updates.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-2 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <CheckCircle2 className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Change History</CardTitle>
                                <CardDescription>
                                    View complete history of all detected changes with timestamps and snapshots.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-2 hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <ArrowRight className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Easy Setup</CardTitle>
                                <CardDescription>
                                    Start monitoring in under 60 seconds. No technical knowledge required.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        How it works
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Start monitoring in three simple steps
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
                    <div className="relative text-center">
                        <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                            1
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Enter a URL</h3>
                        <p className="text-muted-foreground">
                            Paste any website URL you want to monitor for changes
                        </p>
                        {/* Connection line */}
                        <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border -z-10" />
                    </div>

                    <div className="relative text-center">
                        <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                            2
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Select Element</h3>
                        <p className="text-muted-foreground">
                            Click on the specific element you want to track on the page
                        </p>
                        {/* Connection line */}
                        <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border -z-10" />
                    </div>

                    <div className="relative text-center">
                        <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                            3
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Get Notified</h3>
                        <p className="text-muted-foreground">
                            Receive instant alerts when the element changes
                        </p>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link to="/navigate">
                        <Button size="lg" className="rounded-xl">
                            Try it now - It's free
                        </Button>
                    </Link>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-20">
                <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardContent className="p-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to start monitoring?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of users who trust JustPing to keep them updated on the web changes that matter most.
                        </p>
                        <Link to="/navigate">
                            <Button size="lg" className="text-lg px-8 py-6 rounded-xl">
                                Start Monitoring Now
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </section>

            {/* Footer */}
            <footer className="border-t mt-20">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Bell className="h-5 w-5 text-primary" />
                                <span className="font-bold">JustPing</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Monitor website changes effortlessly
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/navigate" className="hover:text-foreground">Features</Link></li>
                                <li><Link to="/navigate/billing" className="hover:text-foreground">Pricing</Link></li>
                                <li><Link to="/navigate" className="hover:text-foreground">Demo</Link></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground">About</a></li>
                                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                                <li><a href="#" className="hover:text-foreground">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
                        © 2026 JustPing. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
