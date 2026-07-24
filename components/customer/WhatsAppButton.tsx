'use client';

import { useSyncExternalStore } from 'react';
import { WHATSAPP_MESSAGES, whatsAppUrl } from '@/lib/config/contact';

let contextualMessage: string | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => contextualMessage;
const getServerSnapshot = () => null;


export function setWhatsAppMessage(message: string | null) {
  if (contextualMessage === message) return;
  contextualMessage = message;
  listeners.forEach((listener) => listener());
}


function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.683 1.448h.005c6.581 0 11.94-5.359 11.943-11.945A11.821 11.821 0 0020.52 3.45" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Button                                                                      */
/* -------------------------------------------------------------------------- */


export default function WhatsAppButton() {
  const pageMessage = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const href = whatsAppUrl(pageMessage ?? WHATSAPP_MESSAGES.default);

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className={[
        'group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full',
        'bg-brand-forest px-4 py-3.5 text-white shadow-lg shadow-brand-forest/30',
        'max-[359px]:hidden',
        'transition-all duration-300 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand-forest/40',
        'hover:-translate-y-0.5 active:translate-y-0 active:scale-95',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-sage/60',
        'animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-500',
        'motion-reduce:animate-none motion-reduce:transition-none',
      ].join(' ')}
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0" />

      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold opacity-0 transition-all duration-300 group-hover:max-w-[12rem] group-hover:opacity-100 group-focus-visible:max-w-[12rem] group-focus-visible:opacity-100 sm:inline">
        Chat with us
      </span>
    </a>
  );
}
