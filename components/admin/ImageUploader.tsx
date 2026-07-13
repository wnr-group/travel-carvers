'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client'; // Use the public client
import { toast } from 'sonner';

export default function ImageUploader({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // 1. Upload to Supabase Storage (Bucket name: 'categories')
    const { data, error } = await supabase.storage
      .from('category-images') 
      .upload(`${Date.now()}_${file.name}`, file);

    if (error) {
      toast.error('Upload failed');
    } else {
      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from('category-images')
        .getPublicUrl(data.path);
      
      onUpload(urlData.publicUrl);
      toast.success('Image uploaded');
    }
    setUploading(false);
  }

  return (
    <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
  );
}