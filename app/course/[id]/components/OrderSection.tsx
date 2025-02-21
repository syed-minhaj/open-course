"use client"
import { ShoppingCart } from "lucide-react";
import { BuyCourse } from "@/app/actions/course";
import { AddToCart , RemoveFromCart } from "@/app/actions/course";
import { useState } from "react";
import { revalidatePath_fromClient } from "@/app/actions/actions";

const OrderSection = ({courseID , coursePrice , inCart} : {courseID : string , coursePrice : number , inCart : boolean}) => {

    const [disableCart , setDisableCart] = useState(false);
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

    function OnCartClick(){
        setDisableCart(true);
        if(inCart){
            RemoveFromCart(courseID).then(({err})=>{
                setDisableCart(false);
                revalidatePath_fromClient(`/course/${courseID}`);
                if(err){alert(err)}
            })
        }else{
            AddToCart(courseID).then(({err})=>{
                setDisableCart(false);
                revalidatePath_fromClient(`/course/${courseID}`);
                if(err){alert(err)}
            })
        }
    }

    return(
            <div className="flex gap-1 flex-col sm:flex-row-reverse sm:w-fit font-semibold mt-5 ">
                <button onClick={Buy} disabled={buying}
                className="p-2 rounded bg-accent text-[--color-primary] min-w-[91] disabled:opacity-45 "> 
                    { coursePrice == 0 ? 'Free' : '$'+coursePrice }
                </button>
                <button onClick={OnCartClick} disabled={disableCart}
                className="p-2 rounded border border-accent flex flex-row justify-center min-w-[91] disabled:opacity-45 "> 
                    <ShoppingCart />
                    {inCart ?
                        " Remove"
                    :
                        " Cart" 
                    }
                </button>
            </div>
        
    )
}

export default OrderSection;