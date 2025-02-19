"use client";
import { BuyCourse as BuyCourseFunc } from "@/app/actions/course";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { revalidatePath_fromClient } from "@/app/actions/actions";

const BuyCourse = ({courseID , coursePrice} : {courseID : string , coursePrice : number}) => {

    const [buying , setBuying] = useState(false);
    const path = usePathname();

    function buy(){
        setBuying(true);
        BuyCourseFunc(courseID).then((res : {err : string | null}) => {
            if(res.err){
                setBuying(false);
                alert(res.err);
            }
            revalidatePath_fromClient(path)
        })
    }
    
    return (
        <button onClick={buy} disabled={buying}
             className="bg-accent p-1 rounded-md text-[--color-primary] disabled:opacity-50 ">
            {coursePrice == 0 ? "Free" : "$"+coursePrice}
        </button>
    )
}

export default BuyCourse;