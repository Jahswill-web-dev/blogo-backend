export interface PainSolutionInput {
    selected_pain: string;

    // SaaS context
    //   startup_name: string;
    industry: string;
    product: string;
    target_audience: string;
    pain_points: string;
    content_goal: string;
    description: string;
    audience: string;
    platform?: string;
    tone?: string;

    // allow future extensions without breaking callers
    [key: string]: unknown;
}
