import {
  Backpack,
  Ban,
  BedDouble,
  Binoculars,
  Bus,
  Camera,
  Car,
  Check,
  Coffee,
  CreditCard,
  Gift,
  Luggage,
  Map,
  MapPin,
  Mountain,
  Phone,
  Plane,
  Ship,
  ShieldCheck,
  Sun,
  Ticket,
  TrainFront,
  Users,
  Utensils,
  Wifi,
  X,
  type LucideIcon,
} from 'lucide-react'

/**
 * The icons an admin may pick from.
 */
export const ICONS = {
  Check,
  Ban,
  X,
  Utensils,
  Coffee,
  BedDouble,
  Plane,
  Bus,
  Car,
  TrainFront,
  Ship,
  Ticket,
  Luggage,
  Backpack,
  Camera,
  Binoculars,
  Map,
  MapPin,
  Mountain,
  Sun,
  Wifi,
  ShieldCheck,
  Users,
  CreditCard,
  Phone,
  Gift,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS

export const ICON_NAMES = Object.keys(ICONS) as IconName[]

export function isIconName(value: string): value is IconName {
  return value in ICONS
}
