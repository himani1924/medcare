import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { QueryResult } from "pg";
import connectToDB from "@/utils/database";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // console.log("credentials", credentials);
        console.log("inside authorize function");
        try {
          console.log('inside try');
          const res = await fetch(`${process.env.BACKEND_URL}/routes/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });
          const user = await res.json();

          if (!res.ok) {
            throw new Error(user.message || "Login failed");
          }

          return user;   

        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],

  // callbacks
  callbacks: {
    async signIn({ profile, account }) {
      console.log('inside sign in function', account);
      try {
        const pool = await connectToDB();
        if (account?.provider === "google") {
          // Check if user already exists
          if (!profile) return false;
          const checkUserQuery = `SELECT * FROM patients WHERE email = $1`;
          const checkUserValues = [profile.email];
          const res: QueryResult = await pool.query(
            checkUserQuery,
            checkUserValues
          );

          // check if it is a new sign in
          if (res.rows.length === 0) {
            // Create new user
            const insertUserQuery = `
                            INSERT INTO patients (name, email) 
                            VALUES ($1, $2) 
                            RETURNING id, name, email;
                        `;
            const insertUserValues = [profile.name, profile.email];
            const newUser: QueryResult = await pool.query(
              insertUserQuery,
              insertUserValues
            );
            console.log("User created:", newUser.rows[0]);
          }
        }
        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },


    async jwt({ token, user }) {
      console.log("jwt is called");
      console.log(token);
      console.log(user);
      if (user) {
        token.id = String(user.id);
        token.name = user.name;
        token.email = user.email;
      }
      console.log("JWT token generated:", token);
      return token;
    },


    async session({ session, token }) {
      console.log("session is called");
  if (session.user) {
    (session.user as { id?: string }).id = token.id as string;
    session.user.name = token.name;
    session.user.email = token.email;
  }
      console.log(session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
