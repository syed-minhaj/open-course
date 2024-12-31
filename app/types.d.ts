
type nonAdminUser = {
    id: string;
    name: string;
    image: string;
    bio: string | null;
}
type adminUser = nonAdminUser & {
    email: string;
    wallet: number;
}
export type { adminUser, nonAdminUser };