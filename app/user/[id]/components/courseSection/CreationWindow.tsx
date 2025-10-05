import { adminUser , Course_created as Course, nonAdminUser } from "@/app/types";
import { useState , useEffect } from "react";
import CourseInfo from "./CourseInfo";
import AddModule from "./AddModule";
import { module_created as module } from "@/app/types";
import EditModule from "./EditModule";
import {Reorder } from "framer-motion";
import {PackageCheck} from "lucide-react";
import { createCourse ,createModule, revalidatePath_fromClient } from "@/app/actions/actions";
import { resizeFile } from "@/app/utils/imageResize";
import { CheckNumberIs2DecimalPlace } from "@/app/utils";
import { toast } from "sonner";

const CreationWindow = ({userID, admin , setWindowOpen} : {userID: string , admin: boolean, setWindowOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    
    const [name , setName] = useState<string>("");
    const [description , setDescription] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [price , setPrice] = useState<number>(0.00);
    const [modules , setModules] = useState<module[]>([]);
    const [isCreating , setIsCreating] = useState<boolean | string>(false);

    function modelAdded(module : Omit<module, "indexInCourse">){
        if(modules.find((m)=>m.modelName === module.modelName)){
            return {error : "Module should have unique name"};
        }
        setModules((prev)=>[...prev , {...module , indexInCourse : prev.length}]);
        return {error : null};
    }

    function modelEdited(module : module){
        setModules((prev)=>{
            const index = prev.findIndex((m)=>m.indexInCourse === module.indexInCourse);
            if(index !== -1){
                prev[index] = module;
            }
            return [...prev];
        });
    }

    function afterReorder(reorderedModules: module[]) {
        const updatedModules = reorderedModules.map((module, index) => ({
            ...module,
            indexInCourse: index
        }));
        setModules(updatedModules);
    }

    const resizeImage = async (i: File) => {
        setIsCreating(`Resizing ${i.name} Image ...`);
        if (i.size > 200 * 1024) {
            const { file, error } = await resizeFile(i, 200, 'KB');
            if (error) throw new Error(error);
            if (!file) throw new Error('no file provided');
            return new File([file.blob], i.name, {
                type: i.type,
            });
        }
        setIsCreating(true);
        return i;
    };

    async function create_Course() {
        if (!name || !description || !image) {
            toast.info("Course name , description and image are required");
            return;
        }
        const {err} = CheckNumberIs2DecimalPlace(price);
        if(err){
            toast.info("Price should be in 2 decimal place");
            return;
        }
        setIsCreating(true);
        try {

            const resizedModules = await Promise.all(
                modules.map(async (m) => ({
                    indexInCourse: m.indexInCourse,
                    modelName: m.modelName,
                    materialLink: m.materialLink,
                    modelImage: m.modelImage ? await resizeImage(m.modelImage) : null,
                }))
            );
            
            const course: Course = {
                name,
                description,
                image: await resizeImage(image),
                modules: resizedModules, // Use the resized modules
                creatorId: userID,
                price: price,
            };
            setIsCreating(`Creating ${course.name} ...`);
            const res = await createCourse(course);
            if (res){
                const {course_id, creator_id} = res;
                if(!course_id || !creator_id){return}
                revalidatePath_fromClient(`/user/${creator_id}`)
                setIsCreating(false);
                setWindowOpen(false);
            }
        } catch (error) {
            setIsCreating(false);
            console.error('Error creating course:', error);
            throw error;
        }
    }
    

    return(
        <div className="w-screen h-screen fixed top-0 left-0 z-20  text-white
         bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center">
            <button onClick={()=>{setWindowOpen(false)}}
                className= "p-1 px-2 rounded bg-secondary text-prePrimary absolute right-5 top-5 z-30 "> close </button>
            {isCreating ? <div className="w-full h-full absolute top-0 left-0 z-20  
                bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center text-preparery">
                    {isCreating}
            </div> : null}

            <div className="w-screen h-screen sm:w-11/12 sm:h-5/6 bg-white dark:bg-black rounded overflow-scroll overflow-x-hidden bg-opacity-25 
                scrollbar-hide scrollbar-thumb-primary scrollbar-track-primary  dark:bg-opacity-25 relative backdrop-blur-sm border-2 p-1 
                border-gray-400  dark:border-gray-600  ">
                <div className="w-[100d%]  m-2 flex gap-2 flex-col ">
                
                    <h1 className="  text-gray-200 py-2  ">Create Course</h1>
                    <CourseInfo setImage={setImage} setName={setName} setDescription={setDescription} setPrice={setPrice}/>
                    <h2 className="text-sm  text-gray-200 p-1  ">Add Modules</h2>
                    <AddModule moduleAdded={modelAdded}/>
                    <Reorder.Group className="flex flex-col gap-1" as="ol" 
                    values={modules} onReorder={afterReorder} axis="y" >
                    {modules.map((module : module , index)=>{
                        return (
                           <EditModule moduleEdited={modelEdited} module={module} key={index} index={index}/>  
                        )
                    })}
                    </Reorder.Group>
                    
                </div>
                <div className="absolute right-0 p-3 py-5 ">
                    <button onClick={()=>{create_Course()}}
                        className="p-1 px-2 rounded bg-secondary text-prePrimary   "> 
                        <PackageCheck className="w-6 h-6"/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreationWindow;