export type User = {
    comapanyId: string;
    comapanyName: string;
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
    cpvCodes: [];
    locations: [];
    keywords: [];
    competitors: [];
    imageUrl: string;
    tenderMinValue: number;
    tenderMaxValue: number;
};
