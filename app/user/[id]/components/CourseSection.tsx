
import { Course} from "@/app/types";
import CoursePreview from "@/app/components/CoursePreview";
import Create from "./courseSection/Create";
import { prisma } from "@/app/lib/prisma";

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


const CourseSection = async({userID, admin } : {userID: string, admin: boolean}) => {
    
    const course = await getCourse(userID);
    return(
        <div className="w-full min-h-36 flex flex-col gap-5 ">
            {admin ? 
                <Create userID={userID} admin={admin} />
            : null
            }
            <div className="w-full min-h-48 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6  ">
                {course.map(async (course , index  )=>{
                    return(
                        <div key={course.id} className="">
                            <CoursePreview course={course} index={index}  />
                        </div>
                    )
                })}
            </div>
            
            
        </div>
    )
}

export default CourseSection;