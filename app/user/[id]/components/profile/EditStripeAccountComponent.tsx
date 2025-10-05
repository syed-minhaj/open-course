"use client";
import {stripeAccountDashboard , editStripeAccount} from "@/app/actions/actions";
import { useState } from "react";
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner";

const EditStripeAccountComponent = () => {
    const [loadingDashboard , setLoadingDashboard] = useState(false);
    const [loadingEditStripe , setLoadingEditStripe] = useState(false);
    const Dashboard =  () => {
        setLoadingDashboard(true);
        stripeAccountDashboard().then((res)=>{
            if(res.err){
                toast.error(res.err);
                setLoadingDashboard(false);
                return;
            }
            if(res.loginLink){
                window.location.href = res.loginLink;
            }
        });
    }
    const editStripe =  () => {
        setLoadingEditStripe(true);
        editStripeAccount().then((res)=>{
            if(res.err){
                toast.error(res.err);
                setLoadingEditStripe(false);
                return;
            }
            if(res.updateLink){
                window.location.href = res.updateLink;
            }
        });
    }
    return (
        <>
            <button onClick={Dashboard} disabled={loadingDashboard || loadingEditStripe} className="bg-secondary p-[6px] mr-2
            rounded-md dark:text-gray-700 text-gray-200 text-sm disabled:opacity-60 flex flex-row items-center ">
                {loadingDashboard ? <Loader2Icon className="animate-spin  mr-1" /> : null}
                Stripe Account Dashboard
            </button>
            <button onClick={editStripe} disabled={loadingDashboard || loadingEditStripe} className="bg-secondary p-[6px] 
            rounded-md dark:text-gray-700 text-gray-200 text-sm disabled:opacity-60 flex flex-row items-center ">
                {loadingEditStripe ? <Loader2Icon className="animate-spin  mr-1" /> : null}
                Edit Stripe Account
            </button>
        </>
    )
}

export default EditStripeAccountComponent; 