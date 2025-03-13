import NextAuth from "next-auth";
// import { NextAuthConfig } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// import User from "@/models/user";
// import bcrypt from "bcryptjs";
import connectToDB from "@/utils/database";

const handler = NextAuth( {
    session: {
        strategy: "jwt",
        },
    pages:{
        signIn:'/login'
    },
    providers: [
        // google provider 
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        // credential provider 
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password:{},
            },
            async authorize(credentials) {
                try {
                    // connection to db code 
                    await connectToDB();

                    console.log(credentials);//remove
                    
                    // const user = await User.findOne({ email: credentials?.email });
                    // if (!user) {
                    //     throw new Error("")
                    // }
                    // const isValidPassword = await bcrypt.compare(
                    //     credentials?.password ?? "", user.password as string
                    // ); 
                    // if (!isValidPassword) {
                    //     throw new Error ("")
                    // }
                    // return user;
                    return null;
                }
                catch {
                    return null
                }
            }
        })
    ],

    // callbacks 
    callbacks: {
        async signIn({ profile }) {
            if (!profile) return false;
            try {
                // await connectToDB();
                console.log(profile.name);
                console.log(profile.email);
                console.log(profile.sub);
                // check if user already exists
                
                // if not ----> create new user
                return true;
            } catch (error) {
                console.error("Error during sign-in:", error);
                return false;
            }
        },
        // for jwt 
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        // for session 
        async session({ session, token }) {
            if (token) {
                session.user = {
                    email: token.email,
                    name: token.name,
                    image: token.picture,
                };
            };
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET
});



export { handler as GET, handler as POST };
