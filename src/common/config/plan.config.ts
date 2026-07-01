export interface PlanLimits {
    resumes: number;
    coverLetters: number;
    atsChecks: number;
    teamMembers: boolean;
    prioritySupport: boolean;
}

export interface PlanDef {
    id: string;
    name: string;
    price: number;
    limits: PlanLimits;
    features: string[];
}

export const PLANS: Record<string, PlanDef> = {
    free: {
        id: "free",
        name: "Free",
        price: 0,
        limits: { resumes: 3, coverLetters: 5, atsChecks: 10, teamMembers: false, prioritySupport: false },
        features: [
            "Up to 3 resumes",
            "Up to 5 cover letters",
            "10 ATS checks per month",
            "Basic templates",
            "PDF export",
        ],
    },
    pro: {
        id: "pro",
        name: "Pro",
        price: 12,
        limits: { resumes: 15, coverLetters: 30, atsChecks: 999999, teamMembers: false, prioritySupport: false },
        features: [
            "Up to 15 resumes",
            "Up to 30 cover letters",
            "Unlimited ATS checks",
            "All templates",
            "PDF & DOCX export",
            "Priority email support",
        ],
    },
    enterprise: {
        id: "enterprise",
        name: "Enterprise",
        price: 49,
        limits: { resumes: 999999, coverLetters: 999999, atsChecks: 999999, teamMembers: true, prioritySupport: true },
        features: [
            "Unlimited resumes",
            "Unlimited cover letters",
            "Unlimited ATS checks",
            "All templates + custom branding",
            "PDF, DOCX & batch export",
            "AI auto-arrange by job description",
            "Team collaboration",
            "Dedicated support",
        ],
    },
};

export function getPlanLimits(planId: string): PlanLimits {
    const plan = PLANS[planId];
    if (!plan) return PLANS.free.limits;
    return plan.limits;
}
