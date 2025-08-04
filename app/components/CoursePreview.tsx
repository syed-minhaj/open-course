import { Course } from "@/app/types"
import Link from "next/link";
import { Package } from "lucide-react";
import BuyCourse from "./Button/BuyCourse";
import Image from "next/image"

const CoursePreviw = ({course, owner } : {course: Course, index: number, owner: boolean }) => {
    return(
        <div  className="max-h-fit flex flex-row-reverse md:flex-col gap-2 overflow-hidden p-2 md:p-0 
        bg-prePrimary rounded-lg  shadow-sm shadow-slate-700 dark:shadow-black drop-shadow-sm">
            
            <div className="w-28 flex flex-col justify-between  md:w-full   ">
                <Image src={course.image} alt={course.name} height={128} width={205}
                 className=" h-28 md:h-32 md:w-full w-28 object-cover rounded-lg md:rounded-none "/>
                <div className="flex flex-row justify-between md:hidden">
                    <Link href={`/course/${course.id}`} className="md:ml-auto text-accent hover:opacity-65 h-fit my-auto ">
                        details
                    </Link>
                    {owner ?
                        <p  className="md:ml-auto text-accent my-auto h-fit ">
                            {course.price == 0 ? "Free" : "$"+course.price}
                        </p>
                    :
                        <BuyCourse courseID={course.id} coursePrice={course.price} />
                    }
                </div>
            </div>
            <div className="flex flex-col justify-start flex-1 gap-2 text-secondary md:px-2 ">
                <h2 className=" font-bold text-xl   ">{course.name}</h2>
                <p className="h-16 mb-3 overflow-y-clip font-light text-sm opacity-65 ">
                    {course.description}
                </p>
                <div className="md:hidden p-1 bg-gray-400 bg-opacity-20 rounded-md flex flex-row items-center 
                    gap-1 relative text-sm/4 w-fit ">
                    <Package size={14} className="w-[14] h-[14]  "/> {course.modules.length}
                </div>
            </div>
            <div className="md:flex flex-row justify-between hidden gap-3 text-sm px-2 md:pb-2 ">
                <div className="p-1 bg-gray-400 bg-opacity-20  rounded-md flex flex-row items-center gap-1 relative text-sm/4 ">
                    <Package size={14} className="w-[14] h-[14]  "/> {course.modules.length}
                </div>
                <Link href={`/course/${course.id}`} className="md:ml-auto text-accent hover:opacity-65 h-fit my-auto ">
                    details
                </Link>
                {owner ?
                    <p  className=" text-accent my-auto h-fit ">
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