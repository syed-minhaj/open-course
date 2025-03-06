"use client";
import { adminUser, nonAdminUser } from "@/app/types";
import { useState , Suspense } from "react";
import CreationWindow from "./CreationWindow";
import {PackagePlus} from "lucide-react";

const Create = ({userID, admin} : {userID: string, admin: boolean}) => {
    const [windowOpen , setWindowOpen] = useState(false);

    return (
        <>
        <div className="flex flex-col  w-full ">
            <button onClick={()=>{setWindowOpen(true)}}
                className="ml-auto p-1 px-2 rounded bg-secondary text-prePrimary flex flex-row ">
                <PackagePlus className="w-6 h-6 text-prePrimary px-1" /> Create
            </button>
        </div>

        {windowOpen ? 
            <Suspense fallback={<div className="w-screen h-screen fixed top-0 left-0 z-20  
                bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"></div>}>
                <CreationWindow userID={userID} admin={admin} setWindowOpen={setWindowOpen} /> 
            </Suspense>
        : null}
        </>
    )
}

export default Create;