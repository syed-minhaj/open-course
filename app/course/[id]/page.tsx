
import { prisma } from "@/app/lib/prisma";
import { Course } from "@/app/types";
import Navbar from "@/app/components/Navbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Hero from "./Hero";
import ModulesSection from "./ModulesSection";

export async function generateStaticParams() {
    const courses = await prisma.course.findMany({
        select: { id: true }
    });

    return courses.map((course) => ({
        id: course.id,
    }));
}

export const revalidate = 3600;

const getCourseById = async(id:string) => {
    const course : Course | null = await prisma.course.findUnique({
        where: {
            id: id
        },
        include: {
            modules: true
        }
    })
    return course;
}

const getUserByEmail = async(email :string | null | undefined) => {
    if (!email){return null}
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    })
}

const isOwner = async (userId : string , courseId : string) => {
    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        },
        select : {
            id : true,
            buyers : {
                select : {
                    id : true
                }
            }
        }
    })
    if (course && course.buyers){
        return course.buyers.some((buyer : any)=>{
            return buyer.id == userId
        })
    }
    return false;
}


export default async function CoursePage({params} : {params : Promise<{id : string}>}) {
   
    const {id} = await params;
    const session = await getServerSession();
    if(!session || !session.user || !session.user.email){
        redirect('/')
    }
    const course : Course | null = await getCourseById(id);
    const user = await getUserByEmail(session.user.email);

    if(!user){
        redirect('/')
    }

    if(!course ){
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-primary relative ">
                <h1 className="text-4xl font-bold m-2 ">
                    Course not found
                </h1>
                <a href={'/'} className="m-2 p-2 rounded bg-prePrimary text-xl ">Home</a>
            </div>
        )
    }

    const Admin = () => {
        if(user.id == course.creatorId){
            return true;
        }else{
            return false;
        }
    }
    const owned = async() => {
        if(!user){return false}
        else if (Admin()){return true;}
        else {
            return await isOwner(user.id, course.id)
        }
    }

    return (
        <div className="flex flex-col items-center  min-h-screen  bg-primary relative ">
            <header className="w-full z-40 ">
                <Navbar  userImage={user.image}/>
            </header>
            <main className="w-full flex flex-col items-center absolute top-0  bg-primary ">
                <Hero owned={await owned()} 
                course={{id : course.id , name : course.name , description : course.description , price : course.price , image: course.image}} />
                <ModulesSection modules={course.modules} owned={await owned()} />
            </main>
        </div>
    )
}

