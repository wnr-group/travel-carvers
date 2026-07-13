import { NextResponse } from 'next/server';
import { updateCategory, deleteCategory } from '@/lib/api/categories'; 

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  try {
    const body = await req.json();
    const data = await updateCategory(id, body);
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}