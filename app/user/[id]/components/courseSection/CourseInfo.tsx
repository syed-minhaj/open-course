import ImageInput from "./ImageInput";


const CourseInfo = ({ setImage , setName , setDescription}: {setImage:(file: File| null) => void , setName: (name: string) => void, setDescription: (description: string) => void}) => {
    return(
        <div className="flex md:flex-row flex-col-reverse gap-2 w-full ">
            <div className="flex flex-col flex-1 gap-2  ">
                <input className="w-full p-2 rounded border-2  dark:border-black bg-opacity-25 bg-white 
                dark:bg-opacity-25 dark:bg-black  placeholder-gray-800" placeholder="Course Name" 
                onChange={(e)=>{setName(e.target.value)}} required/>
                <textarea className="w-full p-2 rounded border-2  dark:border-black bg-opacity-25 bg-white 
                dark:bg-opacity-25 dark:bg-black flex-1 placeholder-gray-800 " placeholder="Course Description " 
                onChange={(e)=>{setDescription(e.target.value)}} required/>
            </div>
            <ImageInput  onImageChange={setImage}/>
        </div>
    )
}

export default CourseInfo;