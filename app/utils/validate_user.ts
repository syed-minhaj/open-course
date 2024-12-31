import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

export async function validateUserAccess(requestedEmail: string) {
    const session = await getServerSession()
    
    if (!session || !session.user || !session.user.email) {
        throw new Error("Session failed")
    }

    if (session.user.email !== requestedEmail) {
      throw new Error("Unauthorized: You can only access your own data")
    }
  
    return session
}


