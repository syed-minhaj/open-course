import { changeImage } from "@/app/actions/actions";
import { adminUser, nonAdminUser } from "@/app/types";
import { resizeFile } from "@/app/utils/imageResize";
import Edit from "../Edit";
import { useState } from "react";
import Image from "next/image";

const ImageComponent = ({user, admin} : {user: adminUser | nonAdminUser, admin: boolean}) => {

    const id = user.id;
    const [imageUploading , setImageUploading] = useState(false);
    

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

    return (
        <>  
        <Image src={`${user.image}`} className={`bg-accent aspect-square w-28 md:w-36 rounded-full 
            ${imageUploading === true ? "animate-pulse" : ""}`}
            alt="profile image" width={144} height={144} />
        {admin === true ?
            <Edit background={true} onTop={true} func={()=>{select_image()} }
            className={'size-4 opacity-50 group-hover:opacity-80 '} />
        : null}
        </>
    )
}

export default ImageComponent;