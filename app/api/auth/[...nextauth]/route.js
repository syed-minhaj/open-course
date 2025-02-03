import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
//import { PrismaAdapter } from '@next-auth/prisma-adapter';
import {prisma} from '../../../lib/prisma';
//import { PrismaClient } from "@prisma/client"
import { unstable_cache as cache } from "next/cache";

//const prisma = new PrismaClient()
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    
    async signIn(user) {
      // Handle sign in
      const userF = async() => {
        return await cache(
          async () => { return await prisma.user.findFirst({
            where: {
              email : user.user.email ,
            },
            select:{
              id:true
            }
          })},
          [`user:${user.user.email}`],
          {revalidate : 3600 }
        )()
      }

      if (userF){
        return true
      }else{
        const createUser = await prisma.user.create({
          data: {
            name: user.user.name ,
            image: user.user.image ,
            email: user.user.email ,
          }
        })
        return true
      }
    },
 },
});


export { handler as GET, handler as POST };