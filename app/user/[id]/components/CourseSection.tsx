
import { adminUser, nonAdminUser , Course} from "@/app/types";
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

const getCourseOwner = async(id : string) => {
    return await prisma.course.findUnique({
        where: {
            id: id
        },
        select: {
            buyers:{
                select:{
                    id: true,
                }
            }
        }
    })
}

const CourseSection = async({user, admin } : {user: adminUser | nonAdminUser, admin: boolean}) => {
    
    const course = await getCourse(user.id);
    return(
        <div className="w-full min-h-36 flex flex-col gap-2 ">
            {admin ? 
                <Create user={user} admin={admin} />
            : null
            }
            <div className="w-full min-h-48 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2  ">
                {course.map(async (course , index  )=>{
                    const courseOwner = await getCourseOwner(course.id);
                    function isOwner(){
                      if(admin){
                        return true;
                      }else if(courseOwner && courseOwner.buyers.some(buyer => buyer.id == user.id)){
                        return true;
                      }else{
                        return false;
                      }
                    }
                    return(
                        <div key={course.id} className="">
                            <CoursePreview course={course} index={index} owner={isOwner()}  />
                        </div>
                    )
                })}
            </div>
            
            
        </div>
    )
}

export default CourseSection;