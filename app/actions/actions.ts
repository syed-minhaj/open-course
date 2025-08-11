"use server";
import { supabase } from "@/app/lib/supabase";
import {prisma} from "../lib/prisma";
import { validateUserAccess } from "../utils/validate_user";
import { revalidatePath } from "next/cache";
import { Course_created as Course, module_created as module } from "../types";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

async function varifyUserByID(id: string){
    try{
        const email = await getUserByID(id);
        return await validateUserAccess(email?.email ?? " ");
    }catch(e : unknown){
        return e;
    }
}

export async function revalidatePath_fromClient(path:string){
    revalidatePath(path);
    return;
}



export async function getUserByID(id: string){
    return prisma.user.findFirst({
        where: {
            id: id
        }
    })
}

export async function changeUserBio(id : string, newbio : string | null){
    if(await varifyUserByID(id) != true){return}
    await prisma.user.update({
        where: {
            id: id
        },
        data: {
            bio: newbio
        }
    })
    revalidatePath(`/user/${id}`)
}

export async function changeImage(id : string, image : File){
    if(await varifyUserByID(id) != true){return}
    if (!image) {
        throw new Error('No file provided');
    }
    if (!image.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }
    const filePath = `${id}/profile.jpg`;
    

    await supabase.storage
        .from('profile_image')
        .upload(filePath, image, {
            upsert: true,
        })
    const url = supabase.storage
        .from('profile_image')
        .getPublicUrl(filePath);

    
    await prisma.user.update({
        where: {
            id: id
        },
        data: {
            image: `${url.data.publicUrl}?v=${Date.now()}`
        }
    })
    revalidatePath(`/user/${id}`)  
}

export async function changeUserName(id:string , newName:string){
    if(await varifyUserByID(id) != true){return}
    await prisma.user.update({
        where:{
            id:id
        },
        data:{
            name:newName
        }
    })
    revalidatePath(`/user/${id}`)
}

export async function createCourse (course :Course) {
    
    if(await varifyUserByID(course.creatorId) != true){
        return {course_id: null , creator_id: null} 
    }

    const userStripeID = await prisma.user.findUnique({
        where: {
            id: course.creatorId
        },
        select : {
            stripeId: true
        }
    })
    if (course.price > 0 && ( !userStripeID || userStripeID.stripeId == null )){
        redirect('/createStripeAccount')
    }

    const filePath = `${course.creatorId}/${Math.round(Math.random()*1000000)}/course.jpg`;
    
    await supabase.storage
    .from('course_image')
    .upload(filePath, course.image, {
        upsert: true,
    })
    
    const url = supabase.storage
        .from('course_image')
        .getPublicUrl(filePath);
    const courseData = await prisma.course.create({
        data: {
            name : course.name,
            image : url.data.publicUrl,
            description : course.description,
            creatorId : course.creatorId,
            price : course.price,

        }
    })

    await Promise.all(course.modules.map(async (module : module) => {
        await createModule(module, courseData.id , course.creatorId);
    }))

    await prisma.course.update({
        where: {
            id: courseData.id
        },
        data: {
            modulesCount: course.modules.length
        }
    })
    
    return { course_id:courseData.id , creator_id: course.creatorId };
}
export const createModule = async (module : module , courseId : string , creatorId : string) => {

    if(await varifyUserByID(creatorId) != true){return}
    const filePath = `${creatorId}/${courseId}/${Math.round(Math.random()*100000)}/module.jpg`;
    let url :string |null = null;
    if(module.modelImage){
        await supabase.storage
        .from('module_image')
        .upload(filePath, module.modelImage, {
            upsert: true,
        })
        
        const urlObject = supabase.storage
            .from('module_image')
            .getPublicUrl(filePath);
        url = urlObject.data.publicUrl;
    }
    if(url){
        await prisma.modules.create({
            data: {
                name : module.modelName,
                indexInCourse : module.indexInCourse,
                image: url,
                courseId : courseId,
                matarialLink : module.materialLink,
            }
        })
        
    }else{
        await prisma.modules.create({
            data: {
                name : module.modelName,
                indexInCourse : module.indexInCourse,
                courseId : courseId,
                matarialLink : module.materialLink,
            }
        })
    }
    
    
}

export async function createStripeAccount(){
    const session = await getServerSession();
    if(!session || !session.user || !session.user.email){
        return {err:"Session failed : login first "};
    }
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        },
    });
    if(!user){
        return {err:"User not found : login first "};
    }
    if(user.stripeId){
        return {err:"Stripe ID already added "};
    }
    try{
        const stripeAccount = await stripe.accounts.create({
            type: 'express',
            country: 'US',
            capabilities: {
                card_payments: {
                    requested: true
                },
                transfers: {
                    requested: true
                }
            }
        });
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                stripeId: stripeAccount.id
            }
        })
        const accountLink = await stripe.accountLinks.create({
            account: stripeAccount.id,
            refresh_url: `${process.env.APP_URL}/createStripeAccount`,
            return_url: `${process.env.APP_URL}/user/${user.id}`,
            type: 'account_onboarding',
        });
        return {err: null, accountLink: accountLink.url}
    }catch(e : any){
        return {err: `${e.message} `}
    }
}

export async function editStripeAccount(){
    const session = await getServerSession();
    if(!session || !session.user || !session.user.email){
        return {err:"Session failed : login first "};
    }
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        },
        select: {
            id: true,
            stripeId: true
        }
    });
    if(!user){
        return {err:"User not found : login first "};
    }
    if(!user.stripeId){
        return {err:"Stripe ID already added "};
    }
    try{
        const updateLink = await stripe.accountLinks.create({
            account: user.stripeId,
            refresh_url:  `${process.env.APP_URL}/user/${user.id}`,
            return_url:  `${process.env.APP_URL}/user/${user.id}`,
            type: 'account_onboarding',
        });
        return {err: null, updateLink: updateLink.url}
    }catch(e : any){
        return {err: `${e.message} `}
    }

}

export async function stripeAccountDashboard(){
    const session = await getServerSession();
    if(!session || !session.user || !session.user.email){
        return {err:"Session failed : login first "};
    }
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        },
        select : {
            stripeId: true
        }
    });
    if(!user){
        return {err:"User not found : login first "};
    }
    if(!user.stripeId){
        return {err:"Stripe ID not added "};
    }
    try{
        const loginLink = await stripe.accounts.createLoginLink(user.stripeId);
        return {err: null, loginLink: loginLink.url}
    }catch(e : any){
        return {err: `${e.message} `}
    }
}