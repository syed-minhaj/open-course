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

const CourseSection = async({userID}:{userID:string}) => {
    const user = await getCourses(userID);
    if(!user){
        return <div>dfk</div>;
    }
    //const cartItems : Course[] = user.cartItems;
    return (
        <div className=" grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2 mt-4 ">
            
            {user.cartItems.map((cartItem : Course , index : number)=>{
                return(
                    <div key={cartItem.id} className="">
                        <CoursePreview course={cartItem} index={index} admin={false}  />
                    </div>
                )
            })}
        </div>
    )
}

export default CourseSection;