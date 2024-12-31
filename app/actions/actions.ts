"use server";
import { createClient } from "@supabase/supabase-js";
import {prisma} from "../lib/prisma";
import { validateUserAccess } from "../utils/validate_user";
import { resizeFile }  from "../utils/imageResize";
import { revalidatePath } from "next/cache";

async function varifyUserByID(id: string){
    try{
        const email = await getUserByID(id);
        await validateUserAccess(email?.email ?? " ");
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

export async function changeBio(id : string, bio : string){
    varifyUserByID(id);
    const u = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            bio: bio
        }
    })
    revalidatePath(`/user/${id}`)
    return u.bio;
}

export async function changeImage(id : string, image : File){
    varifyUserByID(id);
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
    const url = await supabase.storage
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