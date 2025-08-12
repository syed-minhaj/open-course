import ImageInput from "./ImageInput";


const CourseInfo = ({ setImage , setName , setDescription , setPrice}: 
                    {setImage:(file: File| null) => void , 
                    setName: (name: string) => void, 
                    setDescription: (description: string) => void , 
                    setPrice : (price: number) => void } ) => {
    return(
        <div className="flex md:flex-row flex-col-reverse gap-2 w-full ">
            <div className="flex flex-col flex-1 gap-2  ">
                <input className="w-full p-2 rounded border-2  border-gray-400 hover:border-gray-300  dark:border-gray-600 
                 dark:hover:border-gray-500 bg-transparent placeholder-gray-400" placeholder="Course Name" 
                onChange={(e)=>{setName(e.target.value)}} required/>
                <textarea className="w-full flex resize-y p-2 rounded border-2 border-gray-400 hover:border-gray-300  dark:border-gray-600 
                 dark:hover:border-gray-500 bg-transparent placeholder-gray-400 " placeholder="Course Description " 
                onChange={(e)=>{setDescription(e.target.value)}} required/>
                <input className="w-full p-2 rounded border-2 border-gray-400 hover:border-gray-300  dark:border-gray-600 
                 dark:hover:border-gray-500 bg-transparent placeholder-gray-400 " placeholder="Course Price "
                onChange={(e)=>{setPrice(Number(e.target.value))}} required type="number" step="0.01"/>
            </div>
            <ImageInput  onImageChange={setImage}/>
        </div>
    )
}

export default CourseInfo;