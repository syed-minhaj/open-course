import { ShoppingCart } from "lucide-react";
import ExpandableDescription from "./components/DescriptionComponent";

type course = {
    name: string,
    description: string,
    price: number
}

const Hero = ({course} : {course :course}) => {
    return(
        <div className="min-h-[65dvh] w-full bg-prePrimary text-primary flex  justify-center">
            <div className="w-11/12 my-[20dvh] ">
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