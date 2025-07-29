
type nonAdminUser = {
    id: string;
    name: string;
    image: string;
    bio: string | null;
}
type adminUser = nonAdminUser & {
    email: string;
    wallet: number;
    stripeId: string | null;
}
type module_created = {
    indexInCourse : number,
    modelName : string,
    materialLink : string,
    modelImage : File | null
}

type module = {
    id: string,
    indexInCourse: number,
    name: string,
    matarialLink: string,
    image: string | null
}

type Course_created = {
    name : string,
    image :  File  ,
    description : string,
    creatorId : string,
    price : number,
    modules : module_created[]
}

type Course = Omit<Course_created , 'modules' | 'image'> & {
    id: string;
    modulesCount: number;
    reviewCount: number;
    userCount: number;
    avgRating: number;
    image : string;
    modules: module[]
}

export type { adminUser, nonAdminUser , module_created , Course_created  
            , module , Course
};