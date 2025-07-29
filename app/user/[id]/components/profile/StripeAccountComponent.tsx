import { adminUser, nonAdminUser } from "@/app/types";
import Link from "next/link";
import EditStripeAccountComponent from "./EditStripeAccountComponent";

const StripeAccountComponent = ({user, admin} : {user: adminUser | nonAdminUser, admin: boolean}) => {
    
    if(!admin){
        return null;
    }
    const accountExists = (user as adminUser).stripeId != null;
    return (
        <div className="mt-2">{
            accountExists ? 
            <EditStripeAccountComponent  />
            :
            <Link href={"/createStripeAccount"} className="bg-secondary p-[6px] 
            rounded-md dark:text-gray-700 text-gray-200 text-sm  ">
                Create Stripe Account
            </Link>
        }</div> 
    )   

}

export default StripeAccountComponent;