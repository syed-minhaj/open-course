import { changeImage } from "@/app/actions/actions";
import { adminUser, nonAdminUser } from "@/app/types";
import { resizeFile } from "@/app/utils/imageResize";
import Edit from "../Edit";
import { useState } from "react";
import Image from "next/image";

const ImageComponent = ({user, admin} : {user: adminUser | nonAdminUser, admin: boolean}) => {

    const id = user.id;
    const [imageUploading , setImageUploading] = useState(false);
    


    async function select_image(image : File | undefined){
        
        if(!image){return}
        
        setImageUploading(true);
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

    return (
        <>  
        <Image src={`${user.image}`} alt="profile image" width={144} height={144}
            className={`aspect-square w-28 md:w-36 rounded-full 
            ${imageUploading === true ? "animate-pulse" : ""}`}
        />
        {admin === true ?
            <>
            <Edit background={true} onTop={true} func={()=>{document.getElementById('image_input')?.click()}}
            className={'size-4 opacity-50 group-hover:opacity-80 '} />
            <input id="image_input" type="file" accept="image/*" className="hidden" onChange={(e)=>{select_image(e.target.files?.[0])}} />
            </>
        : null}
        </>
    )
}

export default ImageComponent;