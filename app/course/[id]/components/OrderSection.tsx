"use client"
import { ShoppingCart } from "lucide-react";
import { BuyCourse } from "@/app/actions/course";
import { AddToCart , RemoveFromCart } from "@/app/actions/course";
import { useState } from "react";
import { revalidatePath_fromClient } from "@/app/actions/actions";
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner";

const OrderSection = ({courseID , coursePrice , inCart} : {courseID : string , coursePrice : number , inCart : boolean}) => {

    const [disableCart , setDisableCart] = useState(false);
    const [buying , setBuying] = useState(false);

    function Buy(){
            setBuying(true);
            BuyCourse(courseID).then((res)=>{
                if(res.err){
                    toast.error(res.err);
                    setBuying(false);
                    return;
                }
                if(res.paymentURl){
                    window.location.href = res.paymentURl;
                }
                revalidatePath_fromClient(`/course/${courseID}`);
            })
    }

    function confirmBuy(){
        toast.info('Are you sure you want to buy this course?',{
            id: 'buyCourse',
            action:{
                label: 'Yes',
                onClick: () => Buy()
            }
        });
    }

    function OnCartClick(){
        setDisableCart(true);
        if(inCart){
            RemoveFromCart(courseID).then(({err})=>{
                setDisableCart(false);
                revalidatePath_fromClient(`/course/${courseID}`);
                if(err){toast.error(err)}
            })
        }else{
            AddToCart(courseID).then(({err})=>{
                setDisableCart(false);
                revalidatePath_fromClient(`/course/${courseID}`);
                if(err){toast.error(err)}
            })
        }
    }

    return(
            <div className="flex gap-2 flex-col sm:flex-row sm:w-fit font-semibold mt-5 ">
                <button onClick={confirmBuy} disabled={buying}
                className="p-2 rounded-lg bg-accent flex flex-row justify-center text-[--color-primary] min-w-[91] disabled:opacity-45 "> 
                    {buying ? <Loader2Icon className="animate-spin  mr-1" /> : null}
                    { coursePrice == 0 ? 'Free' : '$'+coursePrice }
                </button>
                <button onClick={OnCartClick} disabled={disableCart}
                className="p-2 rounded-lg border border-accent flex flex-row justify-center min-w-[91] disabled:opacity-45 "> 
                    {disableCart ? <Loader2Icon className="animate-spin  mr-1" /> : null}
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