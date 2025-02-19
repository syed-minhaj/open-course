"use client"
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const PageChanger = ({currentPage , totalPages}:{currentPage:number , totalPages:number}) => {
  const pages : number[] = [];
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const createHref = (page:number) => {
    return query ? `\?query=${query}&&page=${page}` 
                 : `\?page=${page}`
  }

  for(let i = 1 ; i <= totalPages ; i++){
    pages.push(i);
  }
  const [int , setInt] = useState(0);

  return (
    <div className="flex justify-center items-center mx-auto text-accent m-4 ">
      <div className="flex justify-center items-center">
        {currentPage  > 0 + 2 - int  ? 
            <button onClick={() => setInt(int - 2)}>{`<<`}</button>
        : null}
        {
          pages.filter((page)=> page - 2 - int <= currentPage && page + 2 - int >= currentPage)
               .map((page , index)=>{
            if(page == currentPage){
              return(
                <div key={index} className=" text-primary p-2 text-sm">
                  {page}
                </div>
              )
            }else{
              return(
                <Link key={index} href={createHref(page)} prefetch={true} onClick={() => setInt(0)} 
                 className="   p-2  text-sm" >
                  {page}
                </Link>
              )
            }
          })
        }
        {currentPage  < totalPages - 2 - int ?
            <button onClick={() =>{ setInt(int + 2);}}>{`>>`}</button>
        : null}
      </div>
    </div>
  )
}
export default PageChanger;