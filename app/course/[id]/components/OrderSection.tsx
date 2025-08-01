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
            BuyCourse(courseID).then((res)=>{
                if(res.err){
                    alert(res.err);
                    setBuying(false);
                    return;
                }
                if(res.paymentURl){
                    window.location.href = res.paymentURl;
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
            <div className="flex gap-2 flex-col sm:flex-row sm:w-fit font-semibold mt-5 ">
                <button onClick={Buy} disabled={buying}
                className="p-2 rounded-lg bg-accent text-[--color-primary] min-w-[91] disabled:opacity-45 "> 
                    { coursePrice == 0 ? 'Free' : '$'+coursePrice }
                </button>
                <button onClick={OnCartClick} disabled={disableCart}
                className="p-2 rounded-lg border border-accent flex flex-row justify-center min-w-[91] disabled:opacity-45 "> 
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