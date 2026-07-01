export interface Project {
    id: string;

    name: string;

    role: string;

    organization: string;

    startDate: string;

    endDate: string;

    ongoing: boolean;

    description: string;

    technologies: string[];

    url: string;

    repository: string;

    achievements: string[];
}