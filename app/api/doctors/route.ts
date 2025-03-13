import { NextResponse } from 'next/server';
import doctors from '@/public/data/doctors.json';

export async function GET() {
  return NextResponse.json(doctors);
}
