"use client";
import { adminUser, nonAdminUser } from "@/app/types";
import Edit from "./Edit";
import { changeBio, changeImage } from "@/app/actions/actions";
import { ChangeEvent } from "react";
import { resizeFile } from "@/app/utils/imageResize";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState , useEffect } from "react";

const Profile = ({user , admin , id} : {user: adminUser | nonAdminUser, admin: boolean, id: string}) => {
    
    const [mounted, setMounted] = useState(false);
    const [imageUploading , setImageUploading] = useState(false);
    //function select_image(){
        // useEffect(() => {
        //     const fileInput = document.createElement('input');
        //     fileInput.type = 'file';
        //     fileInput.accept = 'image/*';
        //     fileInput.style.display = 'none';
        //     fileInput.onchange = async (e) => {
        //         let image = fileInput.files?.[0];
        //         console.log(3,image);
        //         if (image) {
        //             if (image.size > (200 * 1024)) {
        //                 let {file , error} = await resizeFile(image,  200,  "KB");
        //                 if (error) {
        //                     throw new Error(error);
        //                 }
        //                 if (!file) {
        //                     throw new Error('No file provided');
        //                 }
        //                 image = new File([file.blob], image.name, {
        //                     type: image.type,
        //                 })
                            
        //             }
        //             changeImage(id, image)
        //         }
        //     }
        //     setMounted(true);
        // },[])

    //}
    // if (!mounted ) {
    //     return null;
    // }

    function select_image(){
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.onchange = async (e) => {
            let image = fileInput.files?.[0];
            setImageUploading(true);
            console.log(3,image);
            if (image) {
                if (image.size > (200 * 1024)) {
                    let {file , error} = await resizeFile(image,  200,  "KB");
                    if (error) {
                        throw new Error(error);
                    }
                    if (!file) {
                        throw new Error('No file provided');
                    }
                    image = new File([file.blob], image.name, {
                        type: image.type,
                    })
                }
                changeImage(id, image).then((res:unknown)=>{
                    setImageUploading(false);
                })
            }
        }
        fileInput.click()
    }
    
    function onFunc(){
        changeBio(id , "nknknkkpop").then((res:unknown)=>{
            console.log("done",res)
        })

    }
    return (
        <>
            <div className="gap-5 w-full flex flex-col md:flex-row  ">
                
                <div className="relative inline-block w-28 md:w-36">
                    <Image src={`${user.image}`} className={`bg-accent aspect-square w-28 md:w-36 rounded-full 
                        ${imageUploading === true ? "animate-pulse" : ""}`}
                        alt="profile image" width={144} height={144} />
                    <Edit background={true} onTop={true} func={()=>{select_image()} }
                    className={'size-4 opacity-50 group-hover:opacity-80 '} />
                </div>
                <div className="h-full flex-1 rounded-lg " >
                    <h1 className=" text-primary font-normal text-2xl flex flex-row ">
                        {user.name}
                        {admin ? 
                        <Edit background={false} onTop={false} func={()=>onFunc() }
                        className={'size-5 opacity-50 group-hover:opacity-80 '} /> : null}
                    </h1>
                </div>
            </div>
            <div className="pt-5">
                <div className="w-full   ">
                    <h4 className="text-secondary font-normal text-l mb-1 flex flex-row ">
                        Bio {admin ? 
                        <Edit background={false} onTop={false} func={()=>onFunc() }
                        className={'size-4 opacity-50 group-hover:opacity-80 '} /> : null}
                    </h4>
                    <p className="text-tertiary  text-sm">
                        {user.bio}
                    </p>
                </div>
            </div>
        </>
    )
}

export default Profile;