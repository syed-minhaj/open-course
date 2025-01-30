
import { module } from "@/app/types";
import Image from "next/image";

const Module = ({module , owned , index} : {module : module, owned : boolean , index : number}) => {
    return(
        <div key={index} className="bg-prePrimary w-full rounded p-2 
        shadow-sm shadow-slate-700 dark:shadow-black drop-shadow-sm ">
            <div className="flex flex-row gap-2 items-center">
                <span>{module.indexInCourse + 1}</span>
                <h1 className="text-xl  text-primary">{module.name}</h1>
                {module.image ?
                    <Image className="ml-auto h-[120] w-[180] rounded object-cover " src={module.image} alt={module.name} width={180} height={180} />
                : null}
            </div>
            { owned ? 
                <div className=" py-2 ">
                    <div className="flex flex-row items-center">
                        <h3 className="text-l  text-primary">Resourse : </h3>
                        <a href={module.matarialLink} target="_blank">{module.matarialLink}</a>
                    </div>
                </div>
            : null
            }
            
        </div>
    )
}

export default Module;