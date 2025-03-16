import { NextResponse } from 'next/server';
import { QueryResult } from 'pg';
import connectToDB from '@/utils/database';

export async function GET(){
  try {
    const pool = await connectToDB();
    const res: QueryResult = await pool.query('SELECT * FROM doctors');
    console.log('fetched successfully');
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
