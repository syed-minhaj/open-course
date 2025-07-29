"use client";
import {stripeAccountDashboard , editStripeAccount} from "@/app/actions/actions";
import { useState } from "react";

const EditStripeAccountComponent = () => {
    const [loading , setLoading] = useState(false);
    const Dashboard =  () => {
        setLoading(true);
        stripeAccountDashboard().then((res)=>{
            if(res.err){
                alert(res.err);
                setLoading(false);
                return;
            }
            if(res.loginLink){
                window.location.href = res.loginLink;
            }
        });
    }
    const editStripe =  () => {
        setLoading(true);
        editStripeAccount().then((res)=>{
            if(res.err){
                alert(res.err);
                setLoading(false);
                return;
            }
            if(res.updateLink){
                window.location.href = res.updateLink;
            }
        });
    }
    return (
        <>
            <button onClick={Dashboard} disabled={loading} className="bg-secondary p-[6px] mr-2
            rounded-md dark:text-gray-700 text-gray-200 text-sm disabled:opacity-60 ">
                Stripe Account Dashboard
            </button>
            <button onClick={editStripe} disabled={loading} className="bg-secondary p-[6px] 
            rounded-md dark:text-gray-700 text-gray-200 text-sm disabled:opacity-60 ">
                Edit Stripe Account
            </button>
        </>
    )
}

export default EditStripeAccountComponent; 