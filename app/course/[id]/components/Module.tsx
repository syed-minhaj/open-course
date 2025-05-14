
import { module } from "@/app/types";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";

const Module = ({module , owned } : {module : module, owned : boolean }) => {
    return(
        <div  className="dark:bg-gray-200 bg-gray-700 bg-opacity-[0.05] dark:border-gray-200 border 
        border-gray-700 dark:border-opacity-10 border-opacity-10  w-full rounded-lg p-4 dark:bg-opacity-5 
        shadow-sm shadow-slate-700 dark:shadow-black drop-shadow-sm " >
            <div className="flex flex-row gap-2 ">
                <span className="opacity-65 ">{module.indexInCourse + 1}</span>
                <h1 className="text-xl  text-primary ">{module.name}</h1>
                {module.image ?
                    <Image className="ml-auto h-[80] w-[120] rounded object-cover " src={module.image} alt={module.name} width={120} height={80} />
                : null}
            </div>
            { owned ? 
                <div className=" py-2 ">
                    <div className="flex flex-row items-center">
                        <h3 className="text-l  text-primary min-w-fit ">Resourse : </h3>
                        <a href={module.matarialLink} target="_blank" className="flex-1 text-accent break-all font-medium">
                            {module.matarialLink}
                            <SquareArrowOutUpRight size={20} className="inline ml-2 font-medium " />
                        </a>
                    </div>
                </div>
            : null
            }
            
        </div>
    )
}

export default Module;