

import { prisma } from "@/app/lib/prisma";
import Navbar from "@/app/components/Navbar";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { adminUser, nonAdminUser } from "@/app/types";
import Profile from "./components/Profile";
import { Course  } from "@/app/types";
import dynamic from "next/dynamic";

const CourseSection = dynamic(() => import("./components/CourseSection"), {
    loading: () => <div className="h-[202px] animate-pulse flex flex-row-reverse md:flex-col gap-2 w-full 
        bg-prePrimary rounded-lg p-2 shadow-sm shadow-slate-700 dark:shadow-black drop-shadow-sm "></div>,
});

const getUser = async(id: string) : Promise<adminUser | null> => {
    return await  prisma.user.findUnique({
        where: {
            id: id
        }
    })
}



const ViewerImage = async(email : string) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        select: {
            image: true
        }
    })
    if(!user){
        redirect('/')
    }
    return user.image;
}


export async function generateMetadata({
  params,
}: {
  params: any;
}) {
  if(!params || !params.id){
    return null;
  }
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      name: true,
      bio: true,
    },
  });
  if (!user) {
    return null;
  }
  return {
    title: user.name,
    description: user.bio,
  };
}


export default async function UserPage({params} : any) {
    
    const {id} = await params;
    if (!id){
        redirect('/')
    }
    
    const [session, user] : [Session | null , adminUser | null ] = await Promise.all([
        getServerSession(),
        getUser(id)
    ]);

    if (!user || !session || !session.user || !session.user.email){
        redirect('/')
    }

    const isAdmin = () => {
        if (session && session.user && session.user.email == user.email) {
            return true;
        }else{
            return false;
        }
    }
    const viewer : nonAdminUser | null = (user ?{
        id: user.id,
        name: user.name,
        image: user.image,
        bio: user.bio
    } : null)

    if(!viewer){
        redirect('/')
    }
    
    return (
        <div className="flex flex-col items-center  min-h-screen bg-primary relative ">
            <header className="w-full">
                <Navbar  userImage={await ViewerImage(session.user.email)} userID={id}/>
            </header>
            <main className="md:w-9/12 w-11/12 flex flex-col md:mt-14 mt-10 
                            space-y-5 divide-y divide-gray-300 dark:divide-gray-700  ">
                <Profile user={user} admin={isAdmin()} id={id} />
                <div className="py-5">
                    <CourseSection user={viewer} admin={isAdmin()} />
                </div>
            </main>
        </div>
    )
}