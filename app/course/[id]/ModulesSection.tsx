import { module } from "@/app/types";
import Image from "next/image";
import Module from "./components/Module";

const ModulesSection = ({modules , owned} : {modules : module[], owned : boolean}) => {
    return(
        <div className="w-11/12 sm:w-10/12 md:w-9/12 my-20  flex gap-2 flex-col items-center justify-center">
            {modules.map((module , index)=>{
                return(
                    <div className="w-full" key={index}>
                        <Module module={module} owned={owned}/>
                    </div>
                )
            })}
        </div>
    )
}

export default ModulesSection;