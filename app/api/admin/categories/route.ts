import { NextRequest, NextResponse } from 'next/server';
import { getAllCategoriesAdmin, createCategory } from '@/lib/api/categories';
import { firstZodIssue } from '@/lib/utils';
import { categorySchema } from '@/lib/validations/category.schema';

export async function GET() {
  try {
    const data = await getAllCategoriesAdmin();
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = categorySchema.safeParse(body);
    if (!validated.success) return NextResponse.json({ error: firstZodIssue(validated.error) }, { status: 400 });
    
    const data = await createCategory(validated.data);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}