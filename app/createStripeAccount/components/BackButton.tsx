"use client";
import {ArrowLeft} from "lucide-react"

const BackButton = () => {

    return (
        <button className="absolute left-4 transition-all duration-300 
        ease-in-out translate-x-1 hover:translate-x-0 " onClick={()=>window.history.back()}>
            <ArrowLeft className="text-accent w-6 h-6" />
        </button>
    )
}
export default BackButton;