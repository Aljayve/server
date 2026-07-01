export interface CustomSectionItem {
    title?: string;
    subtitle?: string;
    date?: string;
    description?: string;
}

export interface CustomSection {
    id: string;
    title: string;
    items?: CustomSectionItem[];
}
