import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import CourseSection from "./components/CourseSection";
import { getImageFromStorage } from "../actions/image";

const getUserByEmail = async (email:string) => {
  const user = await  prisma.user.findUnique({
    where: {
      email: email
    },
    select: {
      id: true,
      image: true,
    }
  })
  if(!user){return null}
  user.image = await getImageFromStorage(user.image);
  return user;
}

export const metadata = {
  title: "Bucket items",
  description: "OpenCourse : Market place for open sourse course . Course made using online resourses",
};

export default async function Bucket() {  
    const session = await getServerSession();
    if(!session || !session.user || !session.user.email){
        redirect('/signIn')
    }
    const user = await getUserByEmail(session.user.email);
    if(!user){
        redirect('/signIn')
    }
    return (
        <div className="flex flex-col min-h-screen backgroundGradient  ">
            <Navbar userImage={user.image} userID={user.id}/>
            <main className="md:w-9/12 w-11/12 mx-auto my-2 gap-2 ">
                <h1 className="text-2xl font-bold text-primary mt-4 ">
                    Bucket items
                </h1>
                <CourseSection userID={user.id} />
            </main>
        </div>
    )
}