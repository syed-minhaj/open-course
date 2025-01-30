
import { prisma } from "@/app/lib/prisma";
import { Course, module } from "@/app/types";
import Navbar from "@/app/components/Navbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import ExpandableDescription from "./components/DescriptionComponent";
import { ShoppingCart } from "lucide-react";
import Hero from "./Hero";
import ModulesSection from "./ModulesSection";

const getCourseById = async (id:string)=>{
    const course : Omit<Course,"modules"> | null = await prisma.course.findUnique({
        where: {
            id: id
        },
    })
    if (!course){
        return null;
    }
    const modules : module[] = await prisma.modules.findMany({
        where: {
            courseId: id
        }
    })
    return {...course, modules}
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
            buyers: {
                select:{
                    id: true
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


export default async function CoursePage({params} : any) {
    if(!params){
        redirect('/');

    }
    const {id} = await params;
    const session = await getServerSession();
    if(!session || !session.user || !session.user.email){
        redirect('/')
    }
    const course : Course | null = await getCourseById(id);
    const user = await getUserByEmail(session.user.email);

    

    if(!course){
        return (
            <div className="flex flex-col items-center  min-h-screen bg-primary relative ">
                <h1 className="text-4xl font-bold">
                    Course not found
                </h1>
            </div>
        )
    }

    const Admin = () => {
        if(!user){return false}
        else if(user.id == course.creatorId){
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
        <div className="flex flex-col items-center  min-h-screen bg-primary relative ">
            <header className="w-full bg-prePrimary ">
                <Navbar />
            </header>
            <main className="w-full flex flex-col items-center">
                <Hero course={{name : course.name , description : course.description , price : course.price}} />
                <ModulesSection modules={course.modules} owned={await owned()} />
            </main>
        </div>
    )
}

