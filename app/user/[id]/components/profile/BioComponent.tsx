import { adminUser, nonAdminUser } from "@/app/types"
import Edit from "../Edit";
import { useState } from "react";
import { changeUserBio } from "@/app/actions/actions";

const BioComponent = ({user, admin} : {user: adminUser | nonAdminUser, admin: boolean}) => {

    const [bio , setBio] = useState(user.bio);
    const [isEditing , setIsEditing] = useState(false);
    function edit(){
        setIsEditing(true);
    }

    return(
        <>
            <h4 className="text-secondary font-normal gap-2 mb-1 flex flex-row ">
                Bio 
                {admin ? 
                    isEditing ? 
                    <button className=" text-prePrimary  font-normal text-sm flex flex-row 
                    bg-secondary p-[2] px-1 rounded " 
                    onClick={()=>{setIsEditing(false);changeUserBio(user.id,bio);}}>
                        save
                    </button>
                    :
                    <Edit background={false} onTop={false} func={()=>edit() }
                    className={'size-4 opacity-50 group-hover:opacity-80 '} />  
                : null}
            </h4>
            {isEditing ?
                <textarea className=" text-secondary bg-black px-1 rounded text-sm resize h-auto min-h-3 w-full 
                bg-opacity-10" value={bio ?? ""} rows={5}
                onChange={(e)=>{setBio(e.target.value);}}  />
                :
                <p className="text-tertiary  text-sm">
                    {bio}
                </p>
            }    
        </>
    )
}

export default BioComponent;