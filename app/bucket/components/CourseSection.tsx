import { prisma } from "@/app/lib/prisma";
import { Course } from "@/app/types";
import CoursePreview from "../../components/CoursePreview"

const getCourses = async(userID : string) => {
    return await prisma.user.findUnique({
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

const CourseSection = async({userID}:{userID:string}) => {
    const user = await getCourses(userID);
    if(!user){
        return <div>dfk</div>;
    }
    
    return (
        <div className=" grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 ">
            
            {user.cartItems.map(async (cartItem : Course , index : number)=>{
                const courseOwner = await getCourseOwner(cartItem.id);
                function isOwner(){
                  if(userID == cartItem.creatorId){
                    return true;
                  }else if(courseOwner && courseOwner.buyers.some(buyer => buyer.id == userID)){
                    return true;
                  }else{
                    return false;
                  }
                }
                return(
                    <div key={cartItem.id} className="">
                        <CoursePreview course={cartItem} index={index} owner={isOwner()}  />
                    </div>
                )
            })}
        </div>
    )
}

export default CourseSection;