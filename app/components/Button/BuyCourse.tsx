"use client";
import { BuyCourse as BuyCourseFunc } from "@/app/actions/course";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { revalidatePath_fromClient } from "@/app/actions/actions";
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner";

const BuyCourse = ({courseID , coursePrice} : {courseID : string , coursePrice : number}) => {

    const [buying , setBuying] = useState(false);
    const path = usePathname();

    function buy(){
        setBuying(true);
        BuyCourseFunc(courseID).then((res)=>{
            if(res.err){
                toast.error(res.err);
                setBuying(false);
                return;
            }
            if(res.paymentURl){
                window.location.href = res.paymentURl;
            }else{
                revalidatePath_fromClient(path);
            }
        })
    }
    
    return (
        <button onClick={buy} disabled={buying}
             className="bg-accent p-1 rounded-md text-[--color-primary] disabled:opacity-50 ">
            {buying ? <Loader2Icon className="animate-spin  mr-1" /> : null}
            {coursePrice == 0 ? "Free" : "$"+coursePrice}
        </button>
    )
}

export default BuyCourse;