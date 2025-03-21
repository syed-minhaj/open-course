"use server";

import {prisma} from "../lib/prisma";
import { getServerSession } from "next-auth"
import { supabase } from "../lib/supabase";

async function getUserByEmail(email : string){
    return await prisma.user.findUnique({
        where: {
            email: email
        },
        select : {
            id: true,
        }
    })
}

export async function AddToCart(courseID : string){
    const session = await getServerSession();
    if(!session || !session.user || !session.user.email){
        return {err: "Session failed : login first "};
    }
    const user = await getUserByEmail(session.user.email);
    if(!user){
        return {err: "User not found : login first "};
    }
    await prisma.course.update({
        where: {
            id: courseID
        },
        data: {
            inCart: {
                connect: {
                    id: user.id
                }
            }
        }
    })
    return {err: null}
}

export async function RemoveFromCart(courseID : string){
    const session = await getServerSession();
    if(!session || !session.user || !session.user.email){
        return {err: "Session failed"};
    }
    const user = await getUserByEmail(session.user.email);
    if(!user){
        return {err: "User not found"};
    }
    await prisma.course.update({
        where: {
            id: courseID
        },
        data: {
            inCart: {
                disconnect: {
                    id: user.id
                }
            }
        }
    })
    return {err: null}
}

export async function BuyCourse(courseID : string){
    const session = await getServerSession();
    if(!session || !session.user || !session.user.email){
        return {err:"Session failed : login first "};
    }
    const user = await getUserByEmail(session.user.email);
    if(!user){
        return {err:"User not found : login first "};
    }
    try{
        await prisma.course.update({
            where: {
                id: courseID
            },
            data: {
                buyers: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })
    }catch(e : any){
        return {err: `${e.message} , \n
                Error while buying course , \n
                Please try again `}
    }
    try{
        await prisma.course.update({
            where: {
                id: courseID
            },
            data: {
                inCart: {
                    disconnect: {
                        id: user.id
                    }
                }
            }
        })
    }catch(e : any){
        return {err: `${e.message} `}
    }
    return {err: null}
}

export async function DeleteCourse(courseID : string){
    const session = await getServerSession();
    if(!session || !session.user || !session.user.email){
        return {err:"Session failed"};
    }
    const user = await getUserByEmail(session.user.email);
    if(!user){
        return {err:"User not found"};
    }
    try{
        const course = await prisma.course.findUnique({
            where: {
                id: courseID
            },
            select : {
                creatorId: true,
                image: true,
                modules : {
                    select : {
                        image : true
                    }
                }
            }
        })
        if(!course){
            return {err: "Course not found"}
        }
        if(course.creatorId !== user.id){
            return {err: "You are not the creator of this course"}
        }
        await prisma.modules.deleteMany({
            where: {
                courseId: courseID
            }
        })
        await prisma.review.deleteMany({
            where: {
                courseId: courseID
            }
        })
        const urlparts = course.image.split('storage/v1/object/public/')
        const pathParts = urlparts[1].split('/',2)
        const bucketName = pathParts[0]
        const filePath = urlparts[1].substring(bucketName.length + 1 )
        await supabase.storage
                .from(bucketName)
                .remove([filePath])
        course.modules.forEach(async (module)=>{
            if (module.image) {
                const m_urlparts = module.image.split('storage/v1/object/public/')
                const m_pathParts = m_urlparts[1].split('/',2)
                const m_bucketName = m_pathParts[0]
                const m_filePath = m_urlparts[1].substring(m_bucketName.length + 1 )
                await supabase.storage
                    .from(m_bucketName)
                    .remove([m_filePath])
            }
        })
        await prisma.course.delete({
            where: {
                id: courseID
            }
        })
    }catch(e : any){
        return {err: `${e.message} `}
    }
    return {err: null}
}