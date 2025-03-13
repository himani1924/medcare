import connectToDB from "@/utils/database";
// import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const {name, email, password} = await req.json();

    if(!name || !email || !password){
        return NextResponse.json({message: 'All fields are required'}, {status: 400})
    }

    if(password.length < 6){
        return NextResponse.json({message: 'password must be atleast 6 characters long'}, {status: 400})
    }

    try {
        await connectToDB();
        // check for existing user 

        // const hashedPassword = await bcrypt.hash(password, 10);

        // create user and save to db 

        return NextResponse.json({message:'User created'}, {status: 200})
    } catch (error) {
        console.log(error);      
        return NextResponse.json({message:'Something went wrong'}, {status: 500})
    }
}