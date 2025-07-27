import AddButton from "./AddButton";
import BackButton from "./BackButton";
type userType = {
    image : string 
    name : string
}
const Card = ({user} : {user : userType}) => {
    return (
        <main className="w-[22rem] aspect-[9/12] rounded-md mx-auto my-2 flex flex-col  items-center
                        border border-accent shadow-[0_2px_13px_rgba(34,211,238,0.6)]  hover:shadow-[0_2px_20px_rgba(34,211,238,0.6)] bg-prePrimary
                        transition-shadow duration-300 mt-[calc(17dvh-70px)] relative">
            <div className="relative w-full flex justify-center items-center">
                <BackButton/>
                <img className="w-20 mt-2" src="/Stripe_Inc_logo.svg" alt="Stripe logo" />
            </div>
            <h1 className="text-xl  text-secondary my-2  ">
                Create Stripe Account
            </h1>
            <img className=" aspect-[1/1] rounded-full h-28 border-2 mt-5 
            border-[rgba(34,211,238,0.6)]" src={user?.image} alt="Stripe logo" /> 
            <h1 className="text-2xl text-secondary mt-2 ">{user?.name}</h1>
            <AddButton/>
        </main>
    )
}

export default Card;