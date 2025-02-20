import CoursePreview from "../components/CoursePreview"
import { prisma } from "../lib/prisma"
import { Course } from "../types"
import PageChanger from "./PageChnager"

const getCourses = async(page : string | undefined , query : string | undefined) => {
  const pageNumber = (page ? Number(page) : 1) || 3;
  console.log(pageNumber);
  const courses = await prisma.course.findMany({
    where: query ? {
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: query,
            mode: 'insensitive'
          }
        }
      ]
    } : undefined,
    orderBy: {
      avgRating: 'desc'
    },
    skip: ((pageNumber - 1) * 2) ,
    take: 2,
    include:{
      modules: true
    },
  })
  courses.forEach((course : Course) => {
    course.modulesCount = course.modules.length;
  })
  return courses;
}

const getTotal = async(query : string | undefined) => {
  const total = await prisma.course.count({
    where: query ? {
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: query,
            mode: 'insensitive'
          }
        }
      ]
    } : undefined,
  });
  return total;
}

const getCourseOwner = async(id : string) => {
    return await prisma.course.findUnique({
        where: {
            id: id
        },
        select: {
            buyers:{
                select:{
                    id: true,
                }
            }
        }
    })
}

const CourseSection = async({page , query , userID}:{ page:string | undefined , query:string | undefined , userID:string }) => {

    const course = await getCourses(page , query);
    const total = await getTotal(query);
    return (
        <>
            <div className=" grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2 mt-4 ">
                {!query && (!page || (Number(page) == 1)) ?
                    <div className="bg-prePrimary rounded-lg  col-span-full h-[280px] w-full p-2 shadow-sm shadow-slate-700 
                        dark:shadow-black drop-shadow-sm ">
                    </div>
                : null }
                {course.map(async (course : Course , index : number)=>{
                    const courseOwner = await getCourseOwner(course.id);
                    function isOwner(){
                      if(userID == course.creatorId){
                        return true;
                      }else if(courseOwner && courseOwner.buyers.some(buyer => buyer.id == userID)){
                        return true;
                      }else{
                        return false;
                      }
                    }
                    return(
                        <div key={course.id} className="">
                            <CoursePreview course={course} index={index} owner={isOwner()}  />
                        </div>
                    )
                })}
            </div>
            <PageChanger currentPage={Number(page ?? 1)} totalPages={10} />
        </>
    )
}

export default CourseSection;