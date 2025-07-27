"use client";
import { useState } from "react";
import { createStripeAccount } from "@/app/actions/actions";

const AddButton = () => {
    
    const [adding , setAdding] = useState(false);
    function addStripeID(){
        setAdding(true);
        createStripeAccount().then((res)=>{
            if(res.err){
                alert(res.err);
                setAdding(false);
                return;
            }
            console.log(res)
            if(res.accountLink){
                window.location.href = res.accountLink;
            }
        })
    }

    return (
        <button onClick={addStripeID} className="bg-accent p-1 px-2 rounded-md text-[--color-primary] 
                disabled:opacity-50 mt-7 " disabled={adding}>
            Add Stripe ID
        </button>
    )
}

export default AddButton;