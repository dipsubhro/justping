import { Button } from "@/components/ui/button"
import { useDemo } from "@/context/DemoContext"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export function DemoCTA() {
    const { toggleDemoMode } = useDemo()
    const navigate = useNavigate()

    const handleDemoClick = () => {
        toggleDemoMode(true)
        navigate('/navigate')
    }

    return (
        <div className="hidden lg:flex flex-col justify-center items-center h-full p-8 bg-muted border-l border-border relative">
            <div className="text-center space-y-4">
                <Button 
                    variant="outline"
                    className="group border-foreground/10 hover:border-foreground/20 hover:bg-background/50"
                    onClick={handleDemoClick}
                >
                    View Demo
                    <ArrowRight className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Button>
            </div>
        </div>
    )
}
