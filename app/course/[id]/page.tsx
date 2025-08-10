
import { prisma } from "@/app/lib/prisma";
import { Course as CourseType , module } from "@/app/types";
import Navbar from "@/app/components/Navbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Hero from "./Hero";
import ModulesSection from "./ModulesSection";
import { getImageFromStorage } from "@/app/actions/image";

type Course = CourseType & {
    buyers : {id : string}[]
    inCart : {id : string}[]
}

const getCourseById = async(id:string) => {
    const course : Course | null = await prisma.course.findUnique({
        where: {
            id: id
        },
        include: {
            modules: {
                orderBy : {
                    indexInCourse : "asc"
                },
            } ,
            buyers: {
                select: {
                    id: true
                }
            },
            inCart:{
                select:{
                    id: true
                }
            }
        }
    })
    if(!course){return null}
    course.image = await getImageFromStorage(course.image);
    await Promise.all(course.modules.map(async(module : module) => {
        if(module.image){ module.image = await getImageFromStorage(module.image);}
    }))
    return course;
}

const getUserByEmail = async(email :string | null | undefined) => {
    if (!email){return null}
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        select:{
            id : true,
            image : true
        }
    })
    return user;
}

const userInList = async (userId : string | undefined , users : {id : string}[] ) => {
    if(!userId){
        return false;
    }
    return users.some((user : {id: string })=>{
        return user.id == userId
    })
}

export async function generateMetadata({
  params,
}: {
  params: any;
}) {
    if(!params || !params.id){
        return null;
    }
  const course = await prisma.course.findUnique({
    where: {
      id: params.id,
    },
    select: {
      name: true,
      description: true,
    },
  });
  if (!course) {
    return null;
  }
  return {
    title: course.name,
    description: course.description,
  };
}


export default async function CoursePage({params} : {params : any}) {
   
    const {id} = await params;
    if (!id){
        redirect('/')
    }
    const session = await getServerSession();
    
    
    const [course , user] : [Course | null , {id: string , image : string} | null] = await Promise.all([
        getCourseById(id),
        getUserByEmail(session?.user?.email)
    ])

    

    if(!course ){
        return (
            <div className="flex flex-col items-center justify-center min-h-screen backgroundGradient relative ">
                <h1 className="text-4xl font-bold m-2 ">
                    Course not found
                </h1>
                <a href={'/'} className="m-2 p-2 rounded bg-prePrimary text-xl ">Home</a>
            </div>
        )
    }

    const Admin = () => {
        if(user && (user.id == course.creatorId)){
            return true;
        }else{
            return false;
        }
    }
    const owned = async() => {
        if(!user){return false}
        else if (Admin()){return true;}
        else {
            return await userInList(user.id, course.buyers)
        }
    }
    const inCart = await userInList(user?.id, course.inCart);

    return (
        <div className="flex flex-col items-center  min-h-screen  backgroundGradient relative ">
            <header className="w-full z-40 ">
                <Navbar  userImage={user?.image} userID={user?.id}/>
            </header>
            <main className="w-full flex flex-col items-center absolute top-0  backgroundGradient ">
                <Hero owned={await owned()} inCart={inCart} admin={Admin()}
                course={{id : course.id , name : course.name , description : course.description , price : course.price , image: course.image}} />
                <ModulesSection modules={course.modules} owned={await owned()}  />
            </main>
        </div>
    )
}

