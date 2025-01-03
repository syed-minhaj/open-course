"use server";
import { createClient } from "@supabase/supabase-js";
import {prisma} from "../lib/prisma";
import { validateUserAccess } from "../utils/validate_user";
import { resizeFile }  from "../utils/imageResize";
import { revalidatePath } from "next/cache";

async function varifyUserByID(id: string){
    try{
        const email = await getUserByID(id);
        return await validateUserAccess(email?.email ?? " ");
    }catch(e : unknown){
        return e;
    }
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? " ",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? " ",
    {
      auth: {
        persistSession: false,
      }
    }
);

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