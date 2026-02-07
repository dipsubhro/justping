"use client";

import { Check, ChevronDown, Info, X } from "lucide-react";
import { Fragment, useState } from "react";

import { cn } from "@/lib/utils";


import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const plans = [
  {
    title: "Hobby",
    price: { monthly: "₹0", annually: "₹0" },
    href: "#",
    recommended: false,
  },
  {
    title: "Pro",
    price: { monthly: "₹499", annually: "₹399" },
    href: "#",
    recommended: false,
  },
  {
    title: "Premium",
    price: { monthly: "₹999", annually: "₹799" },
    href: "#",
    recommended: true,
  },
  {
    title: "Enterprise",
    price: { monthly: "Custom", annually: "Custom" },
    href: "#",
    recommended: false,
  },
];

const featureMatrix = [
  {
    title: "Core Monitoring",
    features: [
      {
        title: "Number of monitors",
        info: "How many pages you can monitor at once",
        inclusions: [
          { plan: "Hobby", content: "1 monitor" },
          { plan: "Pro", content: "15 monitors" },
          { plan: "Premium", content: "75 monitors" },
          { plan: "Enterprise", content: "Unlimited" },
        ],
      },
      {
        title: "Check frequency",
        info: "How often we check your tracked pages for changes",
        inclusions: [
          { plan: "Hobby", content: "Every 24 hours" },
          { plan: "Pro", content: "Every 1 hour" },
          { plan: "Premium", content: "Every 5 minutes" },
          { plan: "Enterprise", content: "Down to 1 minute" },
        ],
      },
      {
        title: "History retention",
        info: "How long we keep snapshots of changes",
        inclusions: [
          { plan: "Hobby", content: "7 days" },
          { plan: "Pro", content: "30 days" },
          { plan: "Premium", content: "90 days" },
          { plan: "Enterprise", content: "Unlimited history" },
        ],
      },
    ],
  },
  {
    title: "Advanced Features",
    features: [
      {
        title: "Visual selector tool",
        info: "Point and click to select elements to track",
        inclusions: [
          { plan: "Hobby", content: <Check className="size-4 lg:size-5" /> },
          { plan: "Pro", content: <Check className="size-4 lg:size-5" /> },
          { plan: "Premium", content: <Check className="size-4 lg:size-5" /> },
          { plan: "Enterprise", content: <Check className="size-4 lg:size-5" /> },
        ],
      },
      {
        title: "JavaScript rendering",
        info: "Track single page applications (React, Vue, etc.)",
        inclusions: [
          { plan: "Hobby", content: <X className="size-4 text-muted-foreground lg:size-5" /> },
          { plan: "Pro", content: <Check className="size-4 lg:size-5" /> },
          { plan: "Premium", content: <Check className="size-4 lg:size-5" /> },
          { plan: "Enterprise", content: <Check className="size-4 lg:size-5" /> },
        ],
      },
      {
        title: "Proxy rotation",
        info: "Avoid being blocked by tracked sites",
        inclusions: [
          { plan: "Hobby", content: <X className="size-4 text-muted-foreground lg:size-5" /> },
          { plan: "Pro", content: <X className="size-4 text-muted-foreground lg:size-5" /> },
          { plan: "Premium", content: <Check className="size-4 lg:size-5" /> },
          { plan: "Enterprise", content: <Check className="size-4 lg:size-5" /> },
        ],
      },
    ],
  },
  {
    title: "Notifications",
    features: [
      {
        title: "In-App Alerts",
        info: "View alerts from the JustPing dashboard",
        inclusions: [
          { plan: "Hobby", content: <Check className="size-4 lg:size-5" /> },
          { plan: "Pro", content: <Check className="size-4 lg:size-5" /> },
          { plan: "Premium", content: <Check className="size-4 lg:size-5" /> },
          { plan: "Enterprise", content: <Check className="size-4 lg:size-5" /> },
        ],
      },
      {
        title: "Email Notifications",
        info: "Get notified directly in your inbox",
        inclusions: [
          { plan: "Hobby", content: <X className="size-4 text-muted-foreground lg:size-5" /> },
          { plan: "Pro", content: <Check className="size-4 lg:size-5" /> },
          { plan: "Premium", content: <Check className="size-4 lg:size-5" /> },
          { plan: "Enterprise", content: <Check className="size-4 lg:size-5" /> },
        ],
      },
      {
        title: "Webhooks & Discord",
        info: "Ping external services or team chat applications",
        inclusions: [
          { plan: "Hobby", content: <X className="size-4 text-muted-foreground lg:size-5" /> },
          { plan: "Pro", content: <X className="size-4 text-muted-foreground lg:size-5" /> },
          { plan: "Premium", content: <Check className="size-4 lg:size-5" /> },
          { plan: "Enterprise", content: <Check className="size-4 lg:size-5" /> },
        ],
      },
    ],
  },
];

interface PricingProps {
  className?: string;
}

const Pricing = ({ className }: PricingProps) => {
  const [billing, setBilling] = useState<"monthly" | "annually">("monthly");
  return (
    <section className={cn("py-10", className)}>
      <div className="container mb-8 lg:mb-0">
        <div className="grid grid-cols-2 gap-y-12 md:gap-y-16">
          <div className="col-span-2 flex flex-col lg:col-span-1">
            <h1 className="my-6 text-3xl font-bold text-pretty md:text-4xl xl:text-5xl">
              Pricing Plans
            </h1>
            <p className="text-muted-foreground lg:text-xl">
              Choose the perfect plan for your tracking needs. Upgrade anytime as your monitors grow.
            </p>
          </div>
        </div>
        <div className="bg-background lg:sticky lg:top-16">
          <div className="mb-8 pt-8">
            <div className="grid items-end gap-6 border-b border-border pb-8 lg:grid-cols-6">
              <div className="col-span-2">
                <div className="flex h-full flex-col justify-end">
                  <span className="mb-2 text-xs font-medium text-muted-foreground">
                    Billing
                  </span>
                  <Tabs
                    value={billing}
                    onValueChange={setBilling as (value: string) => void}
                  >
                    <TabsList>
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      <TabsTrigger value="annually">Annually</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              {plans.map((plan) => (
                <div
                  key={plan.title}
                  className="rounded-lg border border-border p-3 2xl:p-4"
                >
                  <h3 className="mb-1 text-xl font-medium xl:text-2xl">
                    {plan.title}
                  </h3>
                  <p className="mb-4 text-sm font-medium text-muted-foreground">
                    {plan.price[billing]}
                    <span className="hidden 2xl:inline"> / monthly</span>
                  </p>
                  <Button
                    variant={plan.recommended ? "default" : "outline"}
                    className="w-full"
                  >
                    <span className="2xl:hidden">Register</span>
                    <span className="hidden 2xl:inline">
                      Get started for free
                    </span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-8 lg:space-y-14">
          {featureMatrix.map((category) => (
            <div key={category.title}>
              <h3 className="mb-6 text-lg font-medium lg:mb-3">
                {category.title}
              </h3>
              <div className="space-y-4 lg:space-y-0">
                <TooltipProvider delayDuration={150}>
                  {category.features.map((feature) => (
                    <Fragment key={feature.title}>
                      <dl className="hidden grid-cols-6 gap-6 border-b border-border lg:grid">
                        <dt className="col-span-2 justify-between py-4 pb-4">
                          <Tooltip>
                            <h4 className="group flex min-h-6 items-center gap-x-1 font-medium">
                              {feature.title}{" "}
                              {feature.info && (
                                <TooltipTrigger asChild>
                                  <Info className="ml-2 size-4 cursor-pointer text-muted-foreground group-hover:text-accent-foreground" />
                                </TooltipTrigger>
                              )}
                            </h4>
                            {feature.info && (
                              <TooltipContent>{feature.info}</TooltipContent>
                            )}
                          </Tooltip>
                        </dt>
                        {feature.inclusions.map((inclusion) => (
                          <dd
                            key={inclusion.plan}
                            className="hidden py-4 text-sm text-muted-foreground lg:block"
                          >
                            {inclusion.content}
                          </dd>
                        ))}
                      </dl>
                      <Collapsible
                        className="group lg:hidden"
                        defaultOpen={false}
                      >
                        <dl
                          key={feature.title}
                          className="border-b border-border"
                        >
                          <CollapsibleTrigger className="w-full">
                            <dt className="flex items-center justify-between pb-4">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <h4 className="group flex items-center gap-x-1 text-sm font-medium md:text-base">
                                    {feature.title}
                                    {feature.info && (
                                      <Info className="ml-2 size-4 cursor-pointer text-muted-foreground group-hover:text-accent-foreground" />
                                    )}
                                  </h4>
                                </TooltipTrigger>
                                {feature.info && (
                                  <TooltipContent>
                                    {feature.info}
                                  </TooltipContent>
                                )}
                              </Tooltip>

                              <ChevronDown className='size-5 transition-transform group-data-[state="open"]:rotate-180' />
                            </dt>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            {feature.inclusions.map((inclusion) => (
                              <dd
                                key={inclusion.plan}
                                className="flex items-center border-b border-border py-3 text-xs text-muted-foreground last:border-b-0 md:py-3.5"
                              >
                                <div className="w-1/2 md:w-1/4">
                                  {inclusion.plan}
                                </div>
                                {inclusion.content}
                              </dd>
                            ))}
                          </CollapsibleContent>
                        </dl>
                      </Collapsible>
                    </Fragment>
                  ))}
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 hidden text-xs text-muted-foreground md:block">
          * Caveats and other conditions
        </p>
      </div>
    </section>
  );
};

export { Pricing };
