"use server";

import { supabase } from "../lib/supabase"

function parseSupabaseUrl(url:string) {
    const publicIndex = url.indexOf('public/');
    if (publicIndex === -1) {
        return { bucket: null, path: null };
    }

    const afterPublic = url.substring(publicIndex + 7); 
    
    const parts = afterPublic.split('/');
    const bucket = parts[0];
    const path = parts.slice(1).join('/');
    
    return { bucket, path };
}


export async function getImageFromStorage (image : string , download : boolean = false) {
    
    const { bucket, path } = parseSupabaseUrl(image);
    if(!bucket || !path){
        return "";
    }
    const imageUrl = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60 , {
            download: download
        });
        
    if(imageUrl.error){
        return "";
    }
    return imageUrl.data.signedUrl;
}