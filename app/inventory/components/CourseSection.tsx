import CoursePreview from "../../components/CoursePreview"
import { prisma } from "@/app/lib/prisma"
import { Course } from "../../types"
import PageChanger from "../../components/PageChnager"
import { getImageFromStorage } from "@/app/actions/image"

const getCoursesByBuyers = async(page : string | undefined , query : string | undefined , userID : string) => {
  const pageNumber = (page ? Number(page) : 1) || 3;
  
  const courses = await prisma.user.findFirst({
    where: {
        id : userID,
    },
    select: {
        purchasedCourses: {
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
            take: 2
        }
    },
  })
  if (!courses){ return [] }
  await Promise.all(courses.purchasedCourses.map(async(course : Omit<Course , "modules">) => {
    course.image = await getImageFromStorage(course.image);
  }))
  return courses.purchasedCourses;
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



const CourseSection = async({page , query , userID}:{ page:string | undefined , query:string | undefined , userID:string  }) => {

    const course = await getCoursesByBuyers(page , query , userID);
    const total = await getTotal(query);
    return (
        <>
            <div className=" grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 ">
                
                {course.map(async (course : Omit<Course , "modules"> , index : number)=>{
                    return(
                        <div key={course.id} className="">
                            <CoursePreview course={course} index={index}  />
                        </div>
                    )
                })}
            </div>
            <PageChanger currentPage={Number(page ?? 1)} totalPages={10} />
        </>
    )
}

export default CourseSection;