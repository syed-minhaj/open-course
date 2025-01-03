import { adminUser, nonAdminUser } from "@/app/types";
import Edit from "../Edit";
import { useState } from "react";
import { changeUserName } from "@/app/actions/actions";

const NameComponent= ( {user , admin} : {user: adminUser | nonAdminUser, admin: boolean}) => {
    const [isEditing , setIsEditing] = useState(false);
    const [name , setName] = useState(user.name);
    function edit(){
        setIsEditing(true);
    }
    return (
        <>
        {isEditing ? 
            <div className="relative -left-1 -top-1 flex flex-row font-normal text-2xl gap-2  ">
                <input type="text" className=" text-primary bg-black px-1 rounded 
                bg-opacity-15" value={name} 
                onChange={(e)=>{setName(e.target.value);}} />
                <button className=" text-prePrimary  font-normal text-2xl flex flex-row 
                bg-secondary p-1 px-2 rounded " 
                onClick={()=>{setIsEditing(false);changeUserName(user.id,name);}}>
                    save
                </button>
            </div>
            :
            <h1 className=" text-primary font-normal text-2xl flex flex-row ">
                {name}
                {admin ? 
                <Edit background={false} onTop={false} func={()=>edit() }
                className={'size-5 opacity-50 group-hover:opacity-80 '} /> : null}
            </h1>
        }
        </>
    )
}

export default NameComponent;