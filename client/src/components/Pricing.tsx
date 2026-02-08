"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const pricingTiers = [
  {
    title: "Hobby",
    description: "For personal projects and exploration.",
    priceMonthly: "₹0",
    priceAnnually: "₹0",
    buttonText: "Start for free",
    buttonVariant: "outline",
    popular: false,
    features: [
      { text: "1 monitor", included: true },
      { text: "Every 24 hours checks", included: true },
      { text: "7 days history retention", included: true },
      { text: "In-App Alerts", included: true },
      { text: "Visual selector tool", included: true },
      { text: "JavaScript rendering", included: false },
      { text: "Proxy rotation", included: false },
      { text: "Email & Webhooks", included: false },
    ],
  },
  {
    title: "Pro",
    description: "For small teams and startups.",
    priceMonthly: "₹499",
    priceAnnually: "₹399",
    buttonText: "Get Pro",
    buttonVariant: "default",
    popular: false,
    features: [
      { text: "15 monitors", included: true },
      { text: "Every 1 hour checks", included: true },
      { text: "30 days history retention", included: true },
      { text: "In-App & Email Alerts", included: true },
      { text: "Visual selector tool", included: true },
      { text: "JavaScript rendering", included: true },
      { text: "Proxy rotation", included: false },
      { text: "Webhooks & Discord", included: false },
    ],
  },
  {
    title: "Premium",
    description: "For demanding workflows and power users.",
    priceMonthly: "₹999",
    priceAnnually: "₹799",
    buttonText: "Get Premium",
    buttonVariant: "default",
    popular: true,
    features: [
      { text: "75 monitors", included: true },
      { text: "Every 5 minutes checks", included: true },
      { text: "90 days history retention", included: true },
      { text: "All Alerts + Webhooks", included: true },
      { text: "Visual selector tool", included: true },
      { text: "JavaScript rendering", included: true },
      { text: "Proxy rotation", included: true },
      { text: "Priority Support", included: true },
    ],
  },
];

interface PricingProps {
  className?: string;
}

const Pricing = ({ className }: PricingProps) => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className={cn("pb-8", className)}>
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Simple, transparent pricing</h2>
            <p className="max-w-[900px] text-muted-foreground text-sm xl:text-base/relaxed">
              Choose the perfect plan for your tracking needs. Upgrade anytime as your monitors grow.
            </p>
          </div>
          <div className="flex items-center space-x-4 pt-2">
            <Label htmlFor="billing-toggle" className={cn(!isAnnual && "font-bold")}>Monthly</Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label htmlFor="billing-toggle" className={cn(isAnnual && "font-bold")}>Annually (Save up to 20%)</Label>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-3 lg:gap-8">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.title} 
              className={cn("flex flex-col justify-between", tier.popular ? "border-primary shadow-lg ring-2 ring-primary/20 scale-105" : "")}
            >
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{tier.title}</CardTitle>
                    {tier.popular && (
                      <Badge variant="default" className="uppercase text-[10px] font-semibold tracking-wider">Most Popular</Badge>
                    )}
                  </div>
                  <CardDescription className="pt-1.5">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                        {isAnnual ? tier.priceAnnually : tier.priceMonthly}
                    </span>
                    <span className="text-muted-foreground font-medium">/month</span>
                  </div>
                  <ul className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        {feature.included ? (
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                            <X className="h-4 w-4 text-muted-foreground/50" />
                          </div>
                        )}
                        <span className={cn("text-sm", !feature.included && "text-muted-foreground font-light")}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={tier.buttonVariant as "default" | "outline"}
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Pricing };
