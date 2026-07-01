import { Injectable } from "@nestjs/common";
import { ResumesService } from "../resumes/resumes.service";
import { AiService } from "../ai/ai.service";

export interface Question {
    id: string;
    question: string;
    hint: string;
}

export interface GenerateResult {
    questions: {
        behavioral: Question[];
        technical: Question[];
        situational: Question[];
        general: Question[];
    };
}

const behavioralBank: Question[] = [
    { id: "b1", question: "Tell me about a time you resolved a team conflict.", hint: "Use STAR: Situation, Task, Action, Result. Focus on your role and the outcome." },
    { id: "b2", question: "Describe a project where you took initiative beyond your responsibilities.", hint: "Highlight what motivated you, the steps you took, and the measurable impact." },
    { id: "b3", question: "How do you handle receiving constructive criticism?", hint: "Show openness to feedback, a growth mindset, and a specific example of improvement." },
    { id: "b4", question: "Describe a time you had to meet a tight deadline.", hint: "Explain how you prioritized, communicated, and delivered under pressure." },
    { id: "b5", question: "Tell me about a time you made a mistake at work.", hint: "Be honest, focus on what you learned and how you prevented it from recurring." },
    { id: "b6", question: "How do you handle working with a difficult team member?", hint: "Show empathy, communication skills, and a focus on solutions." },
];

const generalBank: Question[] = [
    { id: "g1", question: "Why do you want to work here?", hint: "Research the company's values, products, and culture. Connect them to your skills." },
    { id: "g2", question: "Where do you see yourself in five years?", hint: "Show ambition aligned with the role — growing skills, taking ownership, mentoring." },
    { id: "g3", question: "What are your greatest strengths?", hint: "Choose 2-3 strengths relevant to the role and back them with examples." },
    { id: "g4", question: "What is your greatest weakness?", hint: "Pick a real weakness and explain the steps you're taking to improve it." },
    { id: "g5", question: "Why are you leaving your current position?", hint: "Stay positive — focus on growth opportunities rather than negatives." },
    { id: "g6", question: "Tell me about yourself.", hint: "Give a brief summary: current role, key achievements, and why you're interested in this position." },
];

const situationalBank: Question[] = [
    { id: "s1", question: "You're given a tight deadline for a feature you've never built. What do you do?", hint: "Break it down, research quickly, communicate trade-offs, prioritize core functionality." },
    { id: "s2", question: "A production bug is affecting users. Walk through your response.", hint: "Assess impact, rollback if needed, fix, test, deploy, document root cause." },
    { id: "s3", question: "Your manager asks you to prioritize two equally important tasks. How do you decide?", hint: "Consider business impact, dependencies, and communicate with stakeholders." },
    { id: "s4", question: "A colleague disagrees with your technical approach. How do you handle it?", hint: "Listen to their perspective, present data/evidence, and find common ground." },
];

const technicalBySkill: Record<string, Question[]> = {
    react: [
        { id: "t_react1", question: "How would you optimize a React component that re-renders too often?", hint: "Consider React.memo, useMemo, useCallback, and proper key props." },
        { id: "t_react2", question: "Explain the difference between controlled and uncontrolled components.", hint: "Controlled: state managed by React. Uncontrolled: state managed by the DOM via refs." },
        { id: "t_react3", question: "How does React's reconciliation algorithm work?", hint: "Virtual DOM diffing, key-based comparisons, and fiber architecture." },
    ],
    typescript: [
        { id: "t_ts1", question: "What's the difference between interfaces and types in TypeScript?", hint: "Interfaces can be extended/merged; types can use unions, intersections, and mapped types." },
        { id: "t_ts2", question: "How do you handle type safety in API responses?", hint: "Use discriminated unions, zod validation, or branded types." },
    ],
    node: [
        { id: "t_node1", question: "How does Node.js handle asynchronous operations?", hint: "Event loop, libuv thread pool, callbacks, promises, async/await." },
        { id: "t_node2", question: "Explain the middleware pattern in Express/NestJS.", hint: "Pipeline of functions that process requests — order matters for auth, validation, logging." },
    ],
    python: [
        { id: "t_py1", question: "What are Python decorators and how do they work?", hint: "Functions that wrap other functions, commonly used for logging, auth, caching." },
        { id: "t_py2", question: "Explain the Global Interpreter Lock (GIL) in Python.", hint: "Mutex that prevents multiple threads from executing Python bytecode simultaneously." },
    ],
    javascript: [
        { id: "t_js1", question: "Explain closures in JavaScript with an example.", hint: "A function that retains access to its outer scope even after the outer function has returned." },
        { id: "t_js2", question: "What's the difference between var, let, and const?", hint: "Scope (function vs block), hoisting, reassignment, temporal dead zone." },
    ],
    mongodb: [
        { id: "t_mongo1", question: "How would you design a MongoDB schema for a social media app?", hint: "Embedding vs referencing, indexing, aggregation pipelines." },
        { id: "t_mongo2", question: "Explain indexing strategies in MongoDB.", hint: "Single field, compound, multikey, text indexes — trade-offs on read/write performance." },
    ],
    sql: [
        { id: "t_sql1", question: "Explain the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN.", hint: "INNER: matching rows only. LEFT: all left + matches. RIGHT: all right + matches." },
        { id: "t_sql2", question: "How would you optimize a slow SQL query?", hint: "Use EXPLAIN, check indexes, avoid SELECT *, reduce subqueries." },
    ],
    docker: [
        { id: "t_docker1", question: "What's the difference between a Docker image and a container?", hint: "An image is a blueprint; a container is a running instance of that image." },
        { id: "t_docker2", question: "How do you manage multi-container applications?", hint: "Docker Compose for local dev, Kubernetes for production orchestration." },
    ],
    aws: [
        { id: "t_aws1", question: "Explain the difference between S3, EBS, and EFS.", hint: "S3: object storage. EBS: block storage attached to EC2. EFS: shared file system." },
        { id: "t_aws2", question: "How would you design a serverless API on AWS?", hint: "API Gateway + Lambda + DynamoDB, with Cognito for auth." },
    ],
    git: [
        { id: "t_git1", question: "How do you resolve a merge conflict in Git?", hint: "Identify conflicting files, edit to resolve, git add, git commit." },
        { id: "t_git2", question: "Explain the difference between rebase and merge.", hint: "Merge creates a merge commit; rebase rewrites commit history for a linear timeline." },
    ],
    css: [
        { id: "t_css1", question: "Explain Flexbox vs Grid layout systems.", hint: "Flexbox: one-dimensional. Grid: two-dimensional. Use cases and browser support." },
        { id: "t_css2", question: "How do you create a responsive design without a framework?", hint: "Media queries, relative units (rem/em/vw/vh), CSS Grid, Flexbox." },
    ],
};

function pickRandom<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

@Injectable()
export class InterviewService {
    constructor(
        private readonly resumesService: ResumesService,
        private readonly aiService: AiService,
    ) {}

    async generate(userId: string, dto: { resumeId: string; jobDescription?: string }): Promise<GenerateResult> {
        const resume = await this.resumesService.findOne(dto.resumeId, userId);
        const skills = resume.content?.skills ?? [];

        if (await this.aiService.isAvailable()) {
            try {
                return await this.generateWithAi(skills, dto.jobDescription);
            } catch {
                return this.generateFromBanks(skills);
            }
        }

        return this.generateFromBanks(skills);
    }

    private async generateWithAi(
        skills: string[],
        jobDescription?: string,
    ): Promise<GenerateResult> {
        const prompt = `Generate interview questions for a candidate with these skills: ${skills.join(", ")}${jobDescription ? `\nJob Description: ${jobDescription}` : ""}

Return JSON with 4 categories:
- behavioral (4 questions about teamwork, conflict, leadership)
- technical (5 questions specific to their skills)
- situational (3 scenario-based questions)
- general (3 common interview questions)

Each question must have: id (unique string), question, hint (answering advice).`;

        const raw = await this.aiService.generateText(prompt, {
            systemPrompt: "You are an expert technical interviewer. Generate realistic, role-specific interview questions in JSON format only.",
            maxTokens: 2048,
            temperature: 0.5,
        });

        return JSON.parse(raw);
    }

    private generateFromBanks(skills: string[]): GenerateResult {
        const matchedSkills = skills
            .map((s: string) => s.toLowerCase().trim())
            .filter((s: string) => s.length > 0);

        const techQuestions: Question[] = [];
        const seen = new Set<string>();
        for (const skill of matchedSkills) {
            for (const [key, questions] of Object.entries(technicalBySkill)) {
                if (skill.includes(key)) {
                    for (const q of questions) {
                        if (!seen.has(q.id)) {
                            seen.add(q.id);
                            techQuestions.push(q);
                        }
                    }
                }
            }
        }

        if (techQuestions.length < 4) {
            const fallback = [
                { id: "t_gen1", question: "How do you ensure code quality in your projects?", hint: "Code reviews, linting, type checking, testing (unit/integration), CI/CD." },
                { id: "t_gen2", question: "Explain how you'd design a scalable REST API from scratch.", hint: "Versioning, pagination, caching, rate limiting, auth, and error handling." },
                { id: "t_gen3", question: "What's your experience with testing strategies?", hint: "Unit tests, integration tests, end-to-end tests, TDD, and testing pyramids." },
                { id: "t_gen4", question: "How do you stay up to date with new technologies?", hint: "Blogs, newsletters, side projects, conferences, open source contributions." },
            ];
            for (const q of fallback) {
                if (!seen.has(q.id)) {
                    seen.add(q.id);
                    techQuestions.push(q);
                }
            }
        }

        return {
            questions: {
                behavioral: pickRandom(behavioralBank, 4),
                technical: pickRandom(techQuestions, Math.min(techQuestions.length, 5)),
                situational: pickRandom(situationalBank, 3),
                general: pickRandom(generalBank, 3),
            },
        };
    }
}
