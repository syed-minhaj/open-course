
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

const getCourseById = async (id:string)=>{
    return await prisma.course.findUnique({
        where: {
            id: id
        }
    })
}

function goBack(){
    "use client";
    window.history.back()
}

export default async function CoursePage({params} : any) {
    if(!params){
        goBack();

    }
    const {id} = await params;
    const course = await getCourseById(id);
    if(!course){
        return (
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">
                    Course not found
                </h1>
            </div>
        )
    }
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">
                Welcome to Course Page {course.name}
            </h1>
        </div>
    )
}

