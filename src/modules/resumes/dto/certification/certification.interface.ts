export interface Certification {

    id: string;

    name: string;

    issuer: string;

    issueDate: string;

    expirationDate: string;

    doesNotExpire: boolean;

    credentialId: string;

    credentialUrl: string;

    description: string;

    skills: string[];
}