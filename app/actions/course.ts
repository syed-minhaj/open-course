"use server";

import {prisma} from "../lib/prisma";
import { getServerSession } from "next-auth"
import { supabase } from "../lib/supabase";
import Stripe from "stripe";

type CourseTypeForPayment = {
    id : string,
    name: string;
    image: string;
    price: number;
    description: string;
    creator: {
        stripeId: string | null;
    };
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

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

export async function BuyCourse(courseID : string ){
    const session = await getServerSession();
    if(!session || !session.user || !session.user.email){
        return {err:"Session failed : login first "};
    }
    const user = await getUserByEmail(session.user.email);
    if(!user){
        return {err:"User not found : login first "};
    }
    const course = await prisma.course.findUnique({
        where: {
            id: courseID
        },
        select : {
            creator: {
                select : {
                    stripeId: true
                }
            },
            image: true,
            name: true,
            price: true,
            description: true,

        }
    })
    if(!course){
        return {err: "Course not found"}
    }
    if(course.price > 0){
        const res =  await BuyCourse_Payment({ 
            course : { id : courseID ,  ...course } , 
            userEmail : session.user.email
        })
        if (!res.err){
            return {err: null , paymentURl: res.paymentURl }
        }
        return {err: res.err}
    }else{
        const res =  await BuyCourse_afterPayment({courseID , userID : user.id})
        if (res.err){
            return {err: res.err}
        }
        return {err: null}
    }
}

async function BuyCourse_Payment({course , userEmail } : {course : CourseTypeForPayment , userEmail : string}){
    
    if(!course.creator.stripeId){
        return {err: "course not available"}
    }
    try{
        const striprSession  = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: course.name,
                        images: [course.image],
                        description: course.description
                    },
                    unit_amount: course.price * 100
                },
                quantity: 1
            }],
            mode: 'payment',
            payment_intent_data: {
                transfer_data:{
                    destination:course.creator.stripeId,
                }
            },
            metadata: {
                courseID: course.id
            },
            // update url to your domain
            success_url: `${process.env.APP_URL}/course/${course.id}`,
            cancel_url: `${process.env.APP_URL}/course/${course.id}`,
            customer_email: userEmail
        })
        if(!striprSession.url){
            return {err: "Stripe session not created"}
        }
        return {err: null, paymentURl: striprSession.url}
    }catch(e : any){
        return {err: `${e.message} ` }
    }
}

export async function BuyCourse_afterPayment({courseID , userID} : {courseID : string , userID : string}){
    try{
        await prisma.course.update({
            where: {
                id: courseID
            },
            data: {
                buyers: {
                    connect: {
                        id: userID
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
                        id: userID
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