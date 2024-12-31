"use client";
import { Pencil } from "lucide-react";

const Edit = ({background , className , onTop , func} : {background: boolean, className: string, onTop: boolean, func:()=>void}) => {
    function onClick(){
        func()
    }
    return(
        <button onClick={onClick}
            className={`${onTop ? 'absolute bottom-0 right-0 ' : ' px-1 '} 
                        ${background ? ' bg-white dark:bg-black p-2 ' : ' '}
                        bg-opacity-50 hover:bg-opacity-70 dark:bg-opacity-50 dark:hover:bg-opacity-70
                        rounded-full shadow-lg  transition-all group`}
        >
            <Pencil className={`${className}  transition-all `} />
        </button>
    )
}

export default Edit;