
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
        <div className="lg:w-1/2 w-3/4 ml-auto flex flex-row gap-4 ">
            {search ?
              <div className="hidden md:flex flex-row flex-1 ">
                <Search />
              </div>
            : null}
            <div className="ml-auto flex flex-row gap-4 ">

              {userID ? 
                <>
                  <Link href={`/user/${userID}`} className="ml-auto h-full hidden sm:grid place-items-center grid-flow-col gap-1 hover:opacity-65">
                    <Store size={20} className="text-tertiary " />
                    <span className="text-sm text-tertiary ">Store</span>
                  </Link>
                  <Link href={`/bucket`} className="h-full hidden sm:grid place-items-center grid-flow-col gap-1 hover:opacity-65">
                    <ShoppingCart size={20} className="text-tertiary my-auto" />
                    <span className="text-sm text-tertiary ">Bucket</span>
                  </Link>
                  <Link href={`/inventory`} className="h-full hidden sm:grid place-items-center grid-flow-col gap-1 hover:opacity-65">
                    <ShoppingBag size={20} className="text-tertiary my-auto" />
                    <span className="text-sm text-tertiary ">Inventory</span>
                  </Link>
                </>
              : null}
              <UserIco userImage={userImage } userID={userID}/>
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