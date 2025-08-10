import { prisma } from "@/app/lib/prisma";
import { Course } from "@/app/types";
import CoursePreview from "../../components/CoursePreview"
import { getImageFromStorage } from "@/app/actions/image";

const getCourses = async(userID : string) => {
    const courses = await prisma.user.findUnique({
        where: {
            id: userID
        },
        include: {
            cartItems: {
                include: {
                    modules: true,
                }
            }
        }
    })
    if(!courses){return null}
    await Promise.all(courses.cartItems.map(async(course : Course) => {
        course.image = await getImageFromStorage(course.image);
    }))
    return courses;
}



const CourseSection = async({userID}:{userID:string}) => {
    const user = await getCourses(userID);
    if(!user){
        return <div>dfk</div>;
    }
    
    return (
        <div className=" grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 ">
            
            {user.cartItems.map(async (cartItem : Course , index : number)=>{
                return(
                    <div key={cartItem.id} className="">
                        <CoursePreview course={cartItem} index={index}   />
                    </div>
                )
            })}
        </div>
    )
}

export default CourseSection;