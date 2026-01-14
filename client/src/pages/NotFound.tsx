import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-start pt-[20vh] px-6">
            <div className="text-center space-y-6">
                <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    404
                </h1>
                <p className="text-lg text-muted-foreground">
                    Page not found
                </p>
                <div className="pt-2">
                    <Link to="/">
                        <Button size="lg">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
