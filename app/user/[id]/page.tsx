

import { prisma } from "@/app/lib/prisma";
import Navbar from "@/app/components/Navbar";
import { getServerSession, Session } from "next-auth";
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

const getUser = async(id: string) : Promise<adminUser | null> => {
    return await  prisma.user.findUnique({
        where: {
            id: id
        }
    })
}

const getCourse = async(id: string) : Promise<Course[]> => {
    return await  prisma.course.findMany({
        where: {
            creatorId: id
        },
        include:{
            modules: true
        }
    })
}

const ViewerImage = async(email : string) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        select: {
            image: true
        }
    })
    if(!user){
        redirect('/')
    }
    return user.image;
}

export default async function UserPage({params} : PageProps) {
    if(!params || !params.id){
        redirect('/')
    }
    const {id} = await params;
    
    const [session, user , course] : [Session | null , adminUser | null , Course[]] = await Promise.all([
        getServerSession(),
        getUser(id),
        getCourse(id)
    ]);

    if (!user || !session || !session.user || !session.user.email){
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
        <div className="flex flex-col items-center  min-h-screen bg-primary relative ">
            <header className="w-full">
                <Navbar  userImage={await ViewerImage(session.user.email)}/>
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