import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { QueryResult } from 'pg';
import connectToDB from "@/utils/database";
import bcrypt from "bcryptjs";

interface Patient {
    id: string;
    name: string;
    email: string;
    password: string;
  }

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
                if (!credentials?.email || !credentials?.password) {
                  throw new Error("Missing email or password");
                }
        
                const pool = await connectToDB();
        
                // Find user by email
                const query = `SELECT * FROM patients WHERE email = $1`;
                const values = [credentials.email];
                const res = await pool.query(query, values);
        
                if (res.rows.length === 0) {
                  throw new Error("No user found with this email");
                }
        
                const user = res.rows[0] as Patient;
                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        
                if (!isValidPassword) {
                  throw new Error("Invalid password");
                }
        
                // Return user object for session
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                };
              },
        })
    ],

    // callbacks 
    callbacks: {
        async signIn({ profile, account }) {
            if (!profile) return false;
        try {
            const pool = await connectToDB();
            if (account?.provider === 'google'){
              // Check if user already exists
              const checkUserQuery = `SELECT * FROM patients WHERE email = $1`;
              const checkUserValues = [profile.email];
              const res: QueryResult = await pool.query(checkUserQuery, checkUserValues);
              
              // check if it is a new sign in 
              if(res.rows.length === 0){
                // Create new user
                const insertUserQuery = `
                  INSERT INTO patients (name, email) 
                  VALUES ($1, $2) 
                  RETURNING id, name, email;
                `;
                const insertUserValues = [profile.name, profile.email];
                const newUser: QueryResult = await pool.query(insertUserQuery, insertUserValues);            
                console.log("User created:", newUser.rows[0]);
              }
            }
            // Redirect to dashboard upon success
            return '/';
          } catch (error) {
            console.error("Error during sign-in:", error);
            return false;
          }
        },
        async jwt({ token, user }) {
            if (user) {
              token.id = user.id;
              token.name = user.name;
              token.email = user.email;
            }
            return token;
          },
          async session({ session, token }) {
            if (token && typeof token.id === 'string') {
                session.user.id = token.id;
              }
            
              if (token && typeof token.name === 'string') {
                session.user.name = token.name;
              }
            
              if (token && typeof token.email === 'string') {
                session.user.email = token.email;
              }
            return session;
          },
    },
    secret: process.env.NEXTAUTH_SECRET
});



export { handler as GET, handler as POST };
