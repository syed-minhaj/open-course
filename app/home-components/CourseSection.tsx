import CoursePreview from "../components/CoursePreview"
import { prisma } from "../lib/prisma"
import { Course } from "../types"
import PageChanger from "../components/PageChnager"
import Discover from "./Discover"

const coursesperPage = 8;
const getCourses = async(page : string | undefined , query : string | undefined) => {
  const pageNumber = (page ? Number(page) : 1) ;
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
    skip: (pageNumber - 1) * coursesperPage,
    take: coursesperPage,
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

const getfeaturedCourses = async() => {
  return await prisma.course.findMany({
    where: {
        id : {
            in: [
                 "a6efb9c9-d2df-4af8-92f3-9d955d00897b" , 
                 "fc4c8c84-6e61-4b2b-b4bc-73520b42429b" ,
                 "32dab459-cb4e-44fe-b56f-44c076a380f3" ,
                 "254a7935-d1f4-4b09-bd58-045465fab6a1"
                ]
        }
    },
    select : {
        id : true,
        name : true,
        image : true
    }
  })
}

const CourseSection = async({page , query , userID}:{ page:string | undefined , query:string | undefined , userID:string | undefined }) => {

    const course = await getCourses(page , query);
    const total = await getTotal(query);
    return (
        <>
            <div className=" grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2 mt-4 ">
                {!query && (!page || (Number(page) == 1)) ?
                    <Discover courses={await getfeaturedCourses()} />
                : null }
                {course.map(async (course : Course , index : number)=>{
                    const courseOwner = await getCourseOwner(course.id);
                    function isOwner(){
                      if(userID === course.creatorId){
                        return true;
                      }else if(courseOwner && courseOwner.buyers.some(buyer => buyer.id === userID)){
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
            <PageChanger currentPage={Number(page ?? 1)} totalPages={Math.ceil(total / coursesperPage)} />
        </>
    )
}

export default CourseSection;