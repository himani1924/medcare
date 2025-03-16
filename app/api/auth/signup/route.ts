import connectToDB from "@/utils/database";
import { QueryResult } from 'pg';
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { name, email, password } = await req.json();

    // Validate input fields
    if (!name || !email || !password) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
        return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    try {
        const pool = await connectToDB();

        // Check for existing user
        const checkUserQuery = `SELECT * FROM patients WHERE email = $1`;
        const checkUserValues = [email];
        const res: QueryResult = await pool.query(checkUserQuery, checkUserValues);

        if (res.rows.length > 0) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user and save to database
        const insertUserQuery = `
            INSERT INTO patients (name, email, password) 
            VALUES ($1, $2, $3) 
            RETURNING id, name, email;
        `;
        const insertUserValues = [name, email, hashedPassword];
        const newUser: QueryResult = await pool.query(insertUserQuery, insertUserValues);

        return NextResponse.json({
            message: 'User created successfully',
            user: newUser.rows[0]
        }, { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
