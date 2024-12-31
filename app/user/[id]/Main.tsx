
import { adminUser, nonAdminUser } from "@/app/types";
import Profile from "./components/Profile";


const Main = async({user, admin , id} : {user: adminUser | nonAdminUser, admin: boolean, id: string}) => {

    return (
        <main className="md:w-9/12 w-11/12 flex flex-col md:mt-14 mt-10 
         space-y-5 divide-y divide-gray-300 dark:divide-gray-700  ">
            <Profile user={user} admin={admin} id={id} />
            <div className="pt-5">
                <div className="w-full h-36 bg-accent "></div>
            </div>
        </main>
    )
}

export default Main;