
import { prisma } from "@/app/lib/prisma";
import { Course as CourseType , adminUser } from "@/app/types";
import Navbar from "@/app/components/Navbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Hero from "./Hero";
import ModulesSection from "./ModulesSection";

type Course = CourseType & {
    buyers : {id : string}[]
}



const getCourseById = async(id:string) => {
    const course : Course | null = await prisma.course.findUnique({
        where: {
            id: id
        },
        include: {
            modules: true ,
            buyers: {
                select: {
                    id: true
                }
            }
        }
    })
    return course;
}

const getUserByEmail = async(email :string | null | undefined) => {
    if (!email){return null}
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    return user;
}

const isOwner = async (userId : string , buyers : {id : string}[] ) => {
    return buyers.some((buyer : {id: string })=>{
        return buyer.id == userId
    })
}


export default async function CoursePage({params} : {params : any}) {
   
    const {id} = await params;
    if (!id){
        redirect('/')
    }
    const session = await getServerSession();
    if(!session || !session.user || !session.user.email){
        redirect('/')
    }
    
    const [course , user] : [Course | null , adminUser | null] = await Promise.all([
        getCourseById(id),
        getUserByEmail(session.user.email)
    ])

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
            return await isOwner(user.id, course.buyers)
        }
    }

    return (
        <div className="flex flex-col items-center  min-h-screen  bg-primary relative ">
            <header className="w-full z-40 ">
                <Navbar  userImage={user.image} userID={user.id}/>
            </header>
            <main className="w-full flex flex-col items-center absolute top-0  bg-primary ">
                <Hero owned={await owned()} 
                course={{id : course.id , name : course.name , description : course.description , price : course.price , image: course.image}} />
                <ModulesSection modules={course.modules} owned={await owned()} />
            </main>
        </div>
    )
}

