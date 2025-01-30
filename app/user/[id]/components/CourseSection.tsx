"use client"
import { adminUser, nonAdminUser , Course} from "@/app/types";
import { useState , Suspense } from "react";
import CreationWindow from "./courseSection/CreationWindow";
import {PackagePlus} from "lucide-react";
import CoursePreview from "@/app/components/CoursePreview";

const CourseSection = ({user, admin , course} : {user: adminUser | nonAdminUser, admin: boolean, course: Course[]}) => {
    
    const [windowOpen , setWindowOpen] = useState(false);
    
    return(
        <div className="w-full min-h-36 flex flex-col gap-2 ">
            {admin ? 
            <>
            <div className="flex flex-col  w-full ">
                <button onClick={()=>{setWindowOpen(true)}}
                 className="ml-auto p-1 px-2 rounded bg-secondary text-prePrimary flex flex-row ">
                    <PackagePlus className="w-6 h-6 text-prePrimary px-1" /> Create
                </button>
            </div>

            {windowOpen ? 
                <Suspense fallback={<div className="w-screen h-screen fixed top-0 left-0 z-20  
                    bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"></div>}>
                    <CreationWindow user={user} admin={admin} setWindowOpen={setWindowOpen} /> 
                </Suspense>
            : null}
            </>
            : null
            }
            <div className="w-full min-h-48 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2  ">
                {course.map((course , index  )=>{
                    return(
                        <div key={course.id} className="">
                            <CoursePreview course={course} index={index} admin={admin}  />
                        </div>
                    )
                })}
            </div>
            
            
        </div>
    )
}

export default CourseSection;