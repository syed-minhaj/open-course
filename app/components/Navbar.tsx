
import React from "react";
import UserIco from "./UserIco";

const Navbar = async({userImage} : {userImage : string}) => {
  
  return (
      <div className=" flex static  gap-4 p-4   h-[70px]">
        <h1 className="font-bold text-tertiary grid place-items-center">
            <span>OpenCourse</span>
        </h1>
        <UserIco userImage={userImage }/>
      </div>
  );
};

export default Navbar;