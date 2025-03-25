

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



const Viewer = async(email : string | undefined | null) => {
    if(!email){
        return ;
    }
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        select: {
            id : true,
            image: true
        }
    })
    if(!user){
        redirect('/')
    }
    return user;
}


export async function generateMetadata({
  params,
}: {
  params: any;
}) {
  const {id} = await params;
  if (!id) {
    redirect('/');
  }
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      bio: true,
    },
  });
  if (!user) {
    redirect('/');
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

    if (!user ){
        redirect('/')
    }

    const isAdmin = () => {
        if (session && session.user && session.user.email == user.email) {
            return true;
        }else{
            return false;
        }
    }
    
    const viewer = await Viewer(session?.user?.email);
    
    
    return (
        <div className="flex flex-col items-center  min-h-screen backgroundGradient relative ">
            <header className="w-full">
                <Navbar  userImage={viewer?.image} userID={viewer?.id}/>
            </header>
            <main className="md:w-9/12 w-11/12 flex flex-col md:mt-14 mt-10 
                            space-y-5 divide-y divide-gray-300 dark:divide-gray-700  ">
                <Profile user={user} admin={isAdmin()} id={id} />
                <div className="py-5">
                    <CourseSection userID={id} admin={isAdmin()} />
                </div>
            </main>
        </div>
    )
}