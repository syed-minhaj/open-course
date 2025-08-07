"use client"

import ExpandableDescription from "./components/DescriptionComponent";
import { DeleteCourse } from "@/app/actions/course";
import OrderSection from "./components/OrderSection";
import { useState } from "react";
import { revalidatePath_fromClient } from "@/app/actions/actions";
import { Loader2Icon } from "lucide-react"
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';

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
        setDeleting(true);
        DeleteCourse(course.id).then((res)=>{
            if(res.err){
                alert(`${res.err}`)
                return;
            }
            alert(`${course.name} deleted , will be removed from home page in few minutes`);
            revalidatePath_fromClient(document.referrer);
            window.history.back();
        })
    }

    function confirmDelete(){
        confirmAlert({
          title: 'Delete Course?',
          message: 'Are you sure you want to delete this course?',
          overlayClassName : "overlay-custom-class-name",
          buttons: [
            {
              label: 'Yes',
              onClick: () => deleteCourse(),
              style: {backgroundColor: 'rgb(220,38,38)' }
            },
            {
              label: 'No',
              onClick: () => {}
            }
          ]
        });
    }

    return(
        <div style={{backgroundImage: `url(${course.image})`}}
             className="h-[calc(65vh+70px)] w-full z-10 text-primary flex bg-cover justify-center relative bg-center rounded-b-3xl ">
            <div className="bg-white dark:bg-black absolute top-0 right-0 left-0 bottom-0 opacity-75 dark:opacity-75 z-20 rounded-b-3xl  "></div>
            <div className="w-11/12 my-[20dvh] mt-[calc(20vh+70px)] z-30 text-primary ">
                <h1 className="text-4xl font-bold font-nunito ">
                    {course.name}
                </h1>
                <ExpandableDescription description={course.description} />
                {!owned ? 
                    <OrderSection courseID={course.id} coursePrice={course.price} inCart={inCart} />
                : null }
                {admin ? 
                    <button onClick={confirmDelete} disabled={deleting}
                            className=" bg-red-600 bg-opacity-10 hover:bg-opacity-25 text-red-600 border 
                                        border-red-600 p-1 px-2 rounded-lg disabled:opacity-50 my-2 flex flex-row"> 
                        {deleting ? <Loader2Icon className="animate-spin  mr-1" /> : null}
                        Remove Coures 
                    </button>
                : null }
            </div>
        </div>
    )
}

export default Hero;