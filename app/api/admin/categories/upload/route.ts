import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { toApiError } from '@/lib/api/errors';
import { supabaseAdmin } from '@/lib/supabase/server';

const BUCKET = 'category-images';
const MAX_BYTES = 5 * 1024 * 1024; // matches the bucket's file_size_limit

// Extension is derived from the sniffed mime type, never from the client-supplied filename.
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/**
 * Uploads a category cover image using the service-role key.
 *
 * The browser Supabase client has no session (auth is held in a server-side httpOnly
 * cookie), so uploading directly from the browser would have to run as `anon`. Doing it
 * here keeps the bucket closed to the public while still letting admins upload.
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const extension = ALLOWED_TYPES[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use JPEG, PNG or WebP.' },
        { status: 415 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image must be 5MB or smaller' }, { status: 413 });
    }

    const path = `${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({ data: { url: publicUrl, path } }, { status: 201 });
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
