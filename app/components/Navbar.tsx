
import React from "react";
import UserIco from "./Navbar-components/UserIco";
import {Store , ShoppingCart} from "lucide-react";
import Search from "./Navbar-components/Search";
import Link from "next/link";

const Navbar = async({userImage , userID} : {userImage : string , userID : string}) => {
  
  return (
      <>
      <div className=" flex static  gap-4 p-4   h-[70px]">
        <h1 className="font-bold text-tertiary grid place-items-center">
            <Link href={'/'}>OpenCourse</Link>
        </h1>
        <div className="w-1/2 ml-auto flex flex-row gap-2 ">
            <div className="hidden md:flex flex-row flex-1 ">
              <Search />
            </div>
            <Link href={`/user/${userID}`} className="ml-auto h-full grid place-items-center">
              <Store size={28} className="text-tertiary " />
            </Link>
            <Link href={`/bucket`} className="h-full grid place-items-center">
              <ShoppingCart size={28} className="text-tertiary my-auto" />
            </Link>
            <UserIco userImage={userImage }/>
        </div>
      </div>
      <div className="md:hidden mx-auto w-11/12 flex flex-row  ">
        <Search />
      </div>
      </>
  );
};

export default Navbar;