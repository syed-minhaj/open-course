"use client"
import { ShoppingCart } from "lucide-react";
import ExpandableDescription from "./components/DescriptionComponent";
import { BuyCourse } from "@/app/actions/course";
import OrderSection from "./components/OrderSection";

type course = {
    id: string,
    name: string,
    description: string,
    price: number,
    image: string
}

const Hero = ({owned ,  course} : {owned : boolean , course : course}) => {

    function Buy(){
        if(!owned){
            // do you want to buy this course
            alert("You want to buy this course");
            
            BuyCourse(course.id).then(()=>{
                alert("Course bought");
            })
        }
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
                    <OrderSection courseID={course.id} coursePrice={course.price} />
                : null }
                
            </div>
        </div>
    )
}

export default Hero;