"use client";
import { useSearchParams , usePathname  } from "next/navigation";
import { useEffect, useState } from "react";

const Search = () => {
    const searchParams = useSearchParams();
    const path = usePathname();
    const query = searchParams.get("query");
    const [search , setSearch] = useState(query ? query : "");
    const [siteloaded , setSiteloaded] = useState(false);

    useEffect(() => {
        setSearch(query ? query : "");
    }, [query])

    useEffect(() => {
        if(!siteloaded){
            setSiteloaded(true);
            return;
        }
        window.stop()
        const timer = setTimeout(() => {
            if (search !== (query || "")) {
                handleSearch();
            }
        }, 500); 
        
        return () => clearTimeout(timer);
    }, [search]);
    
    const handleSearch = () => {
        const params = new URLSearchParams();
        if(search == ""){params.delete("query");}
        else{params.set("query" , search);}
        location.href = `${path}?${params.toString()}`;
    }

    return(
        
        <input onKeyDown={(e) => {if(e.key ==="Enter"){handleSearch()}}} 
               onChange={(e) => {setSearch(e.target.value)}} value={search}
               type="text" placeholder="Search" className =" flex-1  bg-prePrimary rounded-lg  
               p-2 shadow-sm shadow-slate-700 
              dark:shadow-black drop-shadow-sm "/>
    )
}

export default Search;