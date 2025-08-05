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

const getfeaturedCourses = async() => {
  return await prisma.course.findMany({
    where: {
        id : {
            in: [
                 process.env.FEATURED_COURSE_1_ID ?? ""  ,
                 process.env.FEATURED_COURSE_2_ID ?? "" ,
                 process.env.FEATURED_COURSE_3_ID ?? "" ,
                 process.env.FEATURED_COURSE_4_ID ?? ""
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

const featuredCourse = await getfeaturedCourses();
const firstPageCourse = await getCourses(undefined , undefined);
const totalWithoutQuery = await getTotal(undefined);

const CourseSection = async({page , query , userID}:{ page:string | undefined , query:string | undefined , userID:string | undefined }) => {

    const course = (!query && (!page || page == '1')) ? firstPageCourse : await getCourses(page , query);
    const total = !query ? totalWithoutQuery : await getTotal(query);
    return (
        <>
            <div className=" grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4 ">
                {!query && (!page || (Number(page) == 1)) ?
                    <Discover courses={featuredCourse} />
                : null }
                {course.map(async (course : Course , index : number)=>{
                    return(
                        <div key={course.id} className="">
                            <CoursePreview course={course} index={index}   />
                        </div>
                    )
                })}
            </div>
            <PageChanger currentPage={Number(page ?? 1)} totalPages={Math.ceil(total / coursesperPage)} />
        </>
    )
}

export default CourseSection;