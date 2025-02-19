"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const RemoveSearch = () => {
    const {replace} = useRouter();
    const params = useSearchParams();
    const query = params.get("query");
    function RemoveParams(){
        replace(`/ `)
    }
    return(
        <div className="bg-prePrimary rounded-lg p-2 w-fit shadow-sm shadow-slate-700 
            dark:shadow-black drop-shadow-sm flex flex-row gap-1 ">
            <button onClick={RemoveParams} className="opacity-50 p-2 " >x</button>
            <div className="bg-black  bg-opacity-10 p-2 px-2 rounded-lg ">{query}</div>
        </div>
    )
}

export default RemoveSearch;