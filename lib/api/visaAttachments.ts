import { supabaseAdmin } from '@/lib/supabase/server';
import type {
  VisaAttachmentFileInput,
  VisaAttachmentInput,
} from '@/lib/validations/visa.schema';

const BUCKET = 'visa-attachments';

export interface VisaAttachment {
  id: string;
  country_name: string;
  file_url: string;
  file_path: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
  updated_at: string;
}

async function removeObject(path: string | null | undefined) {
  if (!path) return;

  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);
  if (error) console.error('[visa] could not remove storage object', path, error);
}

export async function getVisaAttachments(): Promise<VisaAttachment[]> {
  const { data, error } = await supabaseAdmin
    .from('visa_attachments')
    .select('*')
    .order('country_name', { ascending: true });

  if (error) throw error;
  return (data ?? []) as VisaAttachment[];
}

export async function createVisaAttachment(
  input: VisaAttachmentInput
): Promise<VisaAttachment> {
  const { data, error } = await supabaseAdmin
    .from('visa_attachments')
    .insert({
      country_name: input.country_name,
      file_url: input.file_url,
      file_path: input.file_path,
      file_name: input.file_name,
      file_type: input.file_type ?? null,
      file_size: input.file_size ?? null,
    })
    .select()
    .single();

  if (error) {
    // The row never landed, so the file that was uploaded for it is now an orphan.
    await removeObject(input.file_path);
    throw error;
  }

  return data as VisaAttachment;
}

export async function replaceVisaAttachmentFile(
  id: string,
  input: VisaAttachmentFileInput
): Promise<VisaAttachment | null> {
  const { data: existing, error: readError } = await supabaseAdmin
    .from('visa_attachments')
    .select('file_path')
    .eq('id', id)
    .maybeSingle();

  if (readError) throw readError;
  if (!existing) return null;

  const { data, error } = await supabaseAdmin
    .from('visa_attachments')
    .update({
      file_url: input.file_url,
      file_path: input.file_path,
      file_name: input.file_name,
      file_type: input.file_type ?? null,
      file_size: input.file_size ?? null,
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    await removeObject(input.file_path);
    throw error;
  }
  if (!data) return null;

  const previousPath = existing.file_path as string | null;
  if (previousPath && previousPath !== input.file_path) {
    await removeObject(previousPath);
  }

  return data as VisaAttachment;
}

/** Delete the country and the file that belongs to it. */
export async function deleteVisaAttachment(id: string): Promise<VisaAttachment | null> {
  const { data, error } = await supabaseAdmin
    .from('visa_attachments')
    .delete()
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  await removeObject((data as VisaAttachment).file_path);
  return data as VisaAttachment;
}
