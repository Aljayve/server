export interface ResumeRenderer {
    render(resume: any): Promise<string> | string;
}
