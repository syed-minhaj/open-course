"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession , signIn} from "next-auth/react";
import ModeIco from "./Mode";
import Image from "next/image";
import { ShoppingBag, ShoppingCart, Store } from "lucide-react";
import Link from "next/link";

const UserIco = ({ userImage , userID}: { userImage: string | undefined , userID : string | undefined}) => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const {data: session} = useSession();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2  z-10 ">
      <button onClick={() => {setOpen(!open);}}
        className="flex rounded-full  p-1 ml-auto h-10 w-10">
        <Image
          className="rounded-full h-8 w-8 " src={`${userImage ?? "https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg"}`}
          alt="no img" height={32} width={32} />
      </button>
      {open && (
        <div className="gap-2 w-fit flex flex-col mt-2 absolute right-4 top-[54px] z-20 ">
          {
            userID ?
            <>
				<Link href={`/user/${userID}`} className="h-full flex justify-center sm:hidden  gap-2 hover:opacity-85 px-2 py-1 bg-slate-500  rounded text-gray-50">
					<Store size={20} className="" />
					<span className="text-sm  ">Store</span>
				</Link>
				<Link href={`/bucket`} className="h-full flex justify-center sm:hidden  gap-2 hover:opacity-85 px-2 py-1 bg-slate-500  rounded text-gray-50">
					<ShoppingCart size={20} className=" " />
					<span className="text-sm ">Bucket</span>
				</Link>
				<Link href={`/inventory`} className="h-full flex justify-center sm:hidden  gap-2 hover:opacity-85 px-2 py-1 bg-slate-500  rounded text-gray-50">
					<ShoppingBag size={20} className=" " />
					<span className="text-sm  ">Inventory</span>
				</Link>
            </>
            : null

          }
          <button className={`px-2 py-1 bg-slate-500  rounded text-gray-50 `}>
            <ModeIco />
          </button>
          {session && session.user ? 
            <button onClick={() => signOut()}
              className={`px-2 py-1 bg-red-500 rounded text-gray-50  `}>
                  sign out
            </button>
          :
            <button onClick={() => signIn()}
              className={`px-2 py-1 bg-green-500 rounded text-gray-50  `}>
                  sign In
            </button>
          }
          
        </div>
      )}
    </div>
  );
};

export default UserIco;
