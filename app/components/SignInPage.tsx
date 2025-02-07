
import React from "react";
import { getServerSession } from "next-auth";
import SignInButt from "./Button/SignIn";
const SignInPage = async({
  children
} : {
  children: React.ReactNode;
}) => {
  const session = await getServerSession();
  if (session && session.user) {
    return (
        <div>{children}</div>

    );
  }
  else  {
    return (
      <div className="h-screen bg-primary">
        <div className=" pt-4 pl-4 font-bold text-tertiary " >Open-Course</div>
        <div className="pt-40   flex flex-row  justify-center items-start ">
          <div className="flex flex-col items-center justify-around  ">
            <div>
            You are currently not login. Pless sign in first
            </div>
            <SignInButt />
          </div>
        </div>
      </div>

  );}
  
    

}

export default SignInPage;