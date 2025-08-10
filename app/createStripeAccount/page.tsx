import Navbar from "../components/Navbar";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Card from "./components/Card";
import { getImageFromStorage } from "../actions/image";

const getUserByEmail = async(email :string ) => {    
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        select:{
            id : true,
            image : true,
            name : true
        }
    })
    if(!user){return null}
    user.image = await getImageFromStorage(user.image);
    return user;
}

export default async function AddStripeID() {
    
    const session = await getServerSession();
    if(!session || !session.user || !session.user.email){
        redirect('/signIn');
    }
    const user = await getUserByEmail(session.user.email);
    if(!user){
        redirect('/signIn');
    }
    
    return (
        <div className="flex flex-col  min-h-screen backgroundGradient ">
            <header className="w-full z-40 ">
                <Navbar  userImage={user.image} userID={user.id}/>
            </header>
            <Card user={{image:user.image , name:user.name}}/>
        </div>
    );
}