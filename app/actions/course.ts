"use server";

import {prisma} from "../lib/prisma";
import { getServerSession } from "next-auth"

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
        await prisma.course.delete({
            where: {
                id: courseID,
                creatorId: user.id
            }
        })
    }catch(e : any){
        return {err: `${e.message} `}
    }
    return {err: null}
}