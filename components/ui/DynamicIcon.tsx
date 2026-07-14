'use client';

import { ICONS, isIconName } from '@/lib/icons';

/**
 * Render a lucide icon chosen by name at runtime.
 *
 * The dynamic lookup is confined to this one component on purpose. Doing
 * `const Icon = getIcon(name)` inline in a component and then rendering `<Icon />` trips the
 * React Compiler's "cannot create components during render" rule — it can't prove the function
 * hands back an existing component rather than building a fresh one each render (which would
 * remount the subtree every time). Indexing the static registry here keeps that in one place.
 *
 * Renders nothing for an unknown name, so an icon typed by hand before the registry existed
 * degrades to blank instead of crashing the page.
 */
export default function DynamicIcon({
  name,
  className,
}: {
  name: string | undefined | null;
  className?: string;
}) {
  if (!name || !isIconName(name)) return null;

  const Component = ICONS[name];
  return <Component className={className} aria-hidden="true" />;
}
