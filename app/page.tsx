
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import Navbar from "./components/Navbar";
import { Course } from "@/app/types";
import RemoveSearch from "./home-components/RemoveSearch";
import dynamic from "next/dynamic";

const CourseSection = dynamic (() => import("./home-components/CourseSection") , {
        loading: () => <div className="h-32 flex flex-row-reverse md:flex-col gap-2 w-full mt-4 
        bg-prePrimary rounded-lg p-2 shadow-sm shadow-slate-700 dark:shadow-black drop-shadow-sm "></div>,
})

const getUserByEmail = async (email:string) => {
  return await  prisma.user.findUnique({
    where: {
      email: email
    }
  })
}

export default async function Home({searchParams}:any) {
  const {page} = await searchParams;
  const {query} = await searchParams;
  //const a = performance.now()
  //const course = await getCourses(page , query);
  //const b = performance.now()
  const session = await getServerSession();
  //const c = performance.now()
  //console.log(b-a , c-b )
  // start timer
  const start = performance.now() ;
  //const total = await getTotal(query);
  const end = performance.now();
  console.log(6 , end-start);
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
    <div className="flex flex-col  min-h-screen bg-primary ">
      <Navbar userImage={user.image} userID={user.id}/>
      <main className="md:w-9/12 w-11/12 mx-auto my-2 ">
        {query ? 
          <RemoveSearch />
        : null}
        <CourseSection  page={page} query={query} />
      </main>
    </div>
  );
}

