'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function ImageUploader({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    // Upload to 'category-images'
    const { data, error } = await supabase.storage
      .from('category-images') 
      .upload(fileName, file);

    if (error) {
      console.error("Upload Error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } else {
      const { data: urlData } = supabase.storage
        .from('category-images')
        .getPublicUrl(data.path);
      
      onUpload(urlData.publicUrl);
      toast.success('Image uploaded');
    }
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleUpload} 
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      />
      {uploading && <p className="text-xs text-gray-400">Uploading...</p>}
    </div>
  );
}