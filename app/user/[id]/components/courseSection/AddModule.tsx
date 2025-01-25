
import { useState } from "react";
import ImageInput from "./ImageInput";
import { CheckCheck } from "lucide-react";
import { module_created as module } from "@/app/types";

const AddModule = ({moduleAdded} : {moduleAdded: (modules: Omit<module , 'indexInCourse'> ) => {error : string | null}}) => {
    
    const [image , setImage] = useState<File | null>(null);
    const [name , setName] = useState<string>("");
    const [link , setLink] = useState<string>("");
    const [clearImage , setClearImage] = useState<number>(0);
    function save(){
        if(!name || !link){
            alert("Please fill all the fields[name , link]");
            return;
        }
        const module : Omit<module , 'indexInCourse'> = {
            modelName : name,
            materialLink : link,
            modelImage : image
        }
        const {error} = moduleAdded(module);
        if(error){
            alert(error);
            return;
        }
        setImage(null);
        setName("");
        setLink("");
        setClearImage(prev=>prev+1);
    }

    return (
            
        <div className="w-full flex flex-row gap-1 bg-opacity-25 bg-white rounded 
            dark:bg-opacity-15 dark:bg-black p-2 border border-white dark:border-black flex-wrap ">
            <ImageInput onImageChange={setImage} simple clearImage={clearImage}  />
            <input className=" p-2 rounded border-2  dark:border-black bg-opacity-25 bg-white flex-1
                dark:bg-opacity-25 dark:bg-black  placeholder-gray-800" placeholder="Module Name" 
                type="text" required onChange={(e)=>{setName(e.target.value)}} value={name}/>
            <input className=" p-2 rounded border-2  dark:border-black bg-opacity-25 bg-white flex-1
                dark:bg-opacity-25 dark:bg-black  placeholder-gray-800" placeholder="Content url" 
                type="text" required onChange={(e)=>{setLink(e.target.value)}} value={link}/>
            <button onClick={()=>{save()}}
                className="p-1 px-2 rounded bg-secondary text-prePrimary"> 
                <CheckCheck className="w-6 h-6"/>   
            </button>
        </div>
        
    )
}

export default AddModule;