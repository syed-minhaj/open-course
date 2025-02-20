import { Course } from "@/app/types"
import Link from "next/link";
import { Package } from "lucide-react";
import BuyCourse from "./Button/BuyCourse";

const CoursePreviw = ({course, owner } : {course: Course, index: number, owner: boolean }) => {
    return(
        <div  className="max-h-fit flex flex-row-reverse md:flex-col gap-2 
        bg-prePrimary rounded-lg p-2 shadow-sm shadow-slate-700 dark:shadow-black drop-shadow-sm">
            
            <div className="w-24 flex flex-col justify-between  md:w-full   ">
                <img src={course.image} alt={course.name} className=" h-24 md:w-full w-24 object-cover rounded-lg"/>
                <div className="flex flex-row justify-between md:hidden">
                    <Link href={`/course/${course.id}`} className="md:ml-auto text-accent hover:opacity-65 h-fit my-auto ">
                        details
                    </Link>
                    {owner ?
                        <p  className="md:ml-auto text-accent ">
                            {course.price == 0 ? "Free" : "$"+course.price}
                        </p>
                    :
                        <BuyCourse courseID={course.id} coursePrice={course.price} />
                    }
                </div>
            </div>
            <div className="flex flex-col justify-start flex-1 gap-1 text-secondary">
                <h2 className="  ">{course.name}</h2>
                <p className="h-32 md:h-auto max-h-32 min-h-24 overflow-y-clip font-light text-sm opacity-65 ">
                    {course.description}
                </p>
                <div className="md:hidden p-1 text-accent border border-accent rounded-md flex flex-row items-center 
                gap-1 relative text-sm/4 w-fit ">
                    <Package size={14} className="w-[14] h-[14]  "/> {course.modules.length}
                </div>
            </div>
            <div className="md:flex flex-row justify-between hidden gap-3 text-sm ">
                <div className="p-1 text-accent border border-accent rounded-md flex flex-row items-center gap-1 relative text-sm/4 ">
                    <Package size={14} className="w-[14] h-[14]  "/> {course.modules.length}
                </div>
                <Link href={`/course/${course.id}`} className="md:ml-auto text-accent hover:opacity-65 h-fit my-auto ">
                    details
                </Link>
                {owner ?
                    <p  className=" text-accent ">
                        {course.price == 0 ? "Free" : "$"+course.price}
                    </p>
                :
                    <BuyCourse courseID={course.id} coursePrice={course.price} />
                }
            </div>
        </div>
    )
}

export default CoursePreviw;