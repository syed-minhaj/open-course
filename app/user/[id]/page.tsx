import { prisma } from "@/app/lib/prisma";
import Navbar from "./components/Navbar";
import Main from './Main';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { adminUser, nonAdminUser } from "@/app/types";

interface PageProps {
    params: {
        id: string
    }
}

const getUser = async(id: string) => {
    return await  prisma.user.findUnique({
        where: {
            id: id
        }
    })
}

export default async function UserPage({params} : any) {
    if(!params){
        redirect('/')
    }
    const {id} = await params;
    const session = await getServerSession();
    if(!id){
        redirect('/')
    }
    const user :adminUser | null = await getUser(id);

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
        <div className="flex flex-col items-center  min-h-screen bg-primary">
            <header className="w-full">
                <Navbar />
            </header>
            <Main user={(isAdmin() ? user : viewer)} admin={isAdmin()} id={id} />
        </div>
    )
}