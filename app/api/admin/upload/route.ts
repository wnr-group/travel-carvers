import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/api/guard';
import { toApiError } from '@/lib/api/errors';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  allowedTypesFor,
  isDocumentBucket,
  isSafeStoragePath,
  isUploadBucket,
  maxBytesFor,
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

    // Each bucket accepts one family of files — images or documents, never both.
    const allowed = allowedTypesFor(bucket);
    const contentType = resolveContentType(file, allowed);
    const extension = contentType ? allowed[contentType] : undefined;

    if (!extension || !contentType) {
      return NextResponse.json(
        {
          error: isDocumentBucket(bucket)
            ? 'Unsupported file type. Use PDF or XLSX.'
            : 'Unsupported file type. Use JPEG, PNG or WebP.',
        },
        { status: 415 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    const maxBytes = maxBytesFor(bucket);
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `File must be ${Math.floor(maxBytes / (1024 * 1024))}MB or smaller` },
        { status: 413 }
      );
    }

    const folder = normalizeStoragePath(typeof path === 'string' ? path : '');
    if (!isSafeStoragePath(folder)) {
      return NextResponse.json({ error: 'Invalid upload path' }, { status: 400 });
    }

    const key = `${folder ? `${folder}/` : ''}${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(key, file, { contentType, upsert: false });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(key);

    return NextResponse.json(
      {
        data: {
          url: publicUrl,
          path: key,
          name: file.name,
          type: contentType,
          size: file.size,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const { message, status } = toApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

/**
 * Browsers are unreliable about the content type of office documents — Windows in
 * particular often reports an empty type or `application/octet-stream` for .xlsx. Fall
 * back to the file extension, but only ever to a type the bucket already allows.
 */
function resolveContentType(file: File, allowed: Record<string, string>): string | undefined {
  if (file.type && allowed[file.type]) return file.type;

  if (!file.type || file.type === 'application/octet-stream') {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return Object.keys(allowed).find((type) => allowed[type] === extension);
  }

  return undefined;
}
