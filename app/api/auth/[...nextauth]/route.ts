// import { connectToDB } from "@/utils/database";
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import User from "@/models/user";
import { Profile } from "next-auth";

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
    ],
    callbacks: {
        async session({ session }: { session: Session }) {
            // if (session.user?.email) {
            //     const sessionUser = await User.findOne({ email: session.user.email });
            //     if (sessionUser) {
            //         session.user.id = sessionUser._id.toString();
            //     }
            // }
            return session;
        },
        async signIn({ profile }: { profile?: Profile }) {
            if (!profile) return false;
            try {
                // await connectToDB();
                // const userExists = await User.findOne({ email: profile.email });
                
                // if (!userExists) {
                //     await User.create({
                //         email: profile.email,
                //         username: profile.name?.replace(/\s+/g, "").toLowerCase() || "",
                //         image: profile.picture,
                //     });
                // }
                return true;
            } catch (error) {
                console.error("Error during sign-in:", error);
                return false;
            }
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
