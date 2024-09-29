export interface UserProfile {
    userName: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    city: string;
    description: string;
    facebookLink: string;
    githubLink: string;
    school: string;
    role: string;
    avatarUrl: string;
    createdAt: string;
}

export interface UpdateUserProfile {
    userName: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    city: string;
    description: string;
    facebookLink: string;
    githubLink: string;
    school: string;
    avatarUrl: string;
}
