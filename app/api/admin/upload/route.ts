import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { toApiError } from '@/lib/api/errors';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  isSafeStoragePath,
  isUploadBucket,
  normalizeStoragePath,
} from '@/lib/storage/buckets';


export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const bucket = formData.get('bucket');
    const path = formData.get('path');

    if (typeof bucket !== 'string' || !isUploadBucket(bucket)) {
      return NextResponse.json({ error: 'Unknown storage bucket' }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const extension = ALLOWED_IMAGE_TYPES[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use JPEG, PNG or WebP.' },
        { status: 415 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'Image must be 5MB or smaller' }, { status: 413 });
    }

    const folder = normalizeStoragePath(typeof path === 'string' ? path : '');
    if (!isSafeStoragePath(folder)) {
      return NextResponse.json({ error: 'Invalid upload path' }, { status: 400 });
    }

    const key = `${folder ? `${folder}/` : ''}${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(key, file, { contentType: file.type, upsert: false });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(key);

    return NextResponse.json({ data: { url: publicUrl, path: key } }, { status: 201 });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
