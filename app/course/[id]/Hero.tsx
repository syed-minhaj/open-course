"use client"

import ExpandableDescription from "./components/DescriptionComponent";
import { DeleteCourse } from "@/app/actions/course";
import OrderSection from "./components/OrderSection";
import { useState } from "react";
import { revalidatePath_fromClient } from "@/app/actions/actions";

type course = {
    id: string,
    name: string,
    description: string,
    price: number,
    image: string
}

const Hero = ({owned ,  course , inCart , admin} : {owned : boolean , course : course , inCart : boolean , admin : boolean }) => {

    const [deleting , setDeleting] = useState(false);
    function deleteCourse(){
        if(!confirm("Are you sure you want to delete this course?")){
            return;
        }
        setDeleting(true);
        DeleteCourse(course.id).then(()=>{
            alert(`${course.name} deleted `);
            revalidatePath_fromClient(document.referrer);
            window.history.back();
        })
    }

    return(
        <div style={{backgroundImage: `url(${course.image})`}}
        className="min-h-[clac(65vh+70px)] w-full z-10 text-primary flex bg-cover justify-center relative bg-center ">
            <div className="bg-white dark:bg-black absolute top-0 right-0 left-0 bottom-0 opacity-65 dark:opacity-65 z-20  backdrop-blur-md "></div>
            <div className="w-11/12 my-[20dvh] mt-[calc(20vh+70px)] z-30 text-primary ">
                <h1 className="text-4xl font-bold  ">
                    {course.name}
                </h1>
                <ExpandableDescription description={course.description} />
                {!owned ? 
                    <OrderSection courseID={course.id} coursePrice={course.price} inCart={inCart} />
                : null }
                {admin ? 
                    <button onClick={deleteCourse} disabled={deleting}
                            className=" bg-red-600 bg-opacity-10 hover:bg-opacity-25 text-red-600 border 
                                        border-red-600 p-1 px-2 rounded disabled:opacity-50 my-2 "> 
                        Remove Coures 
                    </button>
                : null }
            </div>
        </div>
    )
}

export default Hero;