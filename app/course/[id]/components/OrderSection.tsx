"use client"
import { ShoppingCart } from "lucide-react";
import { BuyCourse } from "@/app/actions/course";
import { AddToCart as AddToCartAction } from "@/app/actions/course";
import { useState } from "react";
import { revalidatePath_fromClient } from "@/app/actions/actions";

const OrderSection = ({courseID , coursePrice} : {courseID : string , coursePrice : number}) => {

    const [addingToCart , setAddingToCart] = useState(false);
    const [buying , setBuying] = useState(false);

    function Buy(){
            setBuying(true);
            if(!confirm("Are you sure you want to buy this course?")){
                setBuying(false);
                return;
            }
            BuyCourse(courseID).then(({err})=>{
                if(err){
                    alert(err);
                    setBuying(false);
                    return;
                }
                revalidatePath_fromClient(`/course/${courseID}`);
            })
    }

    function AddToCart(){
        setAddingToCart(true);
        AddToCartAction(courseID).then(({err})=>{
            setAddingToCart(false);
            if(err){alert(err)}
        })
    }

    return(
            <div className="flex gap-1 flex-col sm:flex-row-reverse sm:w-fit font-semibold mt-5 ">
                <button onClick={Buy} disabled={buying}
                className="p-2 rounded bg-accent text-[--color-primary] min-w-[91] disabled:opacity-45 "> 
                    { coursePrice == 0 ? 'Free' : '$'+coursePrice }
                </button>
                <button onClick={AddToCart} disabled={addingToCart}
                className="p-2 rounded border border-accent flex flex-row justify-center min-w-[91] disabled:opacity-45 "> 
                    <ShoppingCart />
                    Cart 
                </button>
            </div>
        
    )
}

export default OrderSection;