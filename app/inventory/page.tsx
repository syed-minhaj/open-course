
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import Navbar from "../components/Navbar";
import RemoveSearch from "../components/RemoveSearch";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const CourseSection = dynamic (() => import("./components/CourseSection") , {
        loading: () => <div className="h-[202px] animate-pulse flex flex-row-reverse md:flex-col gap-2 w-full mt-4 
        bg-prePrimary rounded-lg p-2 shadow-sm shadow-slate-700 dark:shadow-black drop-shadow-sm "></div>,
})

const getUserByEmail = async (email:string) => {
  return await  prisma.user.findUnique({
    where: {
      email: email
    },
    select: {
      id: true,
      image: true
    },
  })
}

export default async function Inventory({searchParams}:any) {
  const {page} = await searchParams;
  const {query} = await searchParams;
  const session = await getServerSession();
  if(!session || !session.user || !session.user.email){
    redirect('/siginIn')
  }
  const user =  await getUserByEmail(session.user.email) ;
  if (!user){
    redirect('siginIn')
  }

  return (
    <div className="flex flex-col  min-h-screen bg-primary ">
      <Navbar userImage={user?.image} userID={user?.id} search />
      <main className="md:w-9/12 w-11/12 mx-auto my-2">
        <h1 className="text-2xl font-bold text-primary my-4 ">
            Inventory Items
        </h1>
        {query ? 
          <RemoveSearch />
        : null}
        <CourseSection  page={page} query={query} userID={user.id}/>
      </main>
    </div>
  );
}

