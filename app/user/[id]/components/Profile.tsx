"use client";
import { adminUser, nonAdminUser } from "@/app/types";
import Edit from "./Edit";
import { changeUserBio, changeImage } from "@/app/actions/actions";
import { resizeFile } from "@/app/utils/imageResize";
import Image from "next/image";
import { useState  } from "react";
import NameComponent from "./profile/NameComponent";
import BioComponent from "./profile/BioComponent";
import ImageComponent from "./profile/ImageComponent";
import StripeAccountComponent from "./profile/StripeAccountComponent";

const Profile = ({user , admin , id} : {user: adminUser | nonAdminUser, admin: boolean, id: string}) => {
    
    
    return (
        <>
            <div className="gap-5 w-full flex flex-col md:flex-row  ">
                
                <div className="relative inline-block w-28 md:w-36">
                    <ImageComponent user={user} admin={admin} />
                </div>
                <div className="h-fit w-fit flex-1 rounded-lg  " >
                    <NameComponent user={user} admin={admin} />
                    <StripeAccountComponent user={user} admin={admin} />
                </div>
            </div>
            <div className="pt-5">
                <div className="w-full  ">
                    <BioComponent user={user} admin={admin} />
                </div>
            </div>
        </>
    )
}

export default Profile;