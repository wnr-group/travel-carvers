import { supabase } from '@/lib/supabase/client';

const SESSION_KEY = 'tc:viewed-packages';

function alreadyCounted(slug: string): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    const seen: string[] = raw ? JSON.parse(raw) : [];
    if (seen.includes(slug)) return true;
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify([...seen, slug]));
    return false;
  } catch {
    return false;
  }
}

export async function recordPackageView(slug: string): Promise<void> {
  if (!slug || alreadyCounted(slug)) return;

  try {
    await supabase.rpc('increment_package_view_count', { p_slug: slug });
  } catch {
  }
}
