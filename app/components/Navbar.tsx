
import React from "react";
import UserIco from "./Navbar-components/UserIco";
import {Store , ShoppingCart, ShoppingBag} from "lucide-react";
import Search from "./Navbar-components/Search";
import Link from "next/link";

const Navbar = async({userImage , userID , search } : {userImage : string | undefined, userID : string | undefined , search? : true }) => {
  
  return (
      <>
      <div className=" flex static  gap-4 p-4   h-[70px]">
        <h1 className="font-bold text-tertiary grid place-items-center">
            <Link href={'/'}>OpenCourse</Link>
        </h1>
        <div className="w-1/2 ml-auto flex flex-row gap-2 ">
            {search ?
              <div className="hidden md:flex flex-row flex-1 ">
                <Search />
              </div>
            : null}
            <div className="ml-auto flex flex-row gap-2 ">

              {userID ? 
                <>
                  <Link href={`/user/${userID}`} className="ml-auto h-full grid place-items-center">
                    <Store size={28} className="text-tertiary " />
                  </Link>
                  <Link href={`/bucket`} className="h-full grid place-items-center">
                    <ShoppingCart size={28} className="text-tertiary my-auto" />
                  </Link>
                  <Link href={`/inventory`} className="h-full grid place-items-center">
                    <ShoppingBag size={28} className="text-tertiary my-auto" />
                  </Link>
                </>
              : null}
              <UserIco userImage={userImage }/>
            </div>
        </div>
      </div>
      {search ? 
        <div className="md:hidden mx-auto w-11/12 flex flex-row  ">
          <Search />
        </div>
        : null
      }
      </>
  );
};

export default Navbar;