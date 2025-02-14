
import Link from "next/link";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import Mode from "./components/Mode";
const getUserByEmail = async (email:string) => {
  return await  prisma.user.findUnique({
    where: {
      email: email
    }
  })
}
export default async function Home() {
  const session = await getServerSession();
  if(!session || !session.user || !session.user.email){
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">
          Welcome to Open Course
        </h1>
      </div>
    )
  }
  const user = await getUserByEmail(session.user.email);
  if(!user){
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">
          Welcome to Open Course
        </h1>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary gap-10">
      <div> 
      </div>
      <div className="gap-5 h-fit">
        <div className="bg-prePrimary h-10 w-10 shadow-md"></div>
        <div className="bg-secondary h-10 w-10"></div>
        <div className="bg-tertiary h-10 w-10"></div>
        <div className="bg-accent h-10 w-10"></div>
      </div>
      <Mode/>
      <Link href={`/user/71253ed7-e0b2-43b2-9bf6-fd4c374c35fe`} className="p-1 bg-accent rounded text-[--color-primary]"> Minhaj user page </Link>
      <Link href={`/user/${user.id}`} className="p-1 bg-prePrimary rounded" > Your user page </Link>
      <div className="h-36 w-20 bg-prePrimary shadow-lg"></div>
    </div>
  );
}
