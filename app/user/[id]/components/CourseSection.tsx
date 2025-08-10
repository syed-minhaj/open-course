
import { Course} from "@/app/types";
import CoursePreview from "@/app/components/CoursePreview";
import Create from "./courseSection/Create";
import { prisma } from "@/app/lib/prisma";
import { getImageFromStorage } from "@/app/actions/image";

const getCourse = async(id: string) : Promise<Course[]> => {
    const courses = await  prisma.course.findMany({
            where: {
                creatorId: id
            },
            include:{
                modules: true
            }
        })

    await Promise.all(courses.map(async(course : Course) => {
        course.image = await getImageFromStorage(course.image);
    }))
    return courses;
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