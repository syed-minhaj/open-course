"use client";
import React, { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ModeIco from "./Mode";
import Link from "next/link";
import Image from 'next/image';

interface userInfo {
  id: number;
  name: string | null;
  image: string | null;
  email: string | null;
} 

const UserIco = ({userImage}:{userImage : string}) => {
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);
    const [open , setOpen] = useState(false)
    //const [image , setImage] = useState<string | undefined>(undefined);
    const [v , setV] = useState<number>(Date.now());
    
    useEffect(() => {
        setMounted(true);
        setV(Date.now());
        console.log(Date.now());
    }, []);

    

    if (!mounted) {
        return null;
    }

    
  
    return (
      
      <div className="flex flex-col gap-2 ml-auto z-30 ">
            <button onClick={() => {setOpen(!open)}}
             className="flex rounded-full  p-1 ml-auto ">
                <Image 
                    className="rounded-full h-8 w-8 " 
                    src={`${userImage}`} 
                    alt="no img" 
                    height={32} width={32} />
            </button>
            {open &&
            <div className="gap-2 w-fit flex flex-col">
                <button className={`px-2 py-1 bg-slate-500  rounded text-gray-50 `} ><ModeIco/></button>
                <button onClick={() => signOut()}
                        className={`px-2 py-1 bg-red-500 rounded text-gray-50  `} >
                            sign out
                </button>
            </div>
            }
      </div>
      
     
    );
  
};



export default UserIco;