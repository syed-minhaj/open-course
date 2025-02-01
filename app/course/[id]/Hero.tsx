
import { ShoppingCart } from "lucide-react";
import ExpandableDescription from "./components/DescriptionComponent";

type course = {
    name: string,
    description: string,
    price: number,
    image: string
}

const Hero = ({course} : {course :course}) => {
    return(
        <div style={{backgroundImage: `url(${course.image})`}}
        className="min-h-[clac(65vh+70px)] w-full z-10 text-primary flex bg-cover justify-center relative bg-center ">
            <div className="bg-white dark:bg-black absolute top-0 right-0 left-0 bottom-0 opacity-65 dark:opacity-65 z-20  backdrop-blur-md "></div>
            <div className="w-11/12 my-[20dvh] mt-[calc(20vh+70px)] z-30 text-primary ">
                <h1 className="text-4xl font-bold  ">
                    {course.name}
                </h1>
                <ExpandableDescription description={course.description} />
                <div className="flex gap-1 flex-col sm:flex-row-reverse sm:w-fit font-semibold mt-5 ">
                    <button className="p-2 rounded bg-accent text-[--color-primary] min-w-[91] "> 
                        { course.price == 0 ? 'Free' : '$'+course.price } 
                    </button>
                    <button className="p-2 rounded border border-accent flex flex-row justify-center min-w-[91]  "> 
                        <ShoppingCart />
                        Cart 
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Hero;