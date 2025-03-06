import { getServerSession } from "next-auth";
import SignInButt from "../components/Button/SignIn";
import Link from "next/link";

export default async function SignIn() {

    const session = await getServerSession();
    if (session && session.user) {
        return (
            <div className="h-screen bg-primary">
                <div className=" pt-4 pl-4 font-bold text-tertiary " >OpenCourse</div>
                <div className="pt-40   flex flex-row  justify-center items-start ">
                    <div className="flex flex-col items-center justify-around  ">
                        <div>
                            You are currently login as {session.user.email}
                        </div>
                        <Link className="border border-accent text-accent rounded m-4 py-1 px-2"
                         href="/">Home</Link>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="h-screen bg-primary">
            <div className=" pt-4 pl-4 font-bold text-tertiary " >OpenCourse</div>
            <div className="pt-40   flex flex-row  justify-center items-start ">
                <div className="flex flex-col items-center justify-around  ">
                    <div>
                        You are currently not login. Pless sign in first
                    </div>
                    <SignInButt />
                </div>
            </div>
        </div>
    )

}