
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
            
        <div className="w-full flex flex-row gap-1  rounded  flex-wrap ">
            <ImageInput onImageChange={setImage} simple clearImage={clearImage}  />
            <input className=" p-2 flex-1 rounded border-2  border-gray-400 hover:border-gray-300  dark:border-gray-600 
                 dark:hover:border-gray-500 bg-transparent placeholder-gray-400" placeholder="Module Name" 
                type="text" required onChange={(e)=>{setName(e.target.value)}} value={name}/>
            <input className=" p-2 flex-1 rounded border-2 border-gray-400 hover:border-gray-300  dark:border-gray-600 
                 dark:hover:border-gray-500 bg-transparent placeholder-gray-400" placeholder="Content url" 
                type="text" required onChange={(e)=>{setLink(e.target.value)}} value={link}/>
            <button onClick={()=>{save()}}
                className="p-1 px-2 rounded bg-secondary text-prePrimary"> 
                <CheckCheck className="w-6 h-6"/>   
            </button>
        </div>
        
    )
}

export default AddModule;