
import React from "react";
import UserIco from "../../../components/UserIco";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getUserImage(email:string){
  return await prisma.user.findUnique({
    where: {
        email: email
    },
    select: { 
      image: true,
    }
  })
}

const Navbar = async() => {
  const session =await  getServerSession();

  if(!session || !session.user || !session.user.email){
    redirect("/")
  }
  const userEmail = session.user.email;
  const userImage = await getUserImage(userEmail);
  if (!userImage) {
    redirect("/")
  }
  return (
      <div className=" flex static  gap-4 p-4   h-[70px]">
        <h1 className="font-bold text-tertiary grid place-items-center">
            <span>OpenCourse</span>
        </h1>
        <UserIco userImage={userImage.image }/>
      </div>
  );
};

export default Navbar;