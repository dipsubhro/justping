import { Pricing } from '@/components/Pricing';

export default function Billing() {
    return (
        <div className="flex-1 w-full h-full overflow-auto p-4">
            <div className="max-w-6xl mx-auto">
                <Pricing />
            </div>
        </div>
    );
}
