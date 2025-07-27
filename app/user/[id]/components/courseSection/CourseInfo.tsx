import ImageInput from "./ImageInput";


const CourseInfo = ({ setImage , setName , setDescription , setPrice}: 
                    {setImage:(file: File| null) => void , 
                    setName: (name: string) => void, 
                    setDescription: (description: string) => void , 
                    setPrice : (price: number) => void } ) => {
    return(
        <div className="flex md:flex-row flex-col-reverse gap-2 w-full ">
            <div className="flex flex-col flex-1 gap-2  ">
                <input className="w-full p-2 rounded border-2  dark:border-black bg-opacity-25 bg-white 
                dark:bg-opacity-25 dark:bg-black  placeholder-gray-800" placeholder="Course Name" 
                onChange={(e)=>{setName(e.target.value)}} required/>
                <textarea className="w-full p-2 rounded border-2  dark:border-black bg-opacity-25 bg-white 
                dark:bg-opacity-25 dark:bg-black flex-1 placeholder-gray-800 " placeholder="Course Description " 
                onChange={(e)=>{setDescription(e.target.value)}} required/>
                <input className="w-full p-2 rounded border-2  dark:border-black bg-opacity-25 bg-white 
                dark:bg-opacity-25 dark:bg-black  placeholder-gray-800 " placeholder="Course Price "
                onChange={(e)=>{setPrice(Number(e.target.value))}} required type="number" step="0.01"/>
            </div>
            <ImageInput  onImageChange={setImage}/>
        </div>
    )
}

export default CourseInfo;