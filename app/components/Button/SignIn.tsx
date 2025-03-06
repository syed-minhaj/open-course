"use client";
import {signIn} from "next-auth/react"

const SignInButt = () => {
    return(
        <button onClick={() => signIn(undefined , {callbackUrl: "/"})}
                className="border border-accent text-accent rounded m-4 py-1 px-2"> 
            Sign In
        </button>
    )
}
export default SignInButt;