import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Landing() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="max-w-3xl text-center space-y-8">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
                    Monitor any element<br />
                    <span className="text-primary">
                        on any website
                    </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Track price changes, stock availability, content updates, and more.
                    Get notified instantly when something changes.
                </p>
                <div className="flex justify-center">
                    <Link to="/navigate">
                        <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
