import { prisma } from "@/app/lib/prisma";
import Navbar from "@/app/components/Navbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { adminUser, nonAdminUser } from "@/app/types";
import { connection } from "next/server";
import Profile from "./components/Profile";
import CourseSection from "./components/CourseSection";
import { Course , module } from "@/app/types";
interface PageProps {
    params: {
        id: string
    }
}

const getUser = async(id: string) => {
    return await  prisma.user.findUnique({
        where: {
            id: id
        }
    })
}

const getCourse = async(id: string) => {
    let course : Omit<Course , "modules">[]  = await  prisma.course.findMany({
        where: {
            creatorId: id
        }
    })
    return  await Promise.all(
        course.map(async (c : Omit<Course , "modules"> ) => {
            const modules : module[] = await prisma.modules.findMany({
                where: {
                    courseId: c.id
                }
            })
            c.modulesCount = modules.length;
            return { modules : modules , ...c}
        })
    )
    
}
export default async function UserPage({params} : any) {
    await connection()
    if(!params){
        redirect('/')
    }
    const {id} = await params;
    const session = await getServerSession();
    if(!id){
        redirect('/')
    }
    const user :adminUser | null = await getUser(id);
    const course : Course[] = await getCourse(id);
    if (!user ){
        redirect('/')
    }

    const isAdmin = () => {
        if (session && session.user && session.user.email == user.email) {
            return true;
        }else{
            return false;
        }
    }
    const viewer : nonAdminUser | null = (user ?{
        id: user.id,
        name: user.name,
        image: user.image,
        bio: user.bio
    } : null)

    if(!viewer){
        redirect('/')
    }
    
    return (
        <div id="user-page" className="flex flex-col items-center  min-h-screen bg-primary relative ">
            <header className="w-full">
                <Navbar />
            </header>
            <main className="md:w-9/12 w-11/12 flex flex-col md:mt-14 mt-10 
                            space-y-5 divide-y divide-gray-300 dark:divide-gray-700  ">
                <Profile user={user} admin={isAdmin()} id={id} />
                <div className="py-5">
                    <CourseSection user={viewer} admin={isAdmin()} course={course} />
                </div>
            </main>
        </div>
    )
}